import cv2
import numpy as np
import time
import tensorflow as tf
from tensorflow.keras.models import load_model

# Define the paths to the model files
PROTOTXT_PATH = "face_detector/deploy.prototxt"
FACE_DETECTION_MODEL_PATH = "face_detector/res10_300x300_ssd_iter_140000.caffemodel"
# Using the user-specified model file
MASK_MODEL_PATH = "mask_recog.h5"

# --- Configuration ---
CONFIDENCE_THRESHOLD_FACE = 0.5  # Minimum confidence for face detection
# ASSUMPTIONS FOR MASK MODEL (adjust if known):
# Using common values for Keras models, based on previous attempts
MASK_MODEL_INPUT_SIZE = (
    224,
    224,
)  # Expected input size for the mask model (height, width)
MASK_MODEL_PREPROCESSING_SCALE = (
    1.0 / 255.0
)  # Scaling factor for pixel values (e.g., 0-1)
# ASSUMPTION: Model outputs probabilities for [mask, no_mask]
MASK_MODEL_OUTPUT_CLASSES = ["Mask", "No Mask"]
MASK_CONFIDENCE_THRESHOLD = 0.6  # Using a lenient confidence threshold

print("[INFO] Loading face detection model...")
try:
    net_face = cv2.dnn.readNetFromCaffe(PROTOTXT_PATH, FACE_DETECTION_MODEL_PATH)
    print("[INFO] Face detection model loaded successfully.")
except cv2.error as e:
    print(f"[ERROR] Failed to load face detection model: {e}")
    print(
        f"Please ensure '{PROTOTXT_PATH}' and '{FACE_DETECTION_MODEL_PATH}' exist in the 'face_detector' directory relative to the script."
    )
    exit()

print("[INFO] Loading face mask detection model...")
try:
    # Load the Keras face mask detection model
    mask_model = load_model(MASK_MODEL_PATH)
    print("[INFO] Face mask detection model loaded successfully.")
except Exception as e:
    print(f"[ERROR] Failed to load mask detection model: {e}")
    print(
        f"Please ensure '{MASK_MODEL_PATH}' exists and TensorFlow/Keras are correctly installed and compatible."
    )
    exit()

print("[INFO] Starting video stream...")
vs = cv2.VideoCapture(0)
time.sleep(2.0)

if not vs.isOpened():
    print("[ERROR] Could not open webcam.")
    exit()

# --- Main Loop ---
while True:
    ret, frame = vs.read()
    if not ret:
        print("[ERROR] Failed to grab frame. Exiting...")
        break

    (h, w) = frame.shape[:2]

    # --- Face Detection ---
    blob_face = cv2.dnn.blobFromImage(
        cv2.resize(frame, (300, 300)),
        scalefactor=1.0,
        size=(300, 300),
        mean=(104.0, 177.0, 123.0),
        swapRB=False,
        crop=False,
    )
    net_face.setInput(blob_face)
    detections = net_face.forward()

    for i in range(0, detections.shape[2]):
        confidence_face = detections[0, 0, i, 2]

        if confidence_face > CONFIDENCE_THRESHOLD_FACE:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")

            startX, startY = max(0, startX), max(0, startY)
            endX, endY = min(w, endX), min(h, endY)

            face_roi = frame[startY:endY, startX:endX]

            mask_label = None
            color = (255, 0, 0)  # Default color for face detection box (blue)
            text_y_pos = startY - 10 if startY - 10 > 10 else startY + 10

            # --- Face Mask Detection ---
            if face_roi.size > 0:
                try:
                    img_for_mask = cv2.resize(face_roi, MASK_MODEL_INPUT_SIZE)
                    img_for_mask = img_for_mask * MASK_MODEL_PREPROCESSING_SCALE
                    img_for_mask = np.expand_dims(img_for_mask, axis=0)

                    predictions_mask = mask_model.predict(img_for_mask, verbose=0)

                    # Interpret the prediction
                    # ASSUMPTION: model outputs probabilities for [mask, no_mask]
                    mask_confidence = predictions_mask[0][
                        0
                    ]  # ASSUMPTION: Index 0 is Mask probability
                    no_mask_confidence = predictions_mask[0][
                        1
                    ]  # ASSUMPTION: Index 1 is No Mask probability

                    if mask_confidence > MASK_CONFIDENCE_THRESHOLD:
                        mask_label = f"{MASK_MODEL_OUTPUT_CLASSES[0]} ({mask_confidence * 100:.1f}%)"  # Should be "Mask"
                        color = (0, 255, 0)  # Green for mask
                    else:
                        mask_label = f"{MASK_MODEL_OUTPUT_CLASSES[1]} ({no_mask_confidence * 100:.1f}%)"  # Should be "No Mask"
                        color = (0, 0, 255)  # Red for no mask

                except Exception as e:
                    print(f"[WARNING] Error processing face for mask detection: {e}")
                    mask_label = "Error Masking"
                    color = (255, 0, 0)

            # Draw the face detection bounding box with status and confidence
            face_label = f"Face: {confidence_face * 100:.2f}%"
            cv2.rectangle(frame, (startX, startY), (endX, endY), color, 2)

            if mask_label:
                cv2.putText(
                    frame,
                    mask_label,
                    (
                        startX,
                        text_y_pos - 20 if text_y_pos - 20 > 10 else text_y_pos + 20,
                    ),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.45,
                    color,
                    2,
                )

            if (
                not mask_label or "Error" in mask_label
            ):  # Fallback to face detection label if mask label is not set or errored
                cv2.putText(
                    frame,
                    face_label,
                    (startX, text_y_pos),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.45,
                    (255, 0, 0),
                    2,
                )

    cv2.imshow("Face Mask Detection", frame)

    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        break

print("[INFO] Releasing webcam and closing windows...")
vs.release()
cv2.destroyAllWindows()
print("[INFO] Application finished.")
