from flask import Flask, request
import numpy as np
import tensorflow as tf
from flask_cors import CORS, cross_origin
from PIL import Image
from flask import jsonify
import os
from googleapiclient import discovery
import json
app = Flask(__name__)
CORS(app)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="NTP.json"

@app.route('/predict', methods=['POST'])
def ifTornado():
    ans = None
    print("ran")
    output = {}
    service = discovery.build('ml', 'v1')
    for path in request.files.getlist('file'):
        print(path)
        img = Image.open(path).convert("RGB")
        img = img.resize((150,150))
        x = tf.keras.preprocessing.image.img_to_array(img)
        x = x / 255.0
        x = np.expand_dims(x, axis=0)
        images = np.vstack([x]).tolist()
        classes = (
            service.projects()
            .predict(
                name="projects/ntp-tornado/models/NTP_isTornado/versions/v1",
                body={"instances": images},
            )
            .execute()
        )
        print(classes)
        if classes['predictions'][0]['dense'][0] < 0.5:
            output[path.filename] = True
        else:
            output[path.filename] = False
    print(output)
    return jsonify(output)


if __name__ == "__main__":
    print(("* Loading Keras model and Flask starting server..."
           "please wait until server has fully started"))
    app.run(debug=True,host="0.0.0.0",use_reloader=True)
