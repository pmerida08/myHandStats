from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccionPartido(BaseModel):
    id: int
    partido_id: int
    jugador_id: int
    minuto: int
    tipo_accion: str
    tipo_lanzamiento: Optional[str] = None
    tipo_lanzamiento_7m: Optional[str] = None
    tipo_perdida: Optional[str] = None
    zona_lanzamiento: Optional[str] = None
    fase_juego: Optional[str] = None
    resultado: Optional[str] = None

    class Config:
        orm_mode = True

class AccionPartidoCreate(BaseModel):
    partido_id: int
    jugador_id: int
    minuto: int
    tipo_accion: str
    tipo_lanzamiento_id: Optional[str] = None
    tipo_7m_id: Optional[str] = None
    tipo_perdida_id: Optional[str] = None
    zona_lanzamiento_id: Optional[str] = None
    fase_juego_id: Optional[str] = None
    resultado: Optional[str] = None

    class Config:
        orm_mode = True