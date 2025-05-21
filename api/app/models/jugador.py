from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.models.posicion import PosicionOut
from typing import List

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
    lanzamiento_7m: int
    lanzamientos: int
    perdidas: int
    recuperaciones: int
    exclusiones: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    dorsal: int
    equipos_id: int
    tarjetas_azules: int
    lanzamiento_ed: int
    lanzamiento_ei: int
    lanzamiento_ld: int
    lanzamiento_li: int
    lanzamiento_c: int
    lanzamiento_pi: int
    lanzamiento_ext_li: int
    lanzamiento_ext_ld: int
    lanzamiento_ext_c: int
    exclusion_2_min: int
    fallo_pase: int
    fallo_recepcion: int
    pasos: int
    falta_en_ataque: int
    dobles: int
    invasion_area: int
    blocaje: int
    robo: int

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
    lanzamiento_7m: Optional[int] = 0
    lanzamientos: Optional[int] = 0
    perdidas: Optional[int] = 0
    recuperaciones: Optional[int] = 0
    exclusiones: Optional[int] = 0
    tarjetas_amarillas: Optional[int] = 0
    tarjetas_rojas: Optional[int] = 0 
    dorsal: int 
    equipos_id: int
    tarjetas_azules: Optional[int] = 0
    lanzamiento_ed: Optional[int] = 0
    lanzamiento_ei: Optional[int] = 0
    lanzamiento_ld: Optional[int] = 0
    lanzamiento_li: Optional[int] = 0
    lanzamiento_c: Optional[int] = 0
    lanzamiento_pi: Optional[int] = 0
    lanzamiento_ext_li: Optional[int] = 0
    lanzamiento_ext_ld: Optional[int] = 0
    lanzamiento_ext_c: Optional[int] = 0
    exclusion_2_min: Optional[int] = 0
    fallo_pase: Optional[int] = 0
    fallo_recepcion: Optional[int] = 0
    pasos: Optional[int] = 0
    falta_en_ataque: Optional[int] = 0
    dobles: Optional[int] = 0
    invasion_area: Optional[int] = 0
    blocaje: Optional[int] = 0
    robo: Optional[int] = 0

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
    lanzamiento_7m: Optional[int] = None
    lanzamientos: Optional[int] = None
    perdidas: Optional[int] = None
    recuperaciones: Optional[int] = None
    exclusiones: Optional[int] = None
    tarjetas_amarillas: Optional[int] = None
    tarjetas_rojas: Optional[int] = None
    dorsal: Optional[int] = None
    equipos_id: Optional[int] = None
    tarjetas_azules: Optional[int] = None
    lanzamiento_ed: Optional[int] = None
    lanzamiento_ei: Optional[int] = None
    lanzamiento_ld: Optional[int] = None
    lanzamiento_li: Optional[int] = None
    lanzamiento_c: Optional[int] = None
    lanzamiento_pi: Optional[int] = None
    lanzamiento_ext_li: Optional[int] = None
    lanzamiento_ext_ld: Optional[int] = None
    lanzamiento_ext_c: Optional[int] = None
    exclusion_2_min: Optional[int] = None
    fallo_pase: Optional[int] = None
    fallo_recepcion: Optional[int] = None
    pasos: Optional[int] = None
    falta_en_ataque: Optional[int] = None
    dobles: Optional[int] = None
    invasion_area: Optional[int] = None
    blocaje: Optional[int] = None
    robo: Optional[int] = None

    class Config:
        orm_mode = True

class JugadorOut(BaseModel):
    id: int
    fecha_nac: date
    nombre: str
    posiciones: List[PosicionOut]
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
    lanzamiento_7m: int
    lanzamientos: int
    perdidas: int
    recuperaciones: int
    exclusiones: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    dorsal: int
    equipos_id: int
    tarjetas_azules: int
    lanzamiento_ed: int
    lanzamiento_ei: int
    lanzamiento_ld: int
    lanzamiento_li: int
    lanzamiento_c: int
    lanzamiento_pi: int
    lanzamiento_ext_li: int
    lanzamiento_ext_ld: int
    lanzamiento_ext_c: int
    exclusion_2_min: int
    fallo_pase: int
    fallo_recepcion: int
    pasos: int
    falta_en_ataque: int
    dobles: int
    invasion_area: int
    blocaje: int
    robo: int

    class Config:
        orm_mode = True

