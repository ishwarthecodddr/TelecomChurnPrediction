from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import joblib
import pandas as pd
import os

# Initialize FastAPI
app = FastAPI(title="Churn Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL PATH (robust)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "churn_pipeline.pkl")

# Load pipeline
pipeline = joblib.load(MODEL_PATH)


# Input schema
class CustomerData(BaseModel):
    tenure: int
    MonthlyCharges: float
    TotalCharges: float


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Churn Prediction API is running!"}


# Prediction endpoint
@app.post("/predict")
def predict_churn(data: CustomerData):

    # 🔒 VALIDATION WITH PROPER ERRORS
    if not (0 <= data.tenure <= 100):
        raise HTTPException(
            status_code=400,
            detail="Tenure must be between 0 and 100"
        )

    if not (0 <= data.MonthlyCharges <= 500):
        raise HTTPException(
            status_code=400,
            detail="MonthlyCharges must be between 0 and 500"
        )

    if not (0 <= data.TotalCharges <= 10000):
        raise HTTPException(
            status_code=400,
            detail="TotalCharges must be between 0 and 10000"
        )

    # Prepare input data
    df = pd.DataFrame([{
        "tenure": data.tenure,
        "MonthlyCharges": data.MonthlyCharges,
        "TotalCharges": data.TotalCharges,

        # Default values
        "gender": "Male",
        "SeniorCitizen": 0,
        "Partner": "Yes",
        "Dependents": "No",
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "OnlineSecurity": "No",
        "OnlineBackup": "Yes",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "Yes",
        "StreamingMovies": "Yes",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check"
    }])

    # Prediction
    prediction = pipeline.predict(df)[0]

    return {"churn": "Yes" if prediction == 1 else "No"}