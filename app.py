from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)
model = joblib.load(Path(__file__).resolve().parent / "car_price_model.joblib")

@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}
    fields = ["name", "company", "year", "kms_driven", "fuel_type"]

    if any(field not in data for field in fields):
        return jsonify(error=f"Provide all fields: {', '.join(fields)}"), 400

    try:
        row = {
            "name": " ".join(str(data["name"]).split()[:3]),
            "company": str(data["company"]),
            "year": int(data["year"]),
            "kms_driven": int(data["kms_driven"]),
            "fuel_type": str(data["fuel_type"]),
        }
        features = pd.DataFrame([row], columns=fields)
        price = float(model.predict(features)[0])
    except (TypeError, ValueError) as error:
        return jsonify(error=str(error)), 400

    return jsonify(estimatedPrice=round(price, 2))

if __name__ == "__main__":
    app.run(port=5001, debug=True)