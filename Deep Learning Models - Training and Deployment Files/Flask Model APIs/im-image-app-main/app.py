import pandas as pd
from flask import Flask, jsonify, request

import tensorflow as tf
from tensorflow import keras

import urllib.request

app = Flask(__name__)

model1 = keras.models.load_model('imimage.h5')
image_size = (180, 180)

# routes
@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # get data
    
    #data = request.get_json
    data = request.args['t']

    urllib.request.urlretrieve(data, "image.jpg")
    img = keras.preprocessing.image.load_img("image.jpg", target_size=image_size)
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)  # Create batch axis

    predictions = model1.predict(img_array)

    output = {'results': int(predictions[0])}
    return jsonify(results=output)

@app.errorhandler(500)
def internal_error(error):

    return "500 error"

if __name__ == '__main__':
    app.run(port = 5000, debug=True)
