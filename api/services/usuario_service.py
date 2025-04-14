from pymongo import MongoClient
from typing import List
import logging
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Conexión a MongoDB Atlas
try:
    client = MongoClient("mongodb+srv://josemayenp:X5VYC9dSiDbB3d3@myhandstats.dl3grol.mongodb.net/?retryWrites=true&w=majority&appName=myhandstats")
    db = client["myhandstats"]  # Reemplaza con tu base de datos
    usuarios_collection = db["usuarios"]  # Nombre de la colección
    # Verify connection
    client.admin.command('ping')
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    # Rethrow to prevent app from starting with broken DB connection
    raise

def obtener_usuarios() -> List[dict]:
    try:
        usuarios = usuarios_collection.find()
        usuarios_list = []
        
        for usuario in usuarios:
            # Convert ObjectId to string for the id field
            usuarios_list.append({
                "id": str(usuario.get("_id", "")),
                "nombre": usuario.get("nombre", ""),
                "email": usuario.get("email", ""),
                "password": usuario.get("password", ""),
                "rol": usuario.get("rol", ""),
                "activo": usuario.get("activo", False)
            })
        
        return usuarios_list
    except Exception as e:
        logger.error(f"Error retrieving users: {e}")
        raise
