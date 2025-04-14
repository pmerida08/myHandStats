class PartidoBase(BaseModel):
    equipo_id: str
    equipo_rival: str
    fecha: str

class PartidoCreate(PartidoBase):
    pass

class Partido(PartidoBase):
    id: str = Field(default_factory=str, alias="_id")
