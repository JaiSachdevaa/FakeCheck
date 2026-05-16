"""
diagnose.py  –  figure out WHY the 3 business articles are misclassified
Run this BEFORE changing anything:
    python diagnose.py
"""
import re, string, joblib
import numpy as np

MODEL_DIR = "models"

vectorizer = joblib.load(f"{MODEL_DIR}/vectorizer.pkl")
models = {
    "lr": joblib.load(f"{MODEL_DIR}/lr.pkl"),
    "dt": joblib.load(f"{MODEL_DIR}/dt.pkl"),
    "gb": joblib.load(f"{MODEL_DIR}/gb.pkl"),
    "rf": joblib.load(f"{MODEL_DIR}/rf.pkl"),
}

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

FAILING = [
    "Apple announced its quarterly earnings, reporting revenue of 89 billion dollars, slightly above analyst expectations. CEO Tim Cook cited strong iPhone demand.",
    "Microsoft reported net income of 22 billion dollars for the quarter, driven by cloud services growth. Shares rose 4 percent in after-hours trading.",
    "Tesla delivered 435000 vehicles in the third quarter, missing Wall Street estimates. The company cited supply chain constraints as a key factor.",
]

PASSING = [
    "The Federal Reserve raised interest rates by 25 basis points on Wednesday, as policymakers continued efforts to curb inflation, officials confirmed.",
    "Parliament approved a new climate bill on Thursday after months of debate. The legislation sets binding emissions targets for 2035, according to officials.",
]

print("=" * 60)
print("1. WHAT TOKENS SURVIVE PREPROCESSING?")
print("=" * 60)
for label, samples in [("FAILING (classified as Fake)", FAILING), ("PASSING (classified as Real)", PASSING)]:
    print(f"\n  [{label}]")
    for s in samples:
        cleaned = wordopt(s)
        print(f"    Original : {s[:80]}...")
        print(f"    Cleaned  : {cleaned}")
        print()

print("=" * 60)
print("2. WHICH TOKENS ARE IN THE VECTORIZER VOCABULARY?")
print("=" * 60)
vocab = vectorizer.vocabulary_
for s in FAILING[:1]:  # just Apple as example
    cleaned = wordopt(s)
    tokens = cleaned.split()
    in_vocab  = [t for t in tokens if t in vocab]
    out_vocab = [t for t in tokens if t not in vocab]
    print(f"\n  Article: {s[:60]}...")
    print(f"  Tokens IN vocab  ({len(in_vocab)}): {in_vocab}")
    print(f"  Tokens NOT in vocab ({len(out_vocab)}): {out_vocab}")

print("\n" + "=" * 60)
print("3. CONFIDENCE SCORES (how sure is each model?)")
print("=" * 60)
for label, samples in [("FAILING", FAILING), ("PASSING", PASSING)]:
    print(f"\n  [{label}]")
    for s in samples:
        vec = vectorizer.transform([wordopt(s)])
        print(f"  {s[:55]}...")
        for key, clf in models.items():
            if hasattr(clf, "predict_proba"):
                proba = clf.predict_proba(vec)[0]
                pred  = clf.predict(vec)[0]
                conf  = max(proba) * 100
                print(f"    {key.upper()}: pred={'Real' if pred==1 else 'Fake':4s}  fake_prob={proba[0]*100:.1f}%  real_prob={proba[1]*100:.1f}%  conf={conf:.1f}%")
        print()

print("=" * 60)
print("4. TOP FEATURES PUSHING TOWARD 'FAKE' FOR APPLE ARTICLE")
print("=" * 60)
apple_cleaned = wordopt(FAILING[0])
apple_vec     = vectorizer.transform([apple_cleaned])

lr = models["lr"]
# For LR: positive coefficient = Real, negative = Fake
feature_names = vectorizer.get_feature_names_out()
apple_dense   = apple_vec.toarray()[0]
present_mask  = apple_dense > 0
present_features = feature_names[present_mask]
present_weights  = lr.coef_[0][present_mask]
present_tfidf    = apple_dense[present_mask]

# Sort by contribution (weight * tfidf value)
contribution = present_weights * present_tfidf
sorted_idx   = np.argsort(contribution)

print(f"\n  Apple article tokens + their LR weights (negative = pushes toward Fake):")
print(f"  {'Token':<20} {'LR weight':>12}  {'TF-IDF':>8}  {'Contribution':>14}")
print(f"  {'-'*20} {'-'*12}  {'-'*8}  {'-'*14}")
for i in sorted_idx:
    tok   = present_features[i]
    w     = present_weights[i]
    tfidf = present_tfidf[i]
    contrib = contribution[i]
    direction = "→ FAKE" if w < 0 else "→ Real"
    print(f"  {tok:<20} {w:>12.4f}  {tfidf:>8.4f}  {contrib:>14.4f}  {direction}")