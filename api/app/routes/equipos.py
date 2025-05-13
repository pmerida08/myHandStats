from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.equipo import Equipo, EquipoCreate, EquipoUpdate, EquipoDelete, EquipoOut
from app.models.jugador import JugadorOut
from app.models.partido import PartidoOut, PartidoCreate
from app.supabase_client import supabase
from app.services.auth import obtener_info_desde_token
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[EquipoOut])
def obtener_equipos(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los equipos del club")

    response = supabase.table("equipos").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    return response.data

        
@router.get("/{equipo_id}", response_model=EquipoOut)
def obtener_equipo(equipo_id: int):
    response = supabase.table("equipos").select("*").eq("id", equipo_id).execute()

    if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Equipo no encontrado")

    equipo = response.data[0]
    return equipo


@router.get("/{equipo_id}/jugadores/", response_model=List[JugadorOut])
def obtener_jugadores_equipo(equipo_id: int):
    response = supabase.table("jugadores").select("*").eq("equipos_id", equipo_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="No se encontraron jugadores para este equipo")

    return response.data


# @router.post("/", response_model=EquipoOut)
# def crear_equipo(equipo: EquipoCreate):
#     response = supabase.table("equipos").insert(equipo.dict()).execute()

#     if getattr (response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al crear el equipo: {response.error.message}")

#     return response.data[0]

@router.post("/{id_equipo}/partido/", response_model=PartidoOut)
def crear_partido(id_equipo: int, partido: PartidoCreate, datos_token: dict = Depends(obtener_info_desde_token)):
   
    equipo = supabase.table("equipos").select("*").eq("id", id_equipo).execute()

    if not equipo.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    if equipo.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para crear partidos para este equipo")

    data = partido.dict()
    data["equipos_id"] = id_equipo

    # Convertir datetime a string ISO
    for key, value in data.items():
        if isinstance(value, datetime):
            data[key] = value.isoformat()

    response = supabase.table("partidos").insert(data).execute()
    return response.data[0]


@router.delete("/{equipo_id}")
def eliminar_equipo(equipo_id: int):
    response = supabase.table("equipos").delete().eq("id", equipo_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el jugador: {response.error.message}")

    if response.data == 0:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    return {"message": "Equipo eliminado correctamente"}


@router.put("/{id}")
def actualizar_equipo(id: int, equipo: EquipoUpdate):
    datos_actualizados = equipo.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
    
    equipo_existente = supabase.table("equipos").select("*").eq("id", id).execute()
    if not equipo_existente.data or len(equipo_existente.data) == 0:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    try:
        respuesta = supabase.table("equipos").update(datos_actualizados).eq("id", id).execute()
        return {"mensaje": "Equipo actualizado correctamente", "datos_actualizados": respuesta.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el equipo: {str(e)}")