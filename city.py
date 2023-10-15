from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import matplotlib.pyplot as plt
import joblib


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

    def prepare_data(self):
        pass

    def train_model(self, X, y):

        # Normalize the features using MinMaxScaler
        self.scaler = MinMaxScaler()
        X_normalized = self.scaler.fit_transform(X)

        # Split the dataset into training and test sets
        X_train, X_test, y_train, y_test = train_test_split(X_normalized, y, test_size=0.2, random_state=42)

        # Create and train the linear regression model
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)

        # Save the trained model
        joblib.dump(self.model, 'trained_model.pkl')

        # Predict on the test set
        y_pred = self.model.predict(X_test)

        # Evaluate the model
        mse = np.mean((y_test - y_pred) ** 2)
        r_squared = self.model.score(X_test, y_test)
        print("Mean Squared Error:", mse)
        print("R-squared:", r_squared)

    def load_model(self, model_path):
        # Load the saved model
        self.model = joblib.load(model_path)

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

# Features
X = np.array([[100, 5, 10, 2],
              [200, 10, 20, 4],
              [150, 7, 15, 3],
              [120, 5, 10, 2],
              [200, 10, 20, 4],
              [151, 7, 15, 3],
              [100, 5, 10, 2],
              [200, 10, 20, 4],
              [161, 7, 15, 3],
              [102, 5, 10, 2],
              [207, 10, 20, 4],
              [158, 7, 15, 3]])
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