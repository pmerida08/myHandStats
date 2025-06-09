from fastapi import APIRouter, HTTPException
from jose import jwt, JWTError
from pydantic import BaseModel
from app.utils.hashing import hash_password
from app.supabase_client import supabase
from datetime import datetime
import os
from dotenv import load_dotenv
from models.usuario import EstablecerContraseñaDTO

# Cargar las variables de entorno
load_dotenv()

# Asignar las variables de entorno a constantes
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

# Importar el cliente de Supabase
router = APIRouter()

# Endpoint para establecer la contraseña de un usuario creado por administrador utilizando un token JWT
@router.post("/establecer-contrasena/")
def establecer_contraseña(dto: EstablecerContraseñaDTO):
    try:
        datos = jwt.decode(dto.token, SECRET_KEY, algorithms=[ALGORITHM])
        if datos.get("tipo") != "establecer_contrasena":
            raise HTTPException(status_code=400, detail="Token inválido")
    except JWTError as e:
        print("Error JWT:", str(e))
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    usuario_id = int(datos["sub"])

    usuario_resp = supabase.table("usuarios").select("*").eq("id", usuario_id).execute()
    if not usuario_resp.data or len(usuario_resp.data) == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    nueva_contraseña_hash = hash_password(dto.nueva_contraseña)
    update_resp = supabase.table("usuarios").update({"password": nueva_contraseña_hash}).eq("id", usuario_id).execute()
    if getattr(update_resp, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al actualizar la contraseña: {update_resp.error.message}")

    return {"mensaje": "Contraseña establecida correctamente"}
