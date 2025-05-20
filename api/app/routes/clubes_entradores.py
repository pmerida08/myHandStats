from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.club_entrenador import ClubEntrenador, ClubEntrenadorCreate, ClubEntrenadorUpdate, ClubEntrenadorDelete, ClubEntrenadorOut
from app.supabase_client import supabase

router = APIRouter()

# @router.get("/", response_model=List[ClubEntrenadorOut])
# def get_clubes_entrenadores():
#     response = supabase.table("clubes_entrenadores").select("*").execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al obtener los clubes-entrenadores: {response.error.message}")

#     return response.data

# @router.post("/", response_model=ClubEntrenadorOut)
# def crear_club_entrenador(club_entrenador: ClubEntrenadorCreate):
#     response = supabase.table("clubes_entrenadores").insert(club_entrenador.dict()).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al crear el club-entrenador: {response.error.message}")

#     return response.data[0]

# @router.delete("/{club_id}/{entrenador_id}")
# def eliminar_club_entrenador(club_id: int, entrenador_id: int):
#     response = supabase.table("clubes_entrenadores").delete().eq("club_id", club_id).eq("entrenador_id", entrenador_id).execute()

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al eliminar el club-entrenador: {response.error.message}")

#     if response.data == 0:
#         raise HTTPException(status_code=404, detail="Club-entrenador no encontrado")

#     return {"message": "Club-entrenador eliminado correctamente"}

# @router.put("/{club_id}/{entrenador_id}")
# def actualizar_club_entrenador(club_id: int, entrenador_id: int, club_entrenador: ClubEntrenadorUpdate):
#     datos_actualizados = club_entrenador.dict(exclude_unset=True)

#     if not datos_actualizados:
#         raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")
    
#     club_entrenador_existente = supabase.table("clubes_entrenadores").select("*").eq("club_id", club_id).eq("entrenador_id", entrenador_id).execute()
#     if not club_entrenador_existente.data or len(club_entrenador_existente.data) == 0:
#         raise HTTPException(status_code=404, detail="Club-entrenador no encontrado")
    
#     try:
#         respuesta = supabase.table("clubes_entrenadores").update(datos_actualizados).eq("club_id", club_id).eq("entrenador_id", entrenador_id).execute()
#         if getattr(respuesta, "error", None):
#             raise HTTPException(status_code=400, detail=f"Error al actualizar el club-entrenador: {respuesta.error.message}")
        
#         return {"message": "Club-entrenador actualizado correctamente"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")