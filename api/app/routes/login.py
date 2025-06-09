from fastapi import APIRouter, HTTPException
from app.models.usuario import LoginRequest, GoogleLoginRequest
from app.services.auth import generar_token, autenticar_usuario
from google.oauth2 import id_token
from google.auth.transport import requests
from app.supabase_client import supabase 
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Obtener el CLIENT_ID de Google desde las variables de entorno
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Verificar si GOOGLE_CLIENT_ID está configurado
router = APIRouter()

# Endpoint para iniciar sesión con email y contraseña
@router.post("/")
def login(data: LoginRequest):
    usuario = autenticar_usuario(data.email, data.password)
    
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    token = generar_token(usuario["nombre"], usuario["email"], usuario["id"], usuario["clubs_id"], usuario["rol"], usuario["foto"])
    return {"access_token": token, "token_type": "bearer"}

# Endpoint para iniciar sesión con Google
@router.post("/google", response_model=dict)
def login_con_google(payload: GoogleLoginRequest):
    try:
        # Verificar el token de Google
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
            usuario["rol"],
            usuario["foto"]
        )

        return {"access_token": token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=401, detail="Token de Google inválido")
    except Exception as e:
        print("Error en login con Google:", e)
        raise HTTPException(status_code=500, detail="Error al iniciar sesión con Google")