import mysql.connector

def get_connection():

    try:

        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="o2c_db"
        )

        return conn

    except Exception as e:

        print(e)

        return None