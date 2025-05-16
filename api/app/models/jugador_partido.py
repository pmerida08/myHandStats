from pydantic import BaseModel
from typing import Optional

class JugadorPartido(BaseModel):
    id: int
    golesli: int
    golesld: int
    golesei: int
    golesc: int
    goles7m: int
    golesed: int
    golest: int
    golespi: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    lanzamientos: int
    lanzamiento_7m: int
    exclusiones: int
    recuperaciones: int
    perdidas: int
    partidos_id: int
    jugadores_id: int
    paradas: Optional[int] = 0
    lanzamiento_ed: int
    lanzamiento_li: int
    lanzamiento_c: int
    lanzamiento_pi: int
    lanzamiento_ext_ld: int
    lanzamiento_ext_li: int
    lanzamiento_ext_c: int
    exclusion_2_min: int
    tarjetas_azules: int
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

class JugadorPartidoCreate(BaseModel):
    golesli: int
    golesld: int
    golesei: int
    golesc: int
    goles7m: int
    golesed: int
    golest: int
    golespi: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    lanzamientos: int
    lanzamiento_7m: int
    exclusiones: int
    recuperaciones: int
    perdidas: int
    partidos_id: int
    jugadores_id: int
    paradas: Optional[int] = 0
    lanzamiento_ed: int
    lanzamiento_li: int
    lanzamiento_c: int
    lanzamiento_pi: int
    lanzamiento_ext_ld: int
    lanzamiento_ext_li: int
    lanzamiento_ext_c: int
    exclusion_2_min: int
    tarjetas_azules: int
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

class JugadorPartidoUpdate(BaseModel):
    golesli: Optional[int] = None
    golesld: Optional[int] = None
    golesei: Optional[int] = None
    golesc: Optional[int] = None
    goles7m: Optional[int] = None
    golesed: Optional[int] = None
    golest: Optional[int] = None
    golespi: Optional[int] = None
    tarjetas_amarillas: Optional[int] = None
    tarjetas_rojas: Optional[int] = None
    lanzamientos: Optional[int] = None
    lanzamiento_7m: Optional[int] = None
    exclusiones: Optional[int] = None
    recuperaciones: Optional[int] = None
    perdidas: Optional[int] = None
    partidos_id: Optional[int] = None
    jugadores_id: Optional[int] = None
    paradas: Optional[int] = None
    lanzamiento_ed: Optional[int] = None
    lanzamiento_li: Optional[int] = None
    lanzamiento_c: Optional[int] = None
    lanzamiento_pi: Optional[int] = None
    lanzamiento_ext_ld: Optional[int] = None
    lanzamiento_ext_li: Optional[int] = None
    lanzamiento_ext_c: Optional[int] = None
    exclusion_2_min: Optional[int] = None
    tarjetas_azules: Optional[int] = None
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

class JugadorPartidoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

class JugadorPartidoOut(BaseModel):
    id: int
    golesli: int
    golesld: int
    golesei: int
    golesc: int
    goles7m: int
    golesed: int
    golest: int
    golespi: int
    tarjetas_amarillas: int
    tarjetas_rojas: int
    lanzamientos: int
    lanzamiento_7m: int
    exclusiones: int
    recuperaciones: int
    perdidas: int
    partidos_id: int
    jugadores_id: int
    paradas: Optional[int] = 0
    lanzamiento_ed: int
    lanzamiento_li: int
    lanzamiento_c: int
    lanzamiento_pi: int
    lanzamiento_ext_ld: int
    lanzamiento_ext_li: int
    lanzamiento_ext_c: int
    exclusion_2_min: int
    tarjetas_azules: int
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