from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import csv

csv_file = '/Users/darrpama/python_code/hakaton/ekb_akademicheskii.csv'

def calculate_positive_density(positive_count, area):
  return positive_count/area

def calculate_negative_density(negative_count, area):
  return negative_count/area

def calculate_equability(positive_density, negative_density):
  return positive_density - negative_density

def calculate_quality_of_district(positive_count, negative_count, negatives_near_educational):
  positive_weight = 0
  negative_weight = 0
  if (positive_count - negative_count >= negative_count * 0.5):
    positive_weight = 0.6
  if (negatives_near_educational >= 1):
    negative_weight = 0.4
  return positive_count * (1 + positive_weight) - negative_count * (1 + negative_weight)


def load_data(csv_file):
  area = 
  return area, positive_count, negative_count, negatives_near_educational

def prepare_data(area, positive_count, negative_count, negatives_near_educational):

  quality = calculate_quality_of_district(positive_count, negative_count, negatives_near_educational)
  positive_density = calculate_positive_density(positive_count, area)
  negative_density = calculate_negative_density(negative_count, area)
  equability = calculate_equability(positive_density, negative_density)
  X = np.array([positive_density, negative_density, equability, negatives_near_educational])
  y = np.array([quality])
  return X, y

def calculate_model(X, y):
  # Features
  # X = np.array([[100, 5, 10, 2], [200, 10, 20, 4], [150, 7, 15, 3]]
  # y = np.array([0.8, 0.6, 0.9])  # Target variable

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


X, y
load_data()
