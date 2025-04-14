
class FaseJuegoBase(BaseModel):
    nombre: str  # Ofensivo, Contraataque, etc.

class FaseJuegoCreate(FaseJuegoBase):
    pass

class FaseJuego(FaseJuegoBase):
    id: str = Field(default_factory=str, alias="_id")
