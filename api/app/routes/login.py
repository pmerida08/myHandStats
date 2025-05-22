from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.usuario import LoginRequest
from app.services.auth import generar_token, autenticar_usuario
from google.oauth2 import id_token
from google.auth.transport import requests
from app.supabase_client import supabase  # Ajusta el import según tu proyecto
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter()

@router.post("/")
def login(data: LoginRequest):
    usuario = autenticar_usuario(data.email, data.password)
    
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    print(usuario)  # <-- Añade esto temporalmente para depurar

    token = generar_token(usuario["nombre"], usuario["email"], usuario["id"], usuario["clubs_id"], usuario["rol"])
    return {"access_token": token, "token_type": "bearer"}

class GoogleLoginRequest(BaseModel):
    credential: str

@router.post("/google", response_model=dict)
def login_con_google(payload: GoogleLoginRequest):
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.credential,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        nombre = idinfo.get("name", "Sin Nombre")

        # Buscar usuario existente
        usuario_existente = supabase.table("usuarios").select("*").eq("email", email).execute()

        if not usuario_existente.data or len(usuario_existente.data) == 0:
            raise HTTPException(status_code=404, detail="Usuario no registrado. Regístrate primero con Google.")

        usuario = usuario_existente.data[0]

        # Generar token JWT
        token = generar_token(
            usuario["nombre"],
            usuario["email"],
            usuario["id"],
            usuario.get("clubs_id"),
            usuario["rol"]
        )

        return {"access_token": token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=401, detail="Token de Google inválido")
    except Exception as e:
        print("Error en login con Google:", e)
        raise HTTPException(status_code=500, detail="Error al iniciar sesión con Google")