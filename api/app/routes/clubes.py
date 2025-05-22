from fastapi import APIRouter, HTTPException, Depends
from app.services.auth import obtener_info_desde_token
from typing import List
from app.models.usuario import UsuarioOut, UsuarioCreate, UsuarioUpdate
from app.models.equipo import EquipoOut, EquipoCreate
from app.models.entrenador import EntrenadorOut, EntrenadorCreate
from app.utils.hashing import hash_password
from app.models.club import ClubUpdate, ClubOut
from app.supabase_client import supabase

router = APIRouter()

# @router.get("/", response_model=List[Club])
# def get_clubes():
#     response = supabase.table("clubes").select("*").execute()

#     if getattr (response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los clubes: {response.error.message}")

#     return response.data


@router.get("/", response_model=ClubOut)
def obtener_info_club(datos_token: dict = Depends(obtener_info_desde_token)):
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
def obtener_equipos_club(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] not in ["admin", "entrenador"]:
        raise HTTPException(status_code=403, detail="Solo los administradores o entrenadores pueden ver los equipos del club")

    response = supabase.table("equipos").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los equipos: {response.error.message}")

    return response.data


@router.get("/entrenadores/", response_model=List[EntrenadorOut])
def obtener_entrenadores_club(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los entrenadores del club")

    # Obtener IDs de entrenadores asociados al club desde la tabla de relación
    rel_response = supabase.table("club_entrenador").select("entrenador_id").eq("club_id", datos_token["clubs_id"]).execute()
    if getattr(rel_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener la relación clubes-entrenadores: {rel_response.error.message}")

    entrenador_ids = [rel["entrenador_id"] for rel in rel_response.data]
    if not entrenador_ids:
        return []

    # Obtener los datos de los entrenadores usando los IDs obtenidos
    entrenadores_response = supabase.table("entrenadores").select("*").in_("id", entrenador_ids).execute()
    if getattr(entrenadores_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los entrenadores: {entrenadores_response.error.message}")

    return entrenadores_response.data


@router.post("/nuevo_equipo/", response_model=EquipoOut)
def crear_nuevo_equipo_club(equipo: EquipoCreate, datos_token: dict = Depends(obtener_info_desde_token)):

    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden registrar nuevos equipos")

    data = equipo.dict()
    data["clubs_id"] = datos_token["clubs_id"]

    response = supabase.table("equipos").insert(data).execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el equipo: {response.error.message}")

    return response.data[0]


@router.post("/usuario/register", response_model=UsuarioOut)
def registrar_nuevo_usuario_club(usuario: UsuarioCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden registrar nuevos usuarios")

    # Forzamos el rol y el id_club del nuevo usuario
    data = usuario.dict()
    data["clubs_id"] = datos_token["clubs_id"]
    data["password"] = hash_password(data["password"])

    response = supabase.table("usuarios").insert(data).execute()

    nuevo_usuario = response.data[0]
    nuevo_usuario.pop("password", None)
    return nuevo_usuario


@router.post("/entrenador/register", response_model=EntrenadorOut)
def registrar_nuevo_entrenador_club(entrenador: EntrenadorCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden registrar nuevos entrenadores")

    data = entrenador.dict()
    # No poner clubs_id en esta tabla, quitar esta línea
    # data["clubs_id"] = datos_token["clubs_id"]

    response = supabase.table("entrenadores").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el entrenador: {response.error.message}")

    nuevo_entrenador = response.data[0]

    # Guardar relación en club_entrenador
    relacion = {
        "club_id": datos_token["clubs_id"],
        "entrenador_id": nuevo_entrenador["id"]
    }
    rel_response = supabase.table("club_entrenador").insert(relacion).execute()
    if getattr(rel_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al guardar la relación club-entrenador: {rel_response.error.message}")

    return nuevo_entrenador




# @router.delete("/{club_id}")
# def eliminar_club(club_id: int):
#     response = supabase.table("clubes").delete().eq("id", club_id).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al eliminar el club: {response.error.message}")

#     if response.data == 0:
#         raise HTTPException(status_code=404, detail="Club no encontrado")

#     return {"message": "Club eliminado correctamente"}


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

@router.put("/equipo/{equipo_id}")
def actualizar_equipo(equipo_id: int, equipo_data: EquipoCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    # Solo los administradores pueden actualizar el equipo
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden actualizar el equipo")

    # Actualizar el equipo con el id_club del token
    data = equipo_data.dict(exclude_unset=True)
    response = supabase.table("equipos").update(data).eq("id", equipo_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    return response.data[0]