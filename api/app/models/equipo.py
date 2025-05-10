from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Equipo(BaseModel):
    id: int
    nombre: str
    categoria: str
    created_at: datetime
    updated_at: datetime 
    descripcion: Optional[str] = None
    clubs_id: Optional[int] = None

    class Config:
        orm_mode = True

class EquipoCreate(BaseModel):
    nombre: str
    categoria: str
    descripcion: Optional[str] = None
    clubs_id: Optional[int] = None
    

    class Config:
        orm_mode = True

class EquipoUpdate(BaseModel):
    nombre: Optional[str] = None
    categoria: Optional[str] = None
    descripcion: Optional[str] = None
    clubs_id: Optional[int] = None

    class Config:
        orm_mode = True

class EquipoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class EquipoOut(BaseModel):
    id: int
    nombre: str
    categoria: str
    descripcion: Optional[str] = None
    clubs_id: Optional[int] = None
    created_at: Optional[datetime]
    updated_at: Optional[datetime] 
    
    class Config:
        orm_mode = True
