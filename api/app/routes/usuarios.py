from fastapi import APIRouter, HTTPException
from typing import List
from app.models.usuario import UsuarioCreate, UsuarioUpdate, UsuarioOut, LoginRequest
from app.supabase_client import supabase
from app.services.auth import verificar_password, generar_token

from app.utils.hashing import hash_password

router = APIRouter()

@router.post("/register/", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate):
    data = usuario.dict()
    data["password"] = hash_password(data["password"])

    try:
        # Realizamos la inserción en la base de datos
        response = supabase.table("usuarios").insert(data).execute()

        # Verificamos si la respuesta contiene datos
        if response.data and isinstance(response.data, list) and len(response.data) > 0:
            # Asegurémonos de que los datos son un diccionario
            usuario_creado = response.data[0]  # Accedemos al primer elemento de la lista
            return UsuarioOut(**usuario_creado)
        else:
            raise HTTPException(status_code=500, detail="No se encontraron datos en la respuesta de Supabase.")
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail="Error inesperado al crear el usuario")



@router.get("/", response_model=List[UsuarioOut])
def listar_usuarios():
    response = supabase.table("usuarios").select("*").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

    for user in response.data:
        user.pop("password", None)

    return response.data


@router.get("/{id}", response_model=UsuarioOut)
def obtener_usuario(id: int):
    response = supabase.table("usuarios").select("*").eq("id", id).single().execute()

    if response.error or not response.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    user = response.data
    user.pop("password", None)
    return user

@router.put("/{id}", response_model=UsuarioOut)
def actualizar_usuario(id: int, usuario: UsuarioUpdate):
    data = usuario.dict(exclude_unset=True)
    if "password" in data:
        data["password"] = hash_password(data["password"])
    
    response = supabase.table("usuarios").update(data).eq("id", id).execute()

    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    
    updated_user = response.data[0]
    updated_user.pop("password", None)
    return updated_user

@router.delete("/{id}")
def eliminar_usuario(id: int):
    response = supabase.table("usuarios").delete().eq("id", id).execute()

    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)
    
    return {"message": "Usuario eliminado correctamente"}


@router.post("/login/")
async def login(login_request: LoginRequest):
    response = supabase.table("usuarios").select("*").eq("email", login_request.email).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    usuario = response.data[0]

    if not verificar_password(usuario["password"], login_request.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = generar_token(usuario["id"])
    return {"access_token": token, "token_type": "bearer"}