from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import numpy as np


def calculate_positive_density(number_of_positive, area):
  return number_of_positive/area

def calculate_negative_density(number_of_positive, area):
  return number_of_positive/area

def calculate_equability(positive_density, negative_density):
  return positive_density - negative_density

def load_data():
  pass

def prepare_data():
  pass

def calculate_model(X, y):
  # Features
  X = np.array([[100, 5, 10, 2], [200, 10, 20, 4], [150, 7, 15, 3]])
  y = np.array([0.8, 0.6, 0.9])  # Target variable

  # Normalize the features using MinMaxScaler
  scaler = MinMaxScaler()
  X_normalized = scaler.fit_transform(X)

  # Split the dataset into training and test sets
  X_train, X_test, y_train, y_test = train_test_split(X_normalized, y, test_size=0.2, random_state=42)

  # Create and train the linear regression model
  model = LinearRegression()
  model.fit(X_train, y_train)

  # Predict on the test set
  y_pred = model.predict(X_test)

  # Evaluate the model
  mse = np.mean((y_test - y_pred) ** 2)
  r_squared = model.score(X_test, y_test)

  print("Mean Squared Error:", mse)
  print("R-squared:", r_squared)