from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Partido(BaseModel):
    id: int
    equipo_id: int
    equipo_rival: str
    fecha: datetime

    class Config:
        orm_mode = True

class PartidoCreate(BaseModel):
    equipo_id: int
    equipo_rival: str
    fecha: Optional[datetime] = None

    class Config:
        orm_mode = True

class PartidoUpdate(BaseModel):
    equipo_id: Optional[int] = None
    equipo_rival: Optional[str] = None
    fecha: Optional[datetime] = None

    class Config:
        orm_mode = True

class PartidoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class PartidoOut(BaseModel):
    id: int
    equipo_id: int
    equipo_rival: str
    fecha: datetime

    class Config:
        orm_mode = True