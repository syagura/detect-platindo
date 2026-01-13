import easyocr
import cv2 as cv
import numpy as np
import re

print("Loading EasyOCR reader...")
reader = easyocr.Reader(['en'], gpu=False, verbose=False)
print("EasyOCR loaded")

def deskew_plate(image):
    """
    Auto-straighten plat miring setelah crop
    """
    if image is None or image.size == 0:
        return image
    
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY) if len(image.shape) == 3 else image

    # Detect edges
    edges = cv.Canny(gray, 50, 150, apertureSize=3)

    # Detect lines dengan Hough Transform
    lines = cv.HoughLinesP(edges, 1, np.pi/180, threshold=50,
                            minLineLength=int(gray.shape[1] * 0.3),
                            maxLineGap=10)
    
    if lines is None or len(lines) == 0:
        return image
    
    # Calculate angles dari detected lines 
    angles = []
    for line in lines:
        x1, y1, x2, y2 = line[0]
        angle = np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi

        # Filter extreme angles 
        if -45 < angle < 45:
            angles.append(angle)

    if not angles:
        return image
    
    # Get median angle (robust to outliers)
    median_angle = np.median(angles)

    # Only rotate kalau significant skew
    if abs(median_angle) > 2:
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv.getRotationMatrix2D(center, median_angle, 1.0)

        # Calculate new dimensions 
        cos = np.abs(M[0, 0])
        sin = np.abs(M[0, 1])
        new_w = int((h * sin) + (w * cos))
        new_h = int((h * cos) + (w * sin))

        # Adjust transformation matrix
        M[0, 2] += (new_w / 2) - center[0]
        M[1, 2] += (new_h / 2) - center[1]

        rotated = cv.warpAffine(image, M, (new_w, new_h),
                                flags=cv.INTER_CUBIC,
                                borderMode=cv.BORDER_REPLICATE)
        
        print(f"Deskew by {median_angle:.1f}°")
        return rotated
    
    return image

def recognize_text(image, plate_type='plat_putih'):
    """
    OCR dengan deskew + rotation check
    """
    if reader is None or image is None or image.size == 0:
        return "Unknown"
    
    try:
        image = deskew_plate(image)

        h, w = image.shape[:2]
        if h < 50:
            scale = 80 / h
            image = cv.resize(image, (int(w * scale), 80), interpolation=cv.INTER_CUBIC)

        best_result = ""
        best_confidence = 0
        best_rotation = 0

        rotations = [
            (0, image),
            (180, cv.rotate(image, cv.ROTATE_180))
        ]

        for angle, rotated_img in rotations:
            try:
                # EasyOCR detection
                detections = reader.readtext(rotated_img, paragraph=False)

                if not detections:
                    continue

                # Extract text dari upper half (filter bulan/tahun)
                plate_text = ''
                confidences = []
                for detection in detections:
                    bbox, text, conf = detection

                    # Check kalau text di upper half
                    if bbox[0][1] < rotated_img.shape[0] / 2:
                        # Ensure text is string
                        text_str = str(text).upper().replace(' ', '')
                        plate_text += text_str
                        confidences.append(conf)

                if not plate_text or not confidences:
                    continue

                # Average confidence
                avg_conf = sum(confidences) / len(confidences)
                print(f"OCR: '{plate_text}' (conf: {avg_conf:.2f})")

                # Update best result 
                if avg_conf > best_confidence:
                    best_confidence = avg_conf
                    best_result = plate_text
                    best_rotation = angle

            except Exception as e:
                print(f"Error at rotation {angle}°: {e}")
                continue
        
        if not best_result:
            return "Unknown"
        
        print(f"Best: {best_rotation}° (conf: {best_confidence:.2f})")

        # Ensure best_result is string before cleaning
        text = str(best_result).upper()
        
        # Cleanup format
        text = text.replace('O', '0').replace('I', '1').replace('|', '1')
        text = text.replace('*', '')  # Remove asterisk
        text = ' '.join(text.split())

        formatted = fix_indonesia_plate(text)

        return formatted if formatted else "Unknown"
    
    except Exception as e:
        print(f"OCR error: {e}")
        import traceback
        traceback.print_exc()
        return "Unknown"
    
def fix_indonesia_plate(text):
    """
    Hybrid format fixer: Regex + parsing
    """
    if not text or len(text) < 3:
        return text
    
    # Ensure text is string
    text = str(text)
    
    clean = text.replace(' ', '').upper()
    
    # Remove special characters
    clean = ''.join(c for c in clean if c.isalnum())

    # Regex match
    regex_match = re.findall(r"[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}", clean)

    if regex_match:
        matched = regex_match[0]

        # Validate length 
        if len(matched) >= 4:
            prefix = ""
            middle = ""
            suffix = ""

            i = 0
            while i < len(matched) and matched[i].isalpha():
                prefix += matched[i]
                i += 1

            while i < len(matched) and matched[i].isdigit():
                middle += matched[i]
                i += 1

            while i < len(matched) and matched[i].isalpha():
                suffix += matched[i]
                i += 1
            
            if prefix and middle and suffix:
                return f"{prefix} {middle} {suffix}"

    # Fallback parsing
    prefix = ""
    middle = ""
    suffix = ""

    i = 0
    while i < len(clean) and clean[i].isalpha():
        prefix += clean[i]
        i += 1

    while i < len(clean) and clean[i].isdigit():
        middle += clean[i]
        i += 1

    while i < len(clean) and clean[i].isalpha():
        suffix += clean[i]
        i += 1

    if prefix and middle and suffix:
        if len(prefix) > 2:
            prefix = prefix[:2]
        if len(middle) > 4:
            middle = middle[:4]
        if len(suffix) > 3:
            suffix = suffix[:3]

        return f"{prefix} {middle} {suffix}"        
    
    # Handle reversed format 
    if len(prefix) > 2 and suffix and len(suffix) <= 2:
        return f"{suffix} {middle} {prefix[:2]}"
    
    return text