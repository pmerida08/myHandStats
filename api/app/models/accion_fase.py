from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JugadorFase(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

class JugadorFaseCreate(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

class JugadorFaseUpdate(BaseModel):
    acciones_partido_id: Optional[int] = None
    fase_juego_id: Optional[int] = None

    class Config:
        orm_mode = True

class JugadorFaseDelete(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

class JugadorFaseOut(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True