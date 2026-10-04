# Car Price Predictor

A local car resale price estimation app built around a scikit-learn model trained in `linearRegression.ipynb`. The React/Vite frontend sends vehicle details through an Express API to a Flask API, which loads `car_price_model.joblib` and returns a predicted price.

## Stack

- React, Vite, and Tailwind CSS (`frontend/`)
- Express (`backend/`)
- Flask, pandas, and scikit-learn (`app.py`)
- Jupyter notebook for model training (`linearRegression.ipynb`)

MongoDB is not currently used; predictions are not persisted.

## Prerequisites

- Python 3.14
- Node.js 20.19+ or 22.12+
- npm

## Install dependencies

Run these commands from the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

cd backend
npm ci
cd ../frontend
npm ci
cd ..
```

The Python dependency versions are pinned to match the workspace environment and the saved scikit-learn model.

## Run locally

Start each service in its own terminal, from the repository root.

### 1. Flask model API

```bash
source .venv/bin/activate
python app.py
```

Flask listens at `http://127.0.0.1:5001`.

### 2. Express API

```bash
cd backend
node server.js
```

Express listens at `http://127.0.0.1:5000` and forwards prediction requests to Flask.

### 3. React frontend

```bash
cd frontend
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`. During development, Vite proxies `/api` requests to Express.

## Make a prediction

Enter a model name, company, fuel type, year, and distance driven in the frontend. The API expects all five fields. For example:

```json
{
  "name": "Maruti Swift Dzire",
  "company": "Maruti",
  "year": 2015,
  "kms_driven": 45000,
  "fuel_type": "Diesel"
}
```

The frontend calls `POST /api/predict` through Express. The direct Flask endpoint is `POST http://127.0.0.1:5001/predict`.

## Run the training notebook

With the virtual environment activated from the repository root:

```bash
jupyter notebook linearRegression.ipynb
```

The notebook reads `quikr_car.csv` and saves the trained pipeline as `car_price_model.joblib`.
