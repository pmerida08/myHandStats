# routes/auth.py

from fastapi import APIRouter, HTTPException
from jose import jwt, JWTError
from pydantic import BaseModel
from app.utils.hashing import hash_password
from app.supabase_client import supabase
from datetime import datetime

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

router = APIRouter()
class EstablecerContraseñaDTO(BaseModel):
    token: str
    nueva_contraseña: str

@router.post("/establecer-contrasena/")
def establecer_contraseña(dto: EstablecerContraseñaDTO):
    print("Token recibido:", dto.token)
    print("Hora backend antes de decodificar:", datetime.utcnow())
    try:
        datos = jwt.decode(dto.token, SECRET_KEY, algorithms=[ALGORITHM])
        if datos.get("tipo") != "establecer_contrasena":
            raise HTTPException(status_code=400, detail="Token inválido")
    except JWTError as e:
        print("Error JWT:", str(e))
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    usuario_id = int(datos["sub"])
    print("usuario_id extraído:", usuario_id)

    usuario_resp = supabase.table("usuarios").select("*").eq("id", usuario_id).execute()
    print("usuario_resp.data:", usuario_resp.data)
    if not usuario_resp.data or len(usuario_resp.data) == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    nueva_contraseña_hash = hash_password(dto.nueva_contraseña)
    update_resp = supabase.table("usuarios").update({"password": nueva_contraseña_hash}).eq("id", usuario_id).execute()
    if getattr(update_resp, "error", None):
        print("Error al actualizar:", update_resp.error.message)
        raise HTTPException(status_code=400, detail=f"Error al actualizar la contraseña: {update_resp.error.message}")

    return {"mensaje": "Contraseña establecida correctamente"}
