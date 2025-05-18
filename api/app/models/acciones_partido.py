from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccionesPartido(BaseModel):
    id: int
    minuto: str
    jugadores_partido_id: int
    acciones_id: int
    fases_juego_id: int

    class Config:
        orm_mode = True

class AccionesPartidoCreate(BaseModel):
    minuto: str
    jugadores_partido_id: int
    acciones_id: int
    fases_juego_id: int

    class Config:
        orm_mode = True

class AccionesPartidoUpdate(BaseModel):
    minuto: Optional[str] = None
    jugadores_partido_id: Optional[int] = None
    acciones_id: Optional[int] = None
    fases_juego_id: Optional[int] = None

    class Config:
        orm_mode = True

class AccionesPartidoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class AccionesPartidoOut(BaseModel):
    id: int
    minuto: str
    jugadores_partido_id: int
    acciones_id: int
    fases_juego_id: int

    class Config:
        orm_mode = True