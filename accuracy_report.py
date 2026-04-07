import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load the model
model = joblib.load('disease_prediction_model.joblib')

# Load test data
test_df = pd.read_csv('Testing.csv')

# Load drug mapping
drug_df = pd.read_csv('symptom-disease-drug.csv')

# Features are all columns except 'prognosis'
X_test = test_df.drop('prognosis', axis=1)
y_test = test_df['prognosis']

# Make predictions
y_pred = model.predict(X_test)

# Calculate disease prediction accuracy
disease_accuracy = accuracy_score(y_test, y_pred)
print(f"Disease Prediction Accuracy: {disease_accuracy * 100:.2f}%")

# Classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Confusion matrix
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# For drug recommendation accuracy, since drugs are mapped from diseases,
# if disease is correct, drug is correct
correct_predictions = (y_test == y_pred).sum()
total_predictions = len(y_test)
drug_accuracy = disease_accuracy  # Same as disease accuracy
print(f"\nDrug Recommendation Accuracy: {drug_accuracy * 100:.2f}% (same as disease accuracy, since drugs are derived from predicted diseases)")

# Optionally, show some drug recommendations for correct predictions
print("\nSample Drug Recommendations for Correct Predictions:")
correct_indices = (y_test == y_pred)
for idx in correct_indices[correct_indices].index[:5]:  # First 5 correct
    disease = y_pred[idx]
    drug_info = drug_df[drug_df["Mapped_Disease"] == disease]["drug"]
    drug = drug_info.values[0] if len(drug_info) > 0 else "No drug found"
    print(f"Disease: {disease} -> Drug: {drug}")