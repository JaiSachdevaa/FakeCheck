import os
import re
import string
import argparse
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# ── CLI args ──────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--fake", default="Fake.csv", help="Path to Fake.csv")
parser.add_argument("--true", default="True.csv", help="Path to True.csv")
parser.add_argument("--out",  default="models",   help="Output directory for .pkl files")
args = parser.parse_args()

os.makedirs(args.out, exist_ok=True)

# ── Load data ─────────────────────────────────────────────────────────────────
print("📂  Loading datasets...")
data_fake = pd.read_csv(args.fake)
data_true  = pd.read_csv(args.true)

data_fake["class"] = 0
data_true["class"]  = 1

# Reserve last 10 rows of each for manual testing
data_fake = data_fake.iloc[:-10]
data_true  = data_true.iloc[:-10]

data = pd.concat([data_fake, data_true], axis=0)
data = data.drop(["title", "subject", "date"], axis=1)
data = data.dropna(subset=["text"])
data = data.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"✅  Dataset: {len(data):,} rows  |  Fake: {(data['class']==0).sum():,}  |  Real: {(data['class']==1).sum():,}")

# ── Preprocessing ─────────────────────────────────────────────────────────────
def wordopt(text: str) -> str:
    text = text.lower()
    # Strip Reuters/AP datelines like "WASHINGTON (Reuters) -"
    text = re.sub(r'^[a-z\s,\.]+\([^)]+\)\s*[-–—]\s*', '', text)
    # Strip bylines like "by john smith"
    text = re.sub(r'\bby [a-z]+ [a-z]+\b', '', text)
    # Strip URLs and HTML before anything else
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'\[.*?\]', '', text)
    # Remove mixed alphanumeric codes (e.g. "h1b", "covid19", "f35") but KEEP plain numbers
    # Plain numbers like "89", "25", "2025" carry financial/statistical meaning in real news
    text = re.sub(r'\b(?=[a-z]+\d|\d+[a-z])[a-z0-9]+\b', '', text)
    # Strip punctuation (replace with space to avoid merging words)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

print("🔧  Preprocessing text...")
data["text"] = data["text"].apply(wordopt)

x = data["text"]
y = data["class"]

# ── Train / test split ────────────────────────────────────────────────────────
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.25, random_state=42, stratify=y  # ← added stratify
)

# ── TF-IDF vectorizer (with overfitting guards) ───────────────────────────────
print("📐  Fitting TF-IDF vectorizer...")
vectorizer = TfidfVectorizer(
    max_features=50000,   # cap vocabulary size
    min_df=5,             # ignore terms in fewer than 5 documents
    max_df=0.85,          # ignore terms in more than 85% of documents
    sublinear_tf=True,    # apply log normalization to term frequencies
    ngram_range=(1, 2),   # unigrams + bigrams (trigrams tend to overfit)
)

xv_train = vectorizer.fit_transform(x_train)
xv_test  = vectorizer.transform(x_test)

joblib.dump(vectorizer, os.path.join(args.out, "vectorizer.pkl"))
print(f"    Saved → {args.out}/vectorizer.pkl")
print(f"    Vocabulary size: {len(vectorizer.vocabulary_):,} features")

# ── Classifiers (with regularization / depth limits) ─────────────────────────
classifiers = {
    "lr": LogisticRegression(
        C=1.0,           # regularization strength (lower = more regularized)
        max_iter=1000,
        solver='saga',   # efficient for large sparse data
        random_state=42,
    ),
    "dt": DecisionTreeClassifier(
        max_depth=20,          # was unlimited — unlimited trees memorize training data
        min_samples_leaf=5,    # each leaf needs at least 5 samples
        random_state=42,
    ),
    "gb": GradientBoostingClassifier(
        n_estimators=100,
        max_depth=5,           # shallow trees generalize better
        learning_rate=0.1,
        random_state=0,
    ),
    "rf": RandomForestClassifier(
        n_estimators=200,
        max_depth=20,          # was unlimited
        min_samples_leaf=5,    # same as DT
        max_features='sqrt',   # only consider sqrt(features) per split
        random_state=0,
        n_jobs=-1,             # use all CPU cores
    ),
}

labels = {
    "lr": "Logistic Regression",
    "dt": "Decision Tree",
    "gb": "Gradient Boost",
    "rf": "Random Forest",
}

# ── Train, evaluate, save ─────────────────────────────────────────────────────
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for key, clf in classifiers.items():
    print(f"\n🚀  Training {labels[key]}...")
    clf.fit(xv_train, y_train)

    preds    = clf.predict(xv_test)
    accuracy = accuracy_score(y_test, preds)
    print(f"    Hold-out Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, preds, target_names=["Fake", "Real"]))

    # Cross-validation score to check for overfitting
    print(f"    Running 5-fold CV (this may take a moment for GB/RF)...")
    cv_scores = cross_val_score(clf, xv_train, y_train, cv=skf, scoring='f1', n_jobs=-1)
    print(f"    CV F1: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    if accuracy - cv_scores.mean() > 0.05:
        print(f"    ⚠️  Warning: hold-out acc is much higher than CV F1 — possible overfitting")

    out_path = os.path.join(args.out, f"{key}.pkl")
    joblib.dump(clf, out_path)
    print(f"    Saved → {out_path}")

# ── Out-of-distribution (OOD) test ───────────────────────────────────────────
# These are random internet-style articles NOT from the training distribution.
# If models fail here, they are memorizing style not learning truth patterns.
print("\n" + "="*60)
print("🧪  OUT-OF-DISTRIBUTION TEST (real-world generalization check)")
print("="*60)

OOD_SAMPLES = [
    # ── Politics / policy (well-represented in training data) ──────────────────
    (
        "The Federal Reserve raised interest rates by 25 basis points on Wednesday, "
        "as policymakers continued efforts to curb inflation, officials confirmed.",
        1,
    ),
    (
        "Parliament approved a new climate bill on Thursday after months of debate. "
        "The legislation sets binding emissions targets for 2035, according to officials.",
        1,
    ),
    # ── Business / tech earnings ─────────────────────────────────────────────
    # Reuters wire style: "said/reported" not "announced", numbers as "89.5 billion"
    # not "89 billion dollars", CEO attributed by name with "said".
    (
        "Apple Inc reported quarterly revenue of 89.5 billion on Thursday, topping "
        "Wall Street estimates as strong iPhone sales offset a slowdown in services. "
        "Chief Executive Tim Cook said demand for the latest models remained robust.",
        1,
    ),
    (
        "Microsoft Corp posted net income of 22.3 billion in its fiscal first quarter, "
        "beating analyst expectations as its Azure cloud computing unit grew rapidly. "
        "Chief Executive Satya Nadella said artificial intelligence features were driving "
        "customer adoption. Shares climbed 3.8 percent in extended trading.",
        1,
    ),
    (
        "Tesla Inc delivered 435,059 vehicles in the third quarter, falling short of "
        "Wall Street expectations of 455,000 units as supply chain disruptions weighed "
        "on production. Chief Executive Elon Musk said planned factory shutdowns partly "
        "caused the miss. Shares fell 4.5 percent in premarket trading.",
        1,
    ),
    # ── Conspiracy / fake (clear fake signals) ────────────────────────────────
    (
        "SHOCKING: Scientists ADMIT the moon landing was staged!! "
        "Share before NASA deletes this! They don't want you to know the truth.",
        0,
    ),
    (
        "Big pharma is hiding a miracle cure from you. A whistleblower exposed that "
        "a simple herb completely destroys cancer cells. Wake up and share the truth!",
        0,
    ),
    (
        "The deep state is planning to microchip all citizens by 2025. "
        "Mainstream media refuses to cover this. They are hiding this from the public.",
        0,
    ),
    # ── Subtle fake (no ALL CAPS, sounds professional but claims are fabricated) 
    (
        "A leaked government document confirms that fluoride in water is intentionally "
        "used to lower IQ and make citizens easier to control. Scientists are silenced.",
        0,
    ),
]

for key, clf in classifiers.items():
    print(f"\n  [{labels[key]}]")
    correct = 0
    for text, label in OOD_SAMPLES:
        cleaned = wordopt(text)
        vec     = vectorizer.transform([cleaned])
        pred    = clf.predict(vec)[0]
        status  = "✅" if pred == label else "❌"
        tag     = "Real" if label == 1 else "Fake"
        if pred == label:
            correct += 1
        print(f"    {status} Expected={tag:4s}  Got={'Real' if pred==1 else 'Fake':4s}  | {text[:65]}...")
    print(f"    OOD accuracy: {correct}/{len(OOD_SAMPLES)} = {correct/len(OOD_SAMPLES)*100:.0f}%")

print("\n✅  All models trained and saved to the 'models/' directory.")
print("    Now run:  python app.py")