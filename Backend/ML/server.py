import os
import sys
from werkzeug.utils import secure_filename


def _ensure_backend_venv_python():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.abspath(
        os.path.join(current_dir, "..", "venv", "Scripts", "python.exe")
    )

    if not os.path.exists(venv_python):
        return

    if os.path.abspath(sys.executable) == venv_python:
        return

    os.execv(venv_python, [venv_python] + sys.argv)


_ensure_backend_venv_python()

from flask import Flask, request, jsonify
from flask_cors import CORS
from prediction import predict_image, warm_model

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Server Running"


@app.route('/health')
def health():
    try:
        warm_model()
        return jsonify({
            "ok": True,
            "modelLoaded": True,
        }), 200
    except Exception as error:
        return jsonify({
            "ok": False,
            "modelLoaded": False,
            "error": str(error),
        }), 500

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return jsonify({
            'message': 'Use POST with multipart form-data and field name "file".',
            'example': 'curl.exe -X POST -F "file=@C:\\\\full\\\\path\\\\leaf.jpg" http://127.0.0.1:5001/predict'
        }), 200

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    safe_filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_DIR, safe_filename)
    file.save(filepath)

    try:
        result = predict_image(filepath)
        return jsonify(result)
    except Exception as error:
        return jsonify({
            'error': 'Prediction failed. Please upload a valid leaf image.',
            'details': str(error)
        }), 400


if __name__ == '__main__':
    port = int(os.environ.get("PORT", "5001"))
    app.run(host="0.0.0.0", debug=False, port=port)

