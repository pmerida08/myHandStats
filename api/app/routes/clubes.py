from fastapi import APIRouter, HTTPException, Depends
from app.services.auth import obtener_info_desde_token
from typing import List
from app.models.usuario import UsuarioOut, UsuarioCreate
from app.models.equipo import EquipoOut
from app.utils.hashing import hash_password
from app.models.club import Club, ClubCreate, ClubUpdate, ClubDelete, ClubOut
from app.supabase_client import supabase

router = APIRouter()

# @router.get("/", response_model=List[Club])
# def get_clubes():
#     response = supabase.table("clubes").select("*").execute()

#     if getattr (response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los clubes: {response.error.message}")

#     return response.data


@router.get("/", response_model=ClubOut)
def obtener_club(datos_token: dict = Depends(obtener_info_desde_token)):
    club_id = datos_token["clubs_id"]
    response = supabase.table("clubes").select("*").eq("id", club_id).execute()

    return response.data[0]        


@router.get("/usuarios/", response_model=List[UsuarioOut])
def obtener_usuarios_club(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los usuarios del club")

    response = supabase.table("usuarios").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

    return response.data


@router.get("/equipos/", response_model=List[EquipoOut])
def obtener_usuarios_club(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los equipos del club")

    response = supabase.table("equipos").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los equipos: {response.error.message}")

    return response.data


# @router.post("/", response_model=ClubOut)
# def crear_club(club: ClubCreate):
#     response = supabase.table("clubes").insert(club.dict()).execute()

#     if getattr (response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al crear el club: {response.error.message}")

#     return response.data[0]


@router.post("/usuario/register", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    # Verificamos que solo un admin puede registrar nuevos usuarios
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden registrar nuevos usuarios")

    # Forzamos el rol y el id_club del nuevo usuario
    data = usuario.dict()
    data["rol"] = "user"
    data["clubs_id"] = datos_token["clubs_id"]
    data["password"] = hash_password(data["password"])

    # Insertamos el nuevo usuario en Supabase
    response = supabase.table("usuarios").insert(data).execute()

    nuevo_usuario = response.data[0]
    nuevo_usuario.pop("password", None)
    return nuevo_usuario


@router.delete("/{club_id}")
def eliminar_club(club_id: int):
    response = supabase.table("clubes").delete().eq("id", club_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el club: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Club no encontrado")

    return {"message": "Club eliminado correctamente"}


@router.put("/")
def actualizar_club(club_data: ClubUpdate, datos_token: dict = Depends(obtener_info_desde_token)):
    # Solo los administradores pueden actualizar el club
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden actualizar el club")

    # Actualizar el club con el id_club del token
    data = club_data.dict(exclude_unset=True)
    response = supabase.table("clubes").update(data).eq("id", datos_token["id_club"]).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Club no encontrado")

    return response.data[0]
