from pydantic import BaseModel
from typing import Optional

class AccionFase(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

class AccionFaseCreate(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

class AccionFaseUpdate(BaseModel):
    acciones_partido_id: Optional[int] = None
    fase_juego_id: Optional[int] = None

    class Config:
        orm_mode = True

class AccionFaseDelete(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True

class AccionFaseOut(BaseModel):
    acciones_partido_id: int
    fase_juego_id: int

    class Config:
        orm_mode = True