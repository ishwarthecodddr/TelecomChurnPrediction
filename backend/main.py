"""
FastAPI Backend for Telecom Customer Churn Prediction
A simple API that loads a pre-trained ML model and predicts customer churn.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

# Initialize FastAPI app
app = FastAPI(title="Churn Prediction API")

# Enable CORS so frontend can communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model from pickle file
with open("churn_model.pkl", "rb") as f:
    model = pickle.load(f)


# Define the input data structure
class CustomerData(BaseModel):
    tenure: int           # How long the customer has been with the company
    MonthlyCharges: float # Monthly charges in dollars
    TotalCharges: float   # Total charges over the customer's tenure


# Root endpoint - just to check if API is running
@app.get("/")
def read_root():
    return {"message": "Churn Prediction API is running!"}


# Prediction endpoint
@app.post("/predict")
def predict_churn(data: CustomerData):
    """
    Predict whether a customer will churn based on their data.
    Returns: {"churn": "Yes"} or {"churn": "No"}
    """
    # Convert input data to numpy array for model
    features = np.array([[
        data.tenure,
        data.MonthlyCharges,
        data.TotalCharges
    ]])
    
    # Make prediction (0 = No churn, 1 = Churn)
    prediction = model.predict(features)[0]
    
    # Return result as Yes/No
    result = "Yes" if prediction == 1 else "No"
    return {"churn": result}
