from fastapi import APIRouter, HTTPException
from typing import List
from app.models.tipo_perdida_balon import TipoPerdidaBalon
from app.supabase_client import supabase

router = APIRouter()

@router.get("/", response_model=List[TipoPerdidaBalon])
def get_tipos_perdidas_balon():
    response = supabase.table("tipos_perdida_balon").select("*").execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=500, detail="Error fetching data from Supabase")
    
    return response.data