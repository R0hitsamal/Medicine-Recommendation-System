
### [AI-powered Disease Prediction and Drug Recommendation System](https://ai-powered-disease-prediction-with-drug.onrender.com/)

---

The **AI-powered Disease Prediction and Drug Recommendation System** is an AI-powered web application designed to predict diseases based on user-provided symptoms. Built with Flask, Python, and machine learning, this system provides an intuitive interface for users to select their symptoms and receive a predicted diagnosis. The project is deployed on **Render** and is accessible online.


# Project Description: Disease Prediction and Drug Recommendation System

## Overview:
This web-based application is designed to predict potential diseases based on a user's selected symptoms and recommend the appropriate drug for the predicted disease. The system leverages a machine learning model to predict diseases and uses a merged dataset of diseases and drugs to suggest suitable medications. The application combines disease prediction with drug recommendation, providing users with a holistic approach to health diagnostics.

## Key Features:
1. **Symptom-based Disease Prediction**:  
   The model takes a list of symptoms provided by the user and processes them using a pre-trained machine learning model to predict the most likely disease. The symptoms are mapped to a binary feature vector, with '1' representing the presence of a symptom and '0' for the absence. This vector is then passed through the trained model to make a prediction.

2. **Drug Recommendation**:  
   Once a disease is predicted, the system fetches information from a merged dataset that associates diseases with corresponding drugs. Using fuzzy matching, the system matches the predicted disease with its entry in the dataset to recommend an appropriate drug. If no drug information is available for the disease, the application provides a message indicating no recommendation.

3. **User-Friendly Interface**:  
   The application features an intuitive interface where users can easily select their symptoms from a list. Upon submission, the system processes the data and displays the predicted disease along with the suggested drug, if available.

4. **Fuzzy Matching for Disease Mapping**:  
   The system employs fuzzy word matching techniques to handle variations in disease names across different datasets. This ensures that even if there are slight discrepancies in how the disease is listed, the correct disease can still be identified and mapped to the drug recommendation.

## Technologies Used:
- **Flask**: A lightweight web framework for building the web application.
- **Joblib**: To load the pre-trained machine learning model used for disease prediction.
- **Pandas**: For handling and merging the disease-drug dataset and performing data operations.
- **NumPy**: For manipulating the data into a format compatible with the machine learning model.
- **HTML/CSS**: For building the front-end interface, allowing users to interact with the system.
- **Fuzzy Matching Techniques**: To map diseases across different datasets and improve the accuracy of drug recommendations.

## Workflow:
1. **Data Collection**: The dataset contains symptom-disease relationships and a separate dataset linking diseases to recommended drugs. These datasets are merged based on disease names.
   
2. **Machine Learning Model**: The pre-trained model takes the selected symptoms as input and predicts the most likely disease using classification techniques. The model was trained on a dataset of diseases and symptoms, learning the relationships between them.

3. **Drug Mapping**: After predicting the disease, the system checks the merged dataset for any associated drug recommendations. If a drug is available for the predicted disease, it is displayed alongside the prediction.

4. **User Interaction**: The user selects symptoms from a predefined list, submits the form, and receives a prediction about the disease and the recommended drug.

## Future Enhancements:
- **Integration with External Medical Databases**: The system can be enhanced by integrating it with external medical databases for more comprehensive disease and drug recommendations.
- **Improved Fuzzy Matching**: Further improvements to fuzzy matching can make the system even more accurate in handling varying disease names.
- **User Feedback Loop**: Allow users to provide feedback on predictions and drug suggestions to improve the model's accuracy over time.
- **More Diseases and Drugs**: Expand the dataset to cover a broader range of diseases and drugs for a more inclusive recommendation system.

## Conclusion:
This disease prediction and drug recommendation system is a useful tool for individuals looking to understand potential diseases based on their symptoms. By combining machine learning predictions with a dynamic drug recommendation engine, the application provides users with valuable insights into their health, making it a valuable resource for preliminary health assessments.


## Credits

This project was created by **[Ann Naser Nabil](https://github.com/AnnNaserNabil)**.  
Feel free to contribute or provide feedback!

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
```
