# FakeCheck
### AI Powered Fake News Detector

A full stack machine learning web app that analyzes news articles and determines whether they are real or fake. Four ML classifiers run in parallel on every submission, each returning an independent confidence score and verdict.

Live: [fake-check-taupe.vercel.app](https://fake-check-taupe.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4-F7931E?logo=scikitlearn&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

&nbsp;

## What it does

Paste any news article into the input field and FakeCheck runs it through four machine learning classifiers simultaneously. Each model returns its own verdict and confidence score. The result page shows a combined verdict, per-model breakdown, and a performance chart comparing all four classifiers. The app falls back to a local mock analyser if the backend is offline so the UI always works.

&nbsp;

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend | Python 3.11, Flask, Flask-CORS, gunicorn |
| ML | scikit-learn, TF-IDF Vectorizer, joblib |
| Models | Logistic Regression, Decision Tree, Gradient Boosting, Random Forest |
| Frontend hosting | Vercel |
| Backend hosting | Render |

&nbsp;

## ML Models

Four classifiers are trained and served simultaneously. Every prediction runs all four and returns individual confidence scores.

| Model | Type | Accuracy | F1 Score |
|---|---|---|---|
| LR | Logistic Regression | 98% | 0.98 |
| DT | Decision Tree | 98% | 0.98 |
| GB | Gradient Boosting | 98% | 0.98 |
| RF | Random Forest | 98% | 0.98 |

Cross-validation F1: 0.978 across 5 folds, confirming no overfitting.

Out-of-distribution accuracy: 9/9 (100%) on unseen real-world articles.

&nbsp;

## Project structure

```
FakeCheck/
├── vercel.json
├── render.yaml
├── requirements.txt
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── ArticleInput.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── SamplePicker.tsx
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── ConfidenceRing.tsx
│   │       └── MetricBar.tsx
│   ├── data/
│   │   └── constants.ts
│   ├── hooks/
│   │   └── useDetector.ts
│   ├── pages/
│   │   ├── DetectPage.tsx
│   │   ├── PerformancePage.tsx
│   │   └── AboutPage.tsx
│   └── types/
│       └── lib/
│           └── utils.ts
└── fake-news-backend/
    ├── app.py
    ├── train.py
    ├── augment.py
    ├── diagnose.py
    ├── Fake.csv
    ├── True.csv
    └── models/
        ├── vectorizer.pkl
        ├── lr.pkl
        ├── dt.pkl
        ├── gb.pkl
        └── rf.pkl
```

&nbsp;

## Getting started

**1. Clone the repo**

```bash
git clone https://github.com/JaiSachdevaa/FakeCheck.git
cd FakeCheck
```

**2. Set up the backend**

```bash
cd fake-news-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python augment.py
python train.py
python app.py
```

API runs at http://localhost:5000

**3. Set up the frontend**

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:5000
```

Then:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

&nbsp;

## API Reference

**GET /**

Health check. Returns loaded model list.

```json
{ "status": "ok", "models": ["lr", "dt", "gb", "rf"] }
```

**POST /predict**

Run prediction using a selected model. Returns that model's result plus all four model results.

Request:
```json
{
  "text": "your news article text here",
  "model": "rf"
}
```

Response:
```json
{
  "model": "rf",
  "isFake": true,
  "label": "Fake",
  "confidence": 94.2,
  "all": {
    "lr": { "isFake": true, "label": "Fake", "confidence": 98.1 },
    "dt": { "isFake": true, "label": "Fake", "confidence": 97.8 },
    "gb": { "isFake": true, "label": "Fake", "confidence": 91.3 },
    "rf": { "isFake": true, "label": "Fake", "confidence": 94.2 }
  }
}
```

**POST /predict/all**

Run all four models and return all results in one call.

&nbsp;

## Environment variables

**Frontend** `.env.local`

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to your Render backend URL in the Vercel dashboard under Environment Variables.

**Backend**

No environment variables required locally. For production, set `ALLOWED_ORIGINS` to your Vercel URL in the Render dashboard to restrict CORS.

| Variable | Description |
|---|---|
| `ALLOWED_ORIGINS` | Your Vercel frontend URL for CORS whitelisting |
| `PORT` | Port for gunicorn, Render sets this automatically |

&nbsp;

## Deployment

**Backend on Render**

Connect your GitHub repo. Set Build Command to `pip install -r requirements.txt`, Start Command to `cd fake-news-backend && /opt/render/project/src/.venv/bin/gunicorn app:app`. Add `ALLOWED_ORIGINS` in the Render environment variables pointing to your Vercel URL.

**Frontend on Vercel**

Import the repo on Vercel. It auto-detects Vite. Add `VITE_API_URL` as an environment variable pointing to your Render backend URL before deploying.

&nbsp;

## Engineering Notes

**The overfitting problem**

The WELFake dataset has a structural bias. Real articles are Reuters wire stories and fake articles are conspiracy blog posts. Without intervention, models reach 99%+ accuracy by learning writing style rather than factual patterns. A model that sees a Reuters dateline classifies the article as real. A model that sees emotional all-caps language classifies it as fake. Neither is learning anything meaningful about truth.

**Fixes applied**

Reuters datelines and bylines are stripped during preprocessing so the model cannot use source identity as a signal. TF-IDF constraints are applied with min_df=5, max_df=0.85, and max_features=50000 to prevent rare and overly common tokens from dominating. Depth limits are added to tree-based models with max_depth=20 and min_samples_leaf=5. Numeric tokens are preserved because financial language like "89.5 billion" and "4.5 percent" is a genuine real-news signal that earlier preprocessing was incorrectly stripping.

**The business news gap**

The training dataset contains almost no business or tech journalism in the real class. This caused every model to classify Apple earnings reports and Tesla delivery numbers as fake, not because they are, but because the models had never seen that vocabulary associated with real news. 30 Reuters-style business news articles were added covering tech earnings, Federal Reserve decisions, banking, energy, retail, pharma, airlines, semiconductors, and crypto.

**OOD testing**

A custom out-of-distribution test runs at the end of every training session using 9 articles not from the training distribution. This gives an honest estimate of real-world performance rather than just hold-out accuracy on the same biased dataset. Final result: 9/9 across all four models.

&nbsp;

## Dataset

WELFake dataset sourced from Kaggle, combining four news datasets: Kaggle, McIntire, Reuters, and BuzzFeed Political. Approximately 72,000 articles split evenly between real and fake classes.

&nbsp;

## License

MIT © 2025 Jai Sachdeva
