import mysql.connector
from mysql.connector import Error
from fastapi import HTTPException
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def get_db_connection():
    """Obtener conexión a la base de datos MySQL"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME'),
            port=int(os.getenv('DB_PORT', 3306)),
            connect_timeout=10,
            autocommit=False
        )
        
        if connection.is_connected():
            return connection
            
    except Error as e:
        print(f"❌ Error conectando a MySQL: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error de conexión a la base de datos: {str(e)}"
        )
