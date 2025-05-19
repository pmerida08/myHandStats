from fastapi import APIRouter, HTTPException
from app.models.usuario import UsuarioCreate, UsuarioOut
from app.supabase_client import supabase
from app.utils.hashing import hash_password

router = APIRouter()

@router.post("/", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate):
    try:
        # Comprobar si ya existe un usuario con ese email
        usuario_existente = supabase.table("usuarios").select("*").eq("email", usuario.email).execute()
        if usuario_existente.data and len(usuario_existente.data) > 0:
            raise HTTPException(status_code=400, detail="Ya existe un usuario registrado con ese email")

        # 1. Crear el club ya que cada usuario que se registre tendra un club asociado
        data_club = {"nombre": f"Club de {usuario.nombre}"}
        response_club = supabase.table("clubes").insert(data_club).execute()

        if not response_club.data:
            raise HTTPException(status_code=500, detail="No se pudo crear el club")

        club_id = response_club.data[0]["id"]

        # 2. Crear el usuario con el club_id
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
