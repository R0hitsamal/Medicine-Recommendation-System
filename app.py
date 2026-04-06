from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load model and data
try:
    model = joblib.load('disease_prediction_model.joblib')
    merged_df = pd.read_csv("symptom-disease-drug.csv")
except Exception as e:
    print(f"Error loading model or data: {str(e)}")
    raise e

# Complete symptoms list
symptoms_list = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills',
    'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting',
    'burning_micturition', 'spotting_urination', 'fatigue', 'weight_gain', 'anxiety',
    'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy',
    'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes',
    'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache', 'yellowish_skin',
    'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain', 'constipation',
    'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes',
    'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes',
    'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes',
    'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
    'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
    'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
    'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
    'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
    'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck',
    'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
    'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of_urine',
    'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
    'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body',
    'belly_pain', 'abnormal_menstruation', 'dischromic_patches', 'watering_from_eyes',
    'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum',
    'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
    'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
    'history_of_alcohol_consumption', 'fluid_overload.1', 'blood_in_sputum',
    'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples',
    'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails',
    'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
]

@app.route('/')
def home():
    return "Disease Prediction API Service"

@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Return the complete list of symptoms the model was trained on"""
    try:
        return jsonify({
            'status': 'success',
            'symptoms': symptoms_list,
            'count': len(symptoms_list),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Handle prediction requests with proper validation"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'symptoms' not in data:
            return jsonify({
                'status': 'error',
                'message': 'No symptoms provided in request'
            }), 400
            
        selected_symptoms = data['symptoms']
        
        if not isinstance(selected_symptoms, list) or len(selected_symptoms) == 0:
            return jsonify({
                'status': 'error',
                'message': 'Symptoms should be a non-empty array'
            }), 400
            
        # Create input vector
        input_vector = [1 if symptom in selected_symptoms else 0 for symptom in symptoms_list]
        input_array = np.array(input_vector).reshape(1, -1)
        
        # Make prediction
        predicted_disease = model.predict(input_array)[0]
        
        # Get drug recommendation
        drug_info = merged_df[merged_df["Mapped_Disease"] == predicted_disease]["drug"].values
        drug = drug_info[0] if len(drug_info) > 0 else "Consult doctor for prescription"
        
        return jsonify({
            'status': 'success',
            'disease': predicted_disease,
            'drug': drug,
            'symptoms_used': selected_symptoms,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)