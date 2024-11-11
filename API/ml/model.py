import tensorflow as tf
import numpy as np

# Load model
model = tf.keras.models.load_model("path/to/model.h5")

def predict_image(image_array):
    image_array = np.expand_dims(image_array, axis=0)
    predictions = model.predict(image_array)
    return int(np.argmax(predictions, axis=1)[0])