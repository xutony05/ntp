from flask import Flask, request
import numpy as np
from keras.preprocessing import image
import tensorflow as tf
from flask_cors import CORS, cross_origin
from PIL import Image
from google.cloud import storage

app = Flask(__name__)
CORS(app)


def init():
    global model
    model = tf.keras.models.load_model('./server/2')
    print("***model loaded***")

@app.route('/predict', methods=['POST'])
def ifTornado():
    ans = None
    print("ran")
    output = {}
    print(request)
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
        gcs = storage.Client.from_service_account_json('./server/neuralstyletransfer.json')
        bucket = gcs.get_bucket('unlabelled-data')
        if classes[0][0] < 0.5:
            output[path.filename] = True
            blob = bucket.blob("Tornadic/" + path.filename)
            blob.upload_from_string(
                path.read(),
                content_type=path.content_type
            )
        else:
            output[path.filename] = False
            blob = bucket.blob("Non-tornadic/" + path.filename)
            blob.upload_from_string(
                path.read(),
                content_type=path.content_type
            )
    return (output)

@app.route('/upload-tornadic', methods=['POST'])
def uploadTornadic():
    uploaded_file = request.files.get('file')
    gcs = storage.Client.from_service_account_json('./server/neuralstyletransfer.json')
    bucket = gcs.get_bucket('ntp-labelled-data')
    blob = bucket.blob("Tornadic/" + uploaded_file.filename)
    blob.upload_from_string(
                uploaded_file.read(),
                content_type=uploaded_file.content_type
            )
    return blob.public_url

@app.route('/upload-nontornadic', methods=['POST'])
def uploadNontornadic():
    uploaded_file = request.files.get('file')
    gcs = storage.Client.from_service_account_json('./server/neuralstyletransfer.json')
    bucket = gcs.get_bucket('ntp-labelled-data')
    blob = bucket.blob("Non-tornadic/" + uploaded_file.filename)
    blob.upload_from_string(
                uploaded_file.read(),
                content_type=uploaded_file.content_type
            )
    return blob.public_url

if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
           "please wait until server has fully started"))
    init()
    app.run(debug=True,host="0.0.0.0",use_reloader=False)
