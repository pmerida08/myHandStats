from fastapi import APIRouter, HTTPException
from typing import List
from app.models.tipo_lanzamiento import TipoLanazamiento
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[TipoLanazamiento])
def get_tipos_lanzamientos():
    response = supabase.table("tipos_lanzamiento").select("*").execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=response.status_code, detail="Error fetching data")
    
    return response.data