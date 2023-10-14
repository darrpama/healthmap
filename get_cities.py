import psycopg2

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(database="your_database", user="your_username", password="your_password", host="your_host", port="your_port")

# Create a cursor object to interact with the database
cur = conn.cursor()

# Execute the SELECT query to retrieve parameters from the "Cities" relation
cur.execute("SELECT id, name FROM Cities")

# Fetch all the rows returned by the query
rows = cur.fetchall()

# Print the parameters
for row in rows:
    city_id, city_name = row
    print("City ID:", city_id)
    print("City Name:", city_name)

# Close the cursor and the connection
cur.close()
conn.close()