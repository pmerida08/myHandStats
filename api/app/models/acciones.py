from pydantic import BaseModel

# Modelo para la entidad Acciones
class Acciones(BaseModel):
    id: int
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True

# Modelos para crear, actualizar, eliminar y leer datos de Acciones
class AccionesCreate(BaseModel):    
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True

# Modelo para actualizar datos de Acciones (los campos son opcionales)
class AccionesOut(BaseModel):
    id: int
    nombre: str
    tipo_accion: str

    class Config:
        orm_mode = True
        
