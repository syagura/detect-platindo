import cv2 as cv

def encode_image_to_bytes(img):
    img = cv.resize(img, (img.shape[1], img.shape[0]), fx=0.2, fy=0.2)
    _, buffer = cv.imencode('.png', img)
    return buffer.tobytes()