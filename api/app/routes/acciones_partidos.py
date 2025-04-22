from fastapi import APIRouter, HTTPException
from typing import List
from app.models.accion_partido import AccionPartido, AccionPartidoCreate
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[AccionPartido])
def get_acciones_partidos():
    
    response = supabase.table("acciones_partido").select("*").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    return response.data

@router.post("/", response_model=AccionPartidoCreate)
def create_accion_partido(accion_partido: AccionPartidoCreate):
    
    response = supabase.table("acciones_partido").insert(accion_partido.dict()).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error inserting data into Supabase")
    
    return response.data[0]

