import psycopg2

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(database="your_database", user="your_username", password="your_password", host="your_host", port="your_port")

# Create a cursor object to interact with the database
cur = conn.cursor()

# Execute the SELECT query to retrieve parameters from the "Districts" relation
cur.execute("SELECT id, city_id, name, area FROM Districts")

# Fetch all the rows returned by the query
rows = cur.fetchall()

# Print the parameters
for row in rows:
    district_id, city_id, district_name, district_area = row
    print("District ID:", district_id)
    print("City ID:", city_id)
    print("District Name:", district_name)
    print("District Area:", district_area)

# Close the cursor and the connection
cur.close()
conn.close()