class PosicionBase(BaseModel):
    nombre: str  # portero, lateral, etc.

class PosicionCreate(PosicionBase):
    pass

class Posicion(PosicionBase):
    id: str = Field(default_factory=str, alias="_id")
