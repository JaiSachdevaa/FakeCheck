import os
import re
import string
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# ── CORS: allow your Vercel frontend URL ─────────────────────────────────────
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*")
CORS(app, origins=ALLOWED_ORIGINS)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# ── Load artefacts ────────────────────────────────────────────────────────────
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

# ── Preprocessing (MUST match train.py exactly) ───────────────────────────────
def wordopt(text: str) -> str:
    text = text.lower()
    text = re.sub(r'^[a-z\s,\.]+\([^)]+\)\s*[-–—]\s*', '', text)
    text = re.sub(r'\bby [a-z]+ [a-z]+\b', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\b(?=[a-z]+\d|\d+[a-z])[a-z0-9]+\b', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ── Core prediction logic ─────────────────────────────────────────────────────
def run_all_models(text: str) -> dict:
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

# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ok", "models": list(models.keys())})


@app.route("/predict", methods=["POST"])
def predict():
    body = request.get_json(silent=True)
    if not body or "text" not in body:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    text     = str(body["text"]).strip()
    model_id = str(body.get("model", "rf")).lower()

    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400

    if len(text.split()) < 5:
        return jsonify({"error": "Text too short - please provide at least a sentence"}), 400

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
    body = request.get_json(silent=True)
    if not body or "text" not in body:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = str(body["text"]).strip()
    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400

    return jsonify(run_all_models(text))


if __name__ == "__main__":
    # debug=False in production — gunicorn handles this anyway
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))