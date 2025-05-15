from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.equipo import Equipo, EquipoCreate, EquipoUpdate, EquipoDelete, EquipoOut
from app.models.jugador import JugadorOut, JugadorCreate, JugadorUpdate
from app.models.partido import PartidoOut, PartidoCreate
from app.models.entrenador import EntrenadorOut, EntrenadorCreate, EntrenadorUpdate
from app.supabase_client import supabase
from app.services.auth import obtener_info_desde_token
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[EquipoOut])
def obtener_equipos_club(datos_token: dict = Depends(obtener_info_desde_token)):
    
    response = supabase.table("equipos").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    return response.data

        
@router.get("/{equipo_id}/entrenadores/", response_model=List[EntrenadorOut])
def obtener_entrenadores_equipo(equipo_id: int, datos_token: dict = Depends(obtener_info_desde_token)):
    equipo_data = supabase.table("equipos").select("*").eq("id", equipo_id).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver los entrenadores de este equipo")

    # 1. Obtener los IDs de los entrenadores asociados al equipo
    relaciones = supabase.table("equipo_entrenador").select("entrenador_id").eq("equipo_id", equipo_id).execute()
    if not relaciones.data or len(relaciones.data) == 0:
        raise HTTPException(status_code=404, detail="No se encontraron entrenadores para este equipo")

    entrenador_ids = [rel["entrenador_id"] for rel in relaciones.data]

    # 2. Obtener los datos de los entrenadores
    response = supabase.table("entrenadores").select("*").in_("id", entrenador_ids).execute()
    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="No se encontraron entrenadores para este equipo")

    return response.data


@router.get("/{equipo_id}/entrenador/{entrenador_id}", response_model=EntrenadorOut)
def obtener_entrenador_equipo(equipo_id: int, entrenador_id: int, datos_token: dict = Depends(obtener_info_desde_token)):
    equipo_data = supabase.table("equipos").select("*").eq("id", equipo_id).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver los entrenadores de este equipo")

    # Verificar que el entrenador está asociado al equipo
    relacion = supabase.table("equipo_entrenador").select("*").eq("equipo_id", equipo_id).eq("entrenador_id", entrenador_id).execute()
    if not relacion.data or len(relacion.data) == 0:
        raise HTTPException(status_code=404, detail="El entrenador no está asociado a este equipo")

    # Obtener los datos del entrenador
    entrenador_data = supabase.table("entrenadores").select("*").eq("id", entrenador_id).execute()
    if not entrenador_data.data or len(entrenador_data.data) == 0:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")

    return entrenador_data.data[0]


@router.get("/{equipo_id}/jugadores/", response_model=List[JugadorOut])
def obtener_jugadores_equipo(equipo_id: int , datos_token: dict = Depends(obtener_info_desde_token)):

    equipo_data = supabase.table("equipos").select("*").eq("id", equipo_id).execute()

    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver los jugadores de este equipo")
    
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")    

    response = supabase.table("jugadores").select("*").eq("equipos_id", equipo_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(status_code=404, detail="No se encontraron jugadores para este equipo")

    return response.data

@router.get("/{equipo_id}/jugador/{jugador_id}", response_model=JugadorOut)
def obtener_jugador_equipo(equipo_id: int, jugador_id: int, datos_token: dict = Depends(obtener_info_desde_token)):
    equipo_data = supabase.table("equipos").select("*").eq("id", equipo_id).execute()

    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver los jugadores de este equipo")

    # Verificar que el jugador está asociado al equipo
    jugador_data = supabase.table("jugadores").select("*").eq("id", jugador_id).eq("equipos_id", equipo_id).execute()
    if not jugador_data.data or len(jugador_data.data) == 0:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    return jugador_data.data[0]

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


@router.post("/{id_equipo}/jugador/", response_model=JugadorOut)
def crear_jugador_equipo(id_equipo: int, jugador: JugadorCreate, datos_token: dict = Depends(obtener_info_desde_token)):

    equipo_data = supabase.table("equipos").select("*").eq("id", id_equipo).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para crear jugadores para este equipo")
    
    # Convertir a diccionario y eliminar campos no enviados
    jugador_dict = jugador.dict()
    
    # Convertir fecha a string en formato ISO (YYYY-MM-DD)
    jugador_dict["fecha_nac"] = jugador_dict["fecha_nac"].isoformat()

    response = supabase.table("jugadores").insert(jugador_dict).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el jugador: {response.error.message}")

    return response.data[0]


@router.post("/{equipo_id}/entrenador/", response_model=EntrenadorOut)
def crear_entrenador(equipo_id: int, entrenador: EntrenadorCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    equipo_data = supabase.table("equipos").select("*").eq("id", equipo_id).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para crear entrenadores para este equipo")

    # Crear el entrenador
    entrenador_dict = entrenador.dict()
    response = supabase.table("entrenadores").insert(entrenador_dict).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el entrenador: {response.error.message}")

    entrenador_id = response.data[0]["id"]

    # Crear la relación en entrenadores_equipos
    rel_response = supabase.table("equipo_entrenador").insert({
        "equipo_id": equipo_id,
        "entrenador_id": entrenador_id
    }).execute()

    if getattr(rel_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al asociar entrenador con equipo: {rel_response.error.message}")

    return response.data[0]

# @router.delete("/{equipo_id}")
# def eliminar_equipo(equipo_id: int):
#     response = supabase.table("equipos").delete().eq("id", equipo_id).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al eliminar el jugador: {response.error.message}")

#     if response.data == 0:
#         raise HTTPException(status_code=404, detail="Equipo no encontrado")

#     return {"message": "Equipo eliminado correctamente"}


@router.put("/{id}")
def actualizar_equipo(id: int, equipo: EquipoUpdate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden actualizar equipos")
    
    # Verificar si el equipo pertenece al club del usuario
    equipo_data = supabase.table("equipos").select("*").eq("id", id).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este equipo")
    
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
    

@router.put("{equipo_id}/jugador/{id}")
def actualizar_jugador(id: int, jugador: JugadorUpdate, datos_token: dict = Depends(obtener_info_desde_token)):
    equipo_data = supabase.table("jugadores").select("*").eq("id", id).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este jugador")
    
    # Verificamos si el jugador pertenece al club del usuario
    jugador_data = supabase.table("jugadores").select("*").eq("id", id).execute()
    if not jugador_data.data:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    if jugador_data.data[0]["equipos_id"] != datos_token["equipos_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este jugador")

    datos_actualizados = jugador.dict(exclude_unset=True)

    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

    # Comprobamos si el jugador existe
    jugador_existente = supabase.table("jugadores").select("id").eq("id", id).execute()
    if not jugador_existente.data:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    # Hacemos el update
    try:
        respuesta = supabase.table("jugadores").update(datos_actualizados).eq("id", id).execute()
        return {"mensaje": "Jugador actualizado correctamente", "datos": respuesta.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar jugador: {str(e)}")
    

@router.put("/{equipo_id}/entrenador/{entrenador_id}", response_model=EntrenadorOut)
def actualizar_entrenador( 
    equipo_id: int,
    entrenador_id: int,
    entrenador: EntrenadorUpdate,
    datos_token: dict = Depends(obtener_info_desde_token)
):
    equipo_data = supabase.table("equipos").select("*").eq("id", equipo_id).execute()
    if not equipo_data.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    if equipo_data.data[0]["clubs_id"] != datos_token["clubs_id"]:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar entrenadores de este equipo")

    # Verificar que el entrenador está asociado al equipo
    relacion = supabase.table("equipo_entrenador").select("*").eq("equipo_id", equipo_id).eq("entrenador_id", entrenador_id).execute()
    if not relacion.data or len(relacion.data) == 0:
        raise HTTPException(status_code=404, detail="El entrenador no está asociado a este equipo")

    datos_actualizados = entrenador.dict(exclude_unset=True)
    if not datos_actualizados:
        raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

    try:
        respuesta = supabase.table("entrenadores").update(datos_actualizados).eq("id", entrenador_id).execute()
        if not respuesta.data:
            raise HTTPException(status_code=404, detail="Entrenador no encontrado")
        return respuesta.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el entrenador: {str(e)}")