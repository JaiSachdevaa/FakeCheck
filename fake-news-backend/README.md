# Fake News Detector — Flask Backend

REST API wrapping the four scikit-learn classifiers trained in the notebook.

## Folder structure

```
fake-news-backend/
├── app.py            ← Flask API server
├── train.py          ← One-time training script
├── requirements.txt
├── models/           ← Created after running train.py (git-ignored)
│   ├── vectorizer.pkl
│   ├── lr.pkl
│   ├── dt.pkl
│   ├── gb.pkl
│   └── rf.pkl
├── Fake.csv          ← Place your dataset here
└── True.csv          ← Place your dataset here
```

## Setup

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Place Fake.csv and True.csv in this folder, then train
python train.py

# 4. Start the API server
python app.py
# → Running on http://localhost:5000
```

## API Endpoints

### GET /
Health check — returns list of loaded models.

### POST /predict
Run a single model on the input text.

**Request body:**
```json
{
  "text": "Your news article text here...",
  "model": "rf"
}
```
`model` is optional (defaults to `"rf"`). Options: `lr`, `dt`, `gb`, `rf`

**Response:**
```json
{
  "model": "rf",
  "isFake": true,
  "label": "Fake",
  "confidence": 94.2,
  "all": {
    "lr": { "isFake": true,  "label": "Fake", "confidence": 98.1 },
    "dt": { "isFake": true,  "label": "Fake", "confidence": 100.0 },
    "gb": { "isFake": true,  "label": "Fake", "confidence": 97.3 },
    "rf": { "isFake": true,  "label": "Fake", "confidence": 94.2 }
  }
}
```

### POST /predict/all
Same as above but always returns all four model results.

## Connect to React frontend

Create a `.env` file in your React project root:
```
VITE_API_URL=http://localhost:5000
```

Then replace `src/hooks/useDetector.ts` with the provided `useDetector.ts`.
The hook automatically falls back to the local mock analyser if the Flask API is offline.
