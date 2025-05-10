from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class Jugador(BaseModel):
    id: int 
    fecha_nac: date
    nombre: str
    foto: str
    created_at: datetime
    updated_at: datetime
    golesei: int
    golesli: int
    golesld: int
    goles7m: int
    golesc: int
    golesed: int
    golest: int
    golespi: int
    lanzamientos_7m: int
    lanzamientos: int
    asistencias: int
    perdidas: int
    recuperaciones: int
    exclusiones: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    tarjetas_azules: int
    dorsal: int
    equipos_id: int

    class Config:
        orm_mode = True

class JugadorCreate(BaseModel):
    fecha_nac: date
    nombre: str
    foto: Optional[str] = None
    golesei: Optional[int] = 0
    golesli: Optional[int] = 0
    golesld: Optional[int] = 0
    goles7m: Optional[int] = 0
    golesc: Optional[int] = 0
    golesed: Optional[int] = 0
    golest: Optional[int] = 0
    golespi: Optional[int] = 0
    lanzamientos_7m: Optional[int] = 0
    lanzamientos: Optional[int] = 0
    asistencias: Optional[int] = 0
    perdidas: Optional[int] = 0
    recuperaciones: Optional[int] = 0
    exclusiones: Optional[int] = 0
    tarjetas_amarillas: Optional[int] = 0
    tarjetas_rojas: Optional[int] = 0 
    tarjetas_azules: Optional[int] = 0
    dorsal: int 
    equipos_id: int

    class Config:
        orm_mode = True

class JugadorUpdate(BaseModel):
    fecha_nac: Optional[date] = None
    nombre: Optional[str] = None
    foto: Optional[str] = None
    golesei: Optional[int] = None
    golesli: Optional[int] = None
    golesld: Optional[int] = None
    goles7m: Optional[int] = None
    golesc: Optional[int] = None
    golesed: Optional[int] = None
    golest: Optional[int] = None
    golespi: Optional[int] = None
    lanzamientos_7m: Optional[int] = None
    lanzamientos: Optional[int] = None
    asistencias: Optional[int] = None
    perdidas: Optional[int] = None
    recuperaciones: Optional[int] = None
    exclusiones: Optional[int] = None
    tarjetas_amarillas: Optional[int] = None
    tarjetas_rojas: Optional[int] = None
    tarjetas_azules: Optional[int] = None
    dorsal: Optional[int] = None
    equipos_id: Optional[int] = None

    class Config:
        orm_mode = True

class JugadorOut(BaseModel):
    id: int
    fecha_nac: date
    nombre: str
    foto: str
    created_at: datetime
    updated_at: datetime
    golesei: int
    golesli: int
    golesld: int
    goles7m: int
    golesc: int
    golesed: int
    golest: int
    golespi: int
    lanzamientos_7m: int
    lanzamientos: int
    asistencias: int
    perdidas: int
    recuperaciones: int
    exclusiones: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    tarjetas_azules: int
    dorsal: int
    equipos_id: int

    class Config:
        orm_mode = True
        
