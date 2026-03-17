# Telco Customer Churn Prediction

This repository presents a comprehensive machine learning model developed as part of **a hackathon conducted by UiPath Student Community at KIIT** using the IBM Telco Customer Churn dataset.

---

##  Project Summary

* **Goal**: Predict whether a customer will churn (leave the service) based on telecom usage and contract data.
* **Models**: Random Forest (with GridSearchCV)

---

##  Project Files

```
.
├── dataset/
│   └── WA_Fn-UseC_-Telco-Customer-Churn.csv
├── Task 6_CustomerChurnTel.ipynb
└── README.md
```

---

##  Dataset Overview

* **Source**: IBM Sample Dataset
* **Records**: 7,043 customers
* **Target Variable**: `Churn` (Yes / No)
* **Features**: Gender, SeniorCitizen, tenure, MonthlyCharges, TotalCharges, Contract, PaymentMethod, and more
---

## Results (Random Forest with GridSearchCV)

* **Accuracy**: 0.786
* **AUC-ROC**: 0.693

**Confusion Matrix**:

```
           Predicted 0  Predicted 1
Actual 0          925          116
Actual 1          185          183
```

**Classification Report:**

```
              precision    recall  f1-score   support

           0       0.83      0.89      0.86      1041
           1       0.61      0.50      0.55       368

    accuracy                           0.79      1409
   macro avg       0.72      0.69      0.70      1409
weighted avg       0.78      0.79      0.78      1409
```

---

##  Conclusion

* The **Random Forest model with GridSearchCV** yielded the best performance with an **accuracy of \~79%** and an **AUC-ROC of 0.69**.
* The model demonstrated strong capability in identifying non-churners and moderate recall for churners, which is crucial for business intervention strategies.
* Recommendations:

  * Use SMOTE or similar techniques to address class imbalance
  * Try ensemble models like XGBoost, LightGBM
  * Incorporate additional features (usage trends, complaints, etc.)

---

##  Contributors

- [@ishwar](https://github.com/ishwarthecodddr) 

