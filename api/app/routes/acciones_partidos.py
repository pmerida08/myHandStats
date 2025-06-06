from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.acciones_partido import AccionesPartido, AccionesPartidoCreate, AccionesPartidoOut
from app.services.auth import obtener_info_desde_token
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[AccionesPartido])
def get_acciones_partidos():
    
    response = supabase.table("acciones_partido").select("*").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    return response.data


@router.post("/", response_model=AccionesPartidoOut)
def create_accion_partido(
    accion_partido: AccionesPartidoCreate,
    datos_token: dict = Depends(obtener_info_desde_token)
):
    # Obtener el id del jugador_partido
    jugador_partido_id = accion_partido.jugadores_partido_id

    # Consultar el jugador_partido para obtener el jugador_id
    response = supabase.table("jugadores_partido").select("jugadores_id").eq("id", jugador_partido_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Jugador partido not found")
    
    jugador_club = supabase.table("jugadores").select("equipos_id").eq("id", response.data[0]["jugadores_id"]).execute()
    if getattr(jugador_club, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    if not jugador_club.data:
        raise HTTPException(status_code=404, detail="Jugador not found")
    
    clubs_id_equipo = supabase.table("equipos").select("clubs_id").eq("id", jugador_club.data[0]["equipos_id"]).execute()
    if getattr(clubs_id_equipo, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    if not clubs_id_equipo.data:
        raise HTTPException(status_code=404, detail="Equipo not found")
    
    if clubs_id_equipo.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para crear esta acción de partido")
    # Crear la acción de partido
    response = supabase.table("acciones_partido").insert(accion_partido.dict()).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error inserting data into Supabase")
    if not response.data:
        raise HTTPException(status_code=404, detail="Accion partido not found")
    return response.data[0]

@router.put("/{id}", response_model=AccionesPartidoOut)
def update_accion_partido(
    id: int,
    accion_partido: AccionesPartidoCreate,
    datos_token: dict = Depends(obtener_info_desde_token)
):
    # Obtener el id del jugador_partido
    jugador_partido_id = accion_partido.jugadores_partido_id

    # Consultar el jugador_partido para obtener el jugador_id
    response = supabase.table("jugadores_partido").select("jugadores_id").eq("id", jugador_partido_id).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Jugador partido not found")
    
    jugador_club = supabase.table("jugadores").select("equipos_id").eq("id", response.data[0]["jugadores_id"]).execute()
    if getattr(jugador_club, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    if not jugador_club.data:
        raise HTTPException(status_code=404, detail="Jugador not found")
    
    clubs_id_equipo = supabase.table("equipos").select("clubs_id").eq("id", jugador_club.data[0]["equipos_id"]).execute()
    if getattr(clubs_id_equipo, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    if not clubs_id_equipo.data:
        raise HTTPException(status_code=404, detail="Equipo not found")
    
    if clubs_id_equipo.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar esta acción de partido")
    
    # Actualizar la acción de partido
    response = supabase.table("acciones_partido").update(accion_partido.dict()).eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error updating data in Supabase")
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Accion partido not found")
    
    return response.data[0]

@router.delete("/{id}")
def delete_accion_partido( id: int, datos_token: dict = Depends(obtener_info_desde_token)):
    # Obtener la acción de partido para verificar permisos
    accion = supabase.table("acciones_partido").select("jugadores_partido_id").eq("id", id).execute()
    if getattr(accion, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    if not accion.data:
        raise HTTPException(status_code=404, detail="Accion partido not found")

    # Obtener el jugador_partido
    jugador_partido = supabase.table("jugadores_partido").select("jugadores_id").eq("id", accion.data[0]["jugadores_partido_id"]).execute()
    if getattr(jugador_partido, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    if not jugador_partido.data:
        raise HTTPException(status_code=404, detail="Jugador partido not found")

    # Obtener el equipo del jugador
    jugador = supabase.table("jugadores").select("equipos_id").eq("id", jugador_partido.data[0]["jugadores_id"]).execute()
    if getattr(jugador, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    if not jugador.data:
        raise HTTPException(status_code=404, detail="Jugador not found")
   
    # print (jugador.data[0]["equipos_id"])
    # Obtener el club del equipo
    equipo = supabase.table("equipos").select("clubs_id").eq("id", jugador.data[0]["equipos_id"]).execute()
    if getattr(equipo, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    if not equipo.data:
        raise HTTPException(status_code=404, detail="Equipo not found")

    print (equipo.data[0]["clubs_id"], datos_token["clubs_id"])
    if equipo.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para borrar esta acción de partido")

    # Borrar la acción de partido
    response = supabase.table("acciones_partido").delete().eq("id", id).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error deleting data from Supabase")
    return {"detail": "Accion partido borrada correctamente"}