from fastapi import APIRouter, HTTPException, Request 
from app.models.usuario import LoginRequest
from app.services.auth import generar_token, autenticar_usuario
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.supabase_client import supabase  # Ajusta el import según tu proyecto

router = APIRouter()

@router.post("/")
def login(data: LoginRequest):
    usuario = autenticar_usuario(data.email, data.password)
    
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    print(usuario)  # <-- Añade esto temporalmente para depurar

    token = generar_token(usuario["nombre"], usuario["email"], usuario["id"], usuario["clubs_id"], usuario["rol"])
    return {"access_token": token, "token_type": "bearer"}

@router.post("/google")
async def login_google(request: Request):
    data = await request.json()
    token_google = data.get("token")

    if not token_google:
        raise HTTPException(status_code=400, detail="Token de Google no proporcionado")

    try:
        # Verifica el token de Google
        idinfo = id_token.verify_oauth2_token(token_google, google_requests.Request())
        email = idinfo["email"]
        nombre = idinfo.get("name", "")
        # Puedes obtener más datos de idinfo si lo necesitas

        # Busca el usuario en tu base de datos
        response = supabase.table("usuarios").select("*").eq("email", email).single().execute()
        usuario = response.data

        # Si no existe, créalo
        if not usuario:
            nuevo_usuario = {
                "email": email,
                "nombre": nombre,
                "rol": "usuario",  # O el rol que quieras por defecto
                # Agrega otros campos necesarios
            }
            insert_resp = supabase.table("usuarios").insert(nuevo_usuario).execute()
            usuario = insert_resp.data[0]

        # Genera el token de tu sistema
        token = generar_token(
            usuario["nombre"],
            usuario["email"],
            usuario["id"],
            usuario.get("clubs_id", None),
            usuario["rol"]
        )
        return {"access_token": token, "token_type": "bearer"}

    except ValueError:
        raise HTTPException(status_code=401, detail="Token de Google inválido")