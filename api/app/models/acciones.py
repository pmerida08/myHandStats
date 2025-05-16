from pydantic import BaseModel

class Acciones(BaseModel):
    id: int
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True

class AccionesCreate(BaseModel):    
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True

class AccionesOut(BaseModel):
    id: int
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True
        
