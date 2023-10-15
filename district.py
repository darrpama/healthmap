from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import matplotlib.pyplot as plt
import requests


class Model:
    def __init__(self):
        self.model = None
        self.scaler = None

    def calculate_positive_density(self, number_of_positive, area):
        return number_of_positive / area

    def calculate_negative_density(self, number_of_positive, area):
        return number_of_positive / area

    def calculate_equability(self, positive_density, negative_density):
        return positive_density - negative_density

    def load_data(self):
        pass

    def prepare_data(self, json_data):
        X = []
        y = []
        for city in json_data:
            for district in city['districts']:
                features = [
                    district['area'],
                    district['total_positive_amount'],
                    district['total_negative_amount'],
                    district['edu_negative_amount']
                ]
                X.append(features)
        
        return X, y

    def train_model(self, X, y):

        # Normalize the features using MinMaxScaler
        self.scaler = MinMaxScaler()
        X_normalized = self.scaler.fit_transform(X)

        # Split the dataset into training and test sets
        X_train, X_test, y_train, y_test = train_test_split(X_normalized, y, test_size=0.2, random_state=42)

        # Create and train the linear regression model
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)

        # Predict on the test set
        y_pred = self.model.predict(X_test)

        # Evaluate the model
        mse = np.mean((y_test - y_pred) ** 2)
        r_squared = self.model.score(X_test, y_test)
        print("Mean Squared Error:", mse)
        print("R-squared:", r_squared)

    def save_model(self, file_path):
        model_params = {
            'coef_': self.model.coef_.tolist(),
            'intercept_': self.model.intercept_.tolist(),
            'scaler_params': {
                'scale_': self.scaler.scale_.tolist(),
                'min_': self.scaler.min_.tolist(),
                'data_min_': self.scaler.data_min_.tolist(),
                'data_max_': self.scaler.data_max_.tolist(),
                'data_range_': self.scaler.data_range_.tolist(),
            }
        }
        with open(file_path, 'w') as file:
            json.dump(model_params, file)

    def load_model(self, file_path):
        with open(file_path, 'r') as file:
            model_params = json.load(file)
        self.model = LinearRegression()
        self.model.coef_ = np.array(model_params['coef_'])
        self.model.intercept_ = np.array(model_params['intercept_'])
        self.scaler = MinMaxScaler()
        self.scaler.scale_ = np.array(model_params['scaler_params']['scale_'])
        self.scaler.min_ = np.array(model_params['scaler_params']['min_'])
        self.scaler.data_min_ = np.array(model_params['scaler_params']['data_min_'])
        self.scaler.data_max_ = np.array(model_params['scaler_params']['data_max_'])
        self.scaler.data_range_ = np.array(model_params['scaler_params']['data_range_'])

    def predict(self, X):
        # Normalize the features using the stored scaler
        X_normalized = self.scaler.transform(X)

        # Predict using the loaded model
        y_pred = self.model.predict(X_normalized)
        return y_pred

    def plot_evaluation(self, X_test, y_test):
        # Predict on the test set
        y_pred = self.model.predict(X_test)

        # Plot the predicted values against the true values
        plt.scatter(y_test, y_pred)
        plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'k--', lw=2)
        plt.xlabel('True Values')
        plt.ylabel('Predicted Values')
        plt.title('Model Evaluation')
        plt.show()

        # Plot the residuals
        residuals = y_test - y_pred
        plt.scatter(y_pred, residuals)
        plt.axhline(y=0, color='k', linestyle='--', linewidth=2)
        plt.xlabel('Predicted Values')
        plt.ylabel('Residuals')
        plt.title('Residual Analysis')
        plt.show()

# Create an instance of the Model class
model = Model()

# Make a GET request to the API endpoint
response = requests.get('api/feature/district')

# Parse the JSON response
json_data = response.json()

# Prepare the data and extract the features X
X = model.prepare_data(json_data)

y = np.array([0.8, 0.6, 0.9, 0.8, 0.6, 0.9, 0.8, 0.6, 0.9, 0.8, 0.6, 0.9])  # Target variable

# Train the model
model.train_model(X, y)

# # Save the trained model
# model.save_model('trained_model.pkl')

# # Load the saved model
# model.load_model('trained_model.pkl')

# Use the loaded model for predictions
X_new = np.array([[120, 6, 12, 2.5], [180, 8, 18, 3.5]])
predictions = model.predict(X_new)
print("Predictions:", predictions)

# Use the loaded model for evaluation and plotting
X_test = np.array([[130, 6.5, 11, 2.8], [170, 7.5, 17, 3.2],[140, 4.5, 13, 1.8], [160, 7.5, 17, 3.2]])
y_test = np.array([0.7, 0.8, 0.7, 0.8])
model.plot_evaluation(X_test, y_test)