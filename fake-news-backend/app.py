import os
import re
import string
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# Load artefacts
try:
    vectorizer = joblib.load(os.path.join(MODEL_DIR, "vectorizer.pkl"))
    models = {
        "lr": joblib.load(os.path.join(MODEL_DIR, "lr.pkl")),
        "dt": joblib.load(os.path.join(MODEL_DIR, "dt.pkl")),
        "gb": joblib.load(os.path.join(MODEL_DIR, "gb.pkl")),
        "rf": joblib.load(os.path.join(MODEL_DIR, "rf.pkl")),
    }
    print("✅  All models loaded successfully.")
except FileNotFoundError as e:
    raise SystemExit(
        f"\n❌  Model files not found: {e}"
        "\n    Run  python train.py  first to generate the .pkl files.\n"
    )

# Preprocessing
def wordopt(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\W', ' ', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def run_all_models(text: str) -> dict:
    """Vectorise text and run all four classifiers."""
    cleaned    = wordopt(text)
    vectorized = vectorizer.transform([cleaned])

    results = {}
    for model_id, model in models.items():
        pred = int(model.predict(vectorized)[0])   

        if hasattr(model, "predict_proba"):
            proba      = model.predict_proba(vectorized)[0]
            confidence = round(float(max(proba)) * 100, 1)
        else:
            confidence = 100.0

        results[model_id] = {
            "prediction": pred,
            "label":      "Real" if pred == 1 else "Fake",
            "isFake":     pred == 0,
            "confidence": confidence,
        }
    return results


# Routes

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "models": list(models.keys())})


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST body:  { "text": "...", "model": "rf" }
                model defaults to "rf", options: lr | dt | gb | rf

    Response:
    {
      "model": "rf",
      "isFake": true,
      "label": "Fake",
      "confidence": 94.2,
      "all": {
        "lr": { "isFake": true,  "label": "Fake", "confidence": 98.1, "prediction": 0 },
        "dt": { ... },
        "gb": { ... },
        "rf": { ... }
      }
    }
    """
    body = request.get_json(silent=True)
    if not body or "text" not in body:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    text     = str(body["text"]).strip()
    model_id = str(body.get("model", "rf")).lower()

    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400

    if model_id not in models:
        return jsonify({"error": f"Unknown model '{model_id}'. Use: {list(models.keys())}"}), 400

    all_results = run_all_models(text)
    chosen      = all_results[model_id]

    return jsonify({
        "model":      model_id,
        "isFake":     chosen["isFake"],
        "label":      chosen["label"],
        "confidence": chosen["confidence"],
        "all":        all_results,     
    })


@app.route("/predict/all", methods=["POST"])
def predict_all():
    """Run all four models and return all results."""
    body = request.get_json(silent=True)
    if not body or "text" not in body:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = str(body["text"]).strip()
    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400

    return jsonify(run_all_models(text))


if __name__ == "__main__":
    app.run(debug=True, port=5000)