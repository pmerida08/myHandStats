from fastapi import APIRouter, HTTPException , Depends
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from typing import List
from app.models.usuario import UsuarioCreate, UsuarioUpdate, UsuarioOut, LoginRequest
from app.supabase_client import supabase
from app.services.auth import verificar_password, generar_token, obtener_email_desde_token
from app.utils.hashing import hash_password
from app.utils.hashing import pwd_context  

router = APIRouter()

@router.post("/register", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate):
    try:
        # 1. Crear el club
        data_club = {"nombre": f"Club de {usuario.nombre}"}
        response_club = supabase.table("clubes").insert(data_club).execute()

        if not response_club.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el club")

        club_id = response_club.data[0]["id"]

        # 2. Crear el usuario con el club_id
        data_usuario = usuario.dict()
        data_usuario["password"] = hash_password(data_usuario["password"])
        data_usuario["clubs_id"] = club_id

        response_user = supabase.table("usuarios").insert(data_usuario).execute()

        if not response_user.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el usuario")

        return UsuarioOut(**response_user.data[0])
    
    except Exception as e:
        print("Error en registro:", e)
        raise HTTPException(status_code=500, detail="Error al registrar el usuario")

# @router.get("/", response_model=List[UsuarioOut])
# def listar_usuarios():
#     response = supabase.table("usuarios").select("*").execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

#     for user in response.data:
#         user.pop("password", None)

#     return response.data


# @router.get("/{id}", response_model=UsuarioOut)
# def obtener_usuario(id: int):
#     response = supabase.table("usuarios").select("*").eq("id", id).single().execute()

#     if response.data is None:
#         raise HTTPException(status_code=500, detail="Usuario no encontrado")

#     user = response.data
#     user.pop("password", None)  # Asegura que no se devuelve la contraseña
#     return user

@router.put("/{id}", response_model=UsuarioOut)
def actualizar_usuario(id: int, usuario: UsuarioUpdate):
    data = usuario.dict(exclude_unset=True)
    if "password" in data:
        data["password"] = hash_password(data["password"])

    response = supabase.table("usuarios").update(data).eq("id", id).execute()

    # Si no se actualizó ningún registro (por ejemplo, el ID no existe)
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    updated_user = response.data[0]
    updated_user.pop("password", None)
    return updated_user

@router.delete("/{id}")
def eliminar_usuario(id: int):
    response = supabase.table("usuarios").delete().eq("id", id).execute()

    # Si la respuesta tiene data vacía, es que no se encontró el usuario
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {"message": "Usuario eliminado correctamente"}



def autenticar_usuario(email: str, password: str):
    response = supabase.table("usuarios").select("*").eq("email", email).single().execute()

    # Verificar si la respuesta contiene datos
    if not response.data:
        return None

    usuario = response.data  # Acceder a los datos directamente

    # Verificar si la contraseña es correcta
    if not pwd_context.verify(password, usuario["password"]):
        return None

    return usuario



@router.post("/login")
def login(data: LoginRequest):
    usuario = autenticar_usuario(data.email, data.password)
    
    if not usuario:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    
    token = generar_token(usuario["email"])
    return {"access_token": token, "token_type": "bearer"}


@router.get("/perfil", tags=["Usuarios"])
def obtener_perfil(email: str = Depends(obtener_email_desde_token)):
    return {"email": email}

# @router.post("/login/")
# async def login(login_request: LoginRequest):
#     response = supabase.table("usuarios").select("*").eq("email", login_request.email).execute()

#     if not response.data:
#         raise HTTPException(status_code=400, detail="Credenciales incorrectas")

#     usuario = response.data[0]

#     if not verificar_password(usuario["password"], login_request.password):
#         raise HTTPException(status_code=400, detail="Credenciales incorrectas")

#     token = generar_token(usuario["id"])
#     return {"access_token": token, "token_type": "bearer"}