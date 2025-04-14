from pymongo import MongoClient
from typing import List

# Conexión a MongoDB Atlas
client = MongoClient("mongodb+srv://josemayenp:X5VYC9dSiDbB3d3@myhandstats.dl3grol.mongodb.net/?retryWrites=true&w=majority&appName=myhandstats")
db = client["nombre_base_de_datos"]  # Reemplaza con tu base de datos
usuarios_collection = db["usuarios"]  # Nombre de la colección

def obtener_usuarios() -> List[dict]:
    usuarios = usuarios_collection.find()
    usuarios_list = []
    
    for usuario in usuarios:
        usuarios_list.append({
            "nombre": usuario["nombre"],
            "email": usuario["email"],
            "edad": usuario["edad"]
        })
    
    return usuarios_list
