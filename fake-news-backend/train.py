import os
import re
import string
import argparse
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# CLI args
parser = argparse.ArgumentParser()
parser.add_argument("--fake", default="Fake.csv", help="Path to Fake.csv")
parser.add_argument("--true", default="True.csv", help="Path to True.csv")
parser.add_argument("--out",  default="models",   help="Output directory for .pkl files")
args = parser.parse_args()

os.makedirs(args.out, exist_ok=True)

# Load data
print("📂  Loading datasets...")
data_fake = pd.read_csv(args.fake)
data_true = pd.read_csv(args.true)

data_fake["class"] = 0
data_true["class"] = 1

# Reserve last 10 rows of each for manual testing
data_fake = data_fake.iloc[:-10]
data_true = data_true.iloc[:-10]

data = pd.concat([data_fake, data_true], axis=0)
data = data.drop(["title", "subject", "date"], axis=1)
data = data.dropna(subset=["text"])
data = data.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"✅  Dataset: {len(data):,} rows  |  Fake: {(data['class']==0).sum():,}  |  Real: {(data['class']==1).sum():,}")

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

print("🔧  Preprocessing text...")
data["text"] = data["text"].apply(wordopt)

x = data["text"]
y = data["class"]

# Train / test split
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)

# TF-IDF vectorizer
print("📐  Fitting TF-IDF vectorizer...")
vectorizer = TfidfVectorizer()
xv_train = vectorizer.fit_transform(x_train)
xv_test  = vectorizer.transform(x_test)

joblib.dump(vectorizer, os.path.join(args.out, "vectorizer.pkl"))
print(f"    Saved → {args.out}/vectorizer.pkl")

# Train & evaluate each model
classifiers = {
    "lr": LogisticRegression(),
    "dt": DecisionTreeClassifier(),
    "gb": GradientBoostingClassifier(random_state=0),
    "rf": RandomForestClassifier(random_state=0),
}

labels = {
    "lr": "Logistic Regression",
    "dt": "Decision Tree",
    "gb": "Gradient Boost",
    "rf": "Random Forest",
}

for key, clf in classifiers.items():
    print(f"\n🚀  Training {labels[key]}...")
    clf.fit(xv_train, y_train)

    preds    = clf.predict(xv_test)
    accuracy = accuracy_score(y_test, preds)
    print(f"    Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, preds, target_names=["Fake", "Real"]))

    out_path = os.path.join(args.out, f"{key}.pkl")
    joblib.dump(clf, out_path)
    print(f"    Saved → {out_path}")

print("\n✅  All models trained and saved to the 'models/' directory.")
print("    Now run:  python app.py")
