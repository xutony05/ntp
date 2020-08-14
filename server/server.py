from flask import Flask, request
import numpy as np
from keras.preprocessing import image
import tensorflow as tf
from flask_cors import CORS, cross_origin
from PIL import Image

app = Flask(__name__)
CORS(app)


def init():
    global model
    model = tf.keras.models.load_model('./server/1')
    print("***model loaded***")

# Testing URL
@app.route('/hello', methods=['GET', 'POST'])
def hello_world():
    return 'Hello, World!'

@app.route('/predict', methods=['POST'])
def ifTornado():
    ans = None
    print("ran")
    output = {}
    for path in request.files.getlist('file'):
        print(path)
        img = Image.open(path).convert("RGB")
        img = img.resize((300,300))
        x = image.img_to_array(img)
        x = x / 255.0
        x = np.expand_dims(x, axis=0)
        images = np.vstack([x])
        classes = model.predict(images)
        print(classes)
        if classes[0] > 0.5:
            output[path.filename] = True
        else:
            output[path.filename] = False
    return (output)


if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
           "please wait until server has fully started"))
    init()
    app.run(debug=True,host="0.0.0.0",use_reloader=True)
