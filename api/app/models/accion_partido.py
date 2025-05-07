from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AccionPartido(BaseModel):
    id: int
    minuto: str
    jugadores_partido_id: int
    acciones_id: int

    class Config:
        orm_mode = True

class AccionPartidoCreate(BaseModel):
    minuto: str
    jugadores_partido_id: int
    acciones_id: int

    class Config:
        orm_mode = True

class AccionPartidoUpdate(BaseModel):
    minuto: Optional[str] = None
    jugadores_partido_id: Optional[int] = None
    acciones_id: Optional[int] = None

    class Config:
        orm_mode = True

class AccionPartidoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class AccionPartidoOut(BaseModel):
    id: int
    minuto: str
    jugadores_partido_id: int
    acciones_id: int

    class Config:
        orm_mode = True