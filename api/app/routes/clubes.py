from fastapi import APIRouter, HTTPException
from typing import List
from app.models.club import Club, ClubCreate, ClubUpdate, ClubDelete, ClubOut
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[Club])
def get_clubes():
    response = supabase.table("clubes").select("*").execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los clubes: {response.error.message}")

    return response.data

@router.get("/{club_id}", response_model=ClubOut)
def obtener_club(club_id: int):
    response = supabase.table("clubes").select("*").eq("id", club_id).execute()

    if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Club no encontrado")

    club = response.data[0]
    return club

@router.post("/", response_model=ClubOut)
def crear_club(club: ClubCreate):
    response = supabase.table("clubes").insert(club.dict()).execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el club: {response.error.message}")

    return response.data[0]

@router.delete("/{club_id}")
def eliminar_club(club_id: int):
    response = supabase.table("clubes").delete().eq("id", club_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el club: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Club no encontrado")

    return {"message": "Club eliminado correctamente"}

@router.put("/{id}")
def actualizar_club(id: int, club: ClubUpdate):
    datos_actualizados = club.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
    
    club_existente = supabase.table("clubes").select("*").eq("id", id).execute()
    if not club_existente.data or len(club_existente.data) == 0:
        raise HTTPException(status_code=404, detail="Club no encontrado")
    
    try:
        respuesta = supabase.table("clubes").update(datos_actualizados).eq("id", id).execute()
        return {"mensaje": "Equipo actualizado correctamente", "datos_actualizados": respuesta.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el club: {str(e)}")

