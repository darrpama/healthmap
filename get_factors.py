import psycopg2

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(database="your_database", user="your_username", password="your_password", host="your_host", port="your_port")

# Create a cursor object to interact with the database
cur = conn.cursor()

# Execute the SELECT query to retrieve parameters from the "Factors" relation
cur.execute("SELECT id, district_id, name, type FROM Factors")

# Fetch all the rows returned by the query
rows = cur.fetchall()

# Print the parameters
for row in rows:
    factor_id, district_id, factor_name, factor_type = row
    print("Factor ID:", factor_id)
    print("District ID:", district_id)
    print("Factor Name:", factor_name)
    print("Factor Type:", factor_type)

# Close the cursor and the connection
cur.close()
conn.close()