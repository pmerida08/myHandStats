from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.usuario import UsuarioCreate, UsuarioOut, GoogleRegisterRequest
from app.supabase_client import supabase
from app.utils.hashing import hash_password
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Obtener el CLIENT_ID de Google desde las variables de entorno
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Importar el cliente de Supabase
router = APIRouter()

# Endpoint para registrar un nuevo usuario
@router.post("/", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate):
    try:
        # Comprobar si ya existe un usuario con ese email
        usuario_existente = supabase.table("usuarios").select("*").eq("email", usuario.email).execute()
        if usuario_existente.data and len(usuario_existente.data) > 0:
            raise HTTPException(status_code=400, detail="Ya existe un usuario registrado con ese email")

        # Crear el club
        data_club = {"nombre": f"Club de {usuario.nombre}"}
        response_club = supabase.table("clubes").insert(data_club).execute()

        if not response_club.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el club")

        club_id = response_club.data[0]["id"]

        # Crear el usuario
        data_usuario = usuario.dict()
        data_usuario["password"] = hash_password(data_usuario["password"])
        data_usuario["rol"] = "admin"
        data_usuario["clubs_id"] = club_id

        response_user = supabase.table("usuarios").insert(data_usuario).execute()

        if not response_user.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el usuario")

        return UsuarioOut(**response_user.data[0])
    
    except Exception as e:
        print("Error en registro:", e)
        raise HTTPException(status_code=500, detail="Error al registrar el usuario")


# Endpoint para registrar un usuario con Google
@router.post("/google", response_model=UsuarioOut)
def registrar_con_google(payload: GoogleRegisterRequest):
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.credential,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        nombre = idinfo.get("name", "Sin Nombre")

        # Comprobar si ya existe
        usuario_existente = supabase.table("usuarios").select("*").eq("email", email).execute()

        if usuario_existente.data and len(usuario_existente.data) > 0:
            usuario = usuario_existente.data[0]
            return UsuarioOut(**usuario)

        # Crear club
        data_club = {"nombre": f"Club de {nombre}"}
        response_club = supabase.table("clubes").insert(data_club).execute()

        if not response_club.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el club")

        club_id = response_club.data[0]["id"]

        # Crear usuario
        data_usuario = {
            "nombre": nombre,
            "email": email,
            "password": "",  # vacío porque se autentica con Google
            "rol": "admin",
            "clubs_id": club_id
        }

        response_user = supabase.table("usuarios").insert(data_usuario).execute()

        if not response_user.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el usuario")

        return UsuarioOut(**response_user.data[0])
    
    except ValueError:
        raise HTTPException(status_code=401, detail="Token de Google inválido")
    
    except Exception as e:
        print("Error en registro con Google:", e)
        raise HTTPException(status_code=500, detail="Error al registrar con Google")
