from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class club_entrenador(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

class ClubEntrenadorCreate(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

class ClubEntrenadorUpdate(BaseModel):
    club_id: Optional[int] = None
    entrenador_id: Optional[int] = None

    class Config:
        orm_mode = True

class ClubEntrenadorDelete(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True

class ClubEntrenadorOut(BaseModel):
    club_id: int
    entrenador_id: int

    class Config:
        orm_mode = True