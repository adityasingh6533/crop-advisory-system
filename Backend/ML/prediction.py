import os
from functools import lru_cache

import numpy as np
from keras.models import load_model
from keras.preprocessing import image

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "plant_disease_model.h5"
)

classes = [
    "Apple Scab",
    "Apple Black Rot",
    "Apple Cedar Rust",
    "Apple Healthy",
    "Blueberry Healthy",
    "Cherry Powdery Mildew",
    "Cherry Healthy",
    "Corn Cercospora Leaf Spot",
    "Corn Common Rust",
    "Corn Northern Leaf Blight",
    "Corn Healthy",
    "Grape Black Rot",
    "Grape Esca (Black Measles)",
    "Grape Leaf Blight",
    "Grape Healthy",
    "Orange Huanglongbing (Citrus Greening)",
    "Peach Bacterial Spot",
    "Peach Healthy",
    "Bell Pepper Bacterial Spot",
    "Bell Pepper Healthy",
    "Potato Early Blight",
    "Potato Late Blight",
    "Potato Healthy",
    "Raspberry Healthy",
    "Soybean Healthy",
    "Squash Powdery Mildew",
    "Strawberry Leaf Scorch",
    "Strawberry Healthy",
    "Tomato Bacterial Spot",
    "Tomato Early Blight",
    "Tomato Late Blight",
    "Tomato Leaf Mold",
    "Tomato Septoria Leaf Spot",
    "Tomato Spider Mites",
    "Tomato Target Spot",
    "Tomato Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus",
    "Tomato Healthy",
]


@lru_cache(maxsize=1)
def get_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            "Model file not found at Backend/ML/plant_disease_model.h5"
        )

    return load_model(MODEL_PATH)


def warm_model():
    get_model()
    return True


def predict_image(img_path):
    model = get_model()

    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array, verbose=0)
    class_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction) * 100)

    if class_index >= len(classes):
        return {
            "label": f"Unknown Class ({class_index})",
            "confidence": round(confidence, 2)
        }

    return {
        "label": classes[class_index],
        "confidence": round(confidence, 2)
    }
