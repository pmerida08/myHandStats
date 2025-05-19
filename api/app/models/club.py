from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Club(BaseModel):
    id: int
    nombre: str
    descripcion: str
    logo: str
    suscripcion_at: str
    fecha_suscripcion: datetime
    tel_contacto: str

    class Config:
        orm_mode = True

class ClubCreate(BaseModel):
    nombre: str
    descripcion: str
    logo: str
    suscripcion_at: str
    fecha_suscripcion: datetime
    tel_contacto: str

    class Config:
        orm_mode = True

class ClubUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    logo: Optional[str] = None
    suscripcion_at: Optional[str] = None
    tel_contacto: Optional[str] = None

    class Config:
        orm_mode = True

class ClubDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True
    
class ClubOut(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    logo: Optional[str] = None
    suscripcion_at: Optional[str] = None
    tel_contacto: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        orm_mode = True