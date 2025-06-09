from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Modelo para la entidad Partido
class Partido(BaseModel):
    id: int
    fecha: datetime
    goles_id_equipo: int
    goles_id_equiporival: int
    equiporival_id: str
    equipos_id: int

    class Config:
        orm_mode = True
        
# Modelos para crear, actualizar, eliminar y leer datos de partidos
class PartidoCreate(BaseModel):
    fecha: datetime
    goles_id_equipo: int
    goles_id_equiporival: int
    equiporival_id: str
    equipos_id: int

    class Config:
        orm_mode = True
        
# Modelo para actualizar datos de partidos (los campos son opcionales)
class PartidoUpdate(BaseModel):
    fecha: Optional[datetime] = None
    goles_id_equipo: Optional[int] = None
    goles_id_equiporival: Optional[int] = None
    equiporival_id: Optional[str] = None
    equipos_id: Optional[int] = None

    class Config:
        orm_mode = True

# Modelo para eliminar partidos (solo necesita el ID)
class PartidoDelete(BaseModel):
    id: int

    class Config:
        orm_mode = True

# Modelo para la respuesta de los partidos (para salida)
class PartidoOut(BaseModel):
    id: int
    fecha: datetime
    goles_id_equipo: int
    goles_id_equiporival: int
    equiporival_id: str
    equipos_id: int

    class Config:
        orm_mode = True
