how to start backend:
cd fake-news-backend

# First time only
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

# Train models (one time — needs Fake.csv + True.csv in same folder)
python train.py

# Start API
python app.py
# → Running on http://localhost:5000

how to start frontend:

cd fake-news-detector

npm install
npm run dev
# → Running on http://localhost:5173
