import easyocr

reader = easyocr.Reader(['id'], gpu=False)

def recognize_text(image):
    plat_number = ''
    detections = reader.readtext(image)

    for detection in detections:
        text = detection[1]
        if detection[0][1][1] < image.shape[0] / 2:
            plat_number += text.upper().replace(' ', '')
    
    return plat_number