class ZonaLanzamientoBase(BaseModel):
    nombre: str  # zona-ex-iz, zona-ce, etc.

class ZonaLanzamientoCreate(ZonaLanzamientoBase):
    pass

class ZonaLanzamiento(ZonaLanzamientoBase):
    id: str = Field(default_factory=str, alias="_id")
