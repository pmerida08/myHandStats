#  Modelo Pydantic (valida datos de entrada)
class JugadorBase(BaseModel):
    foto: Optional[str] = None
    nombre: str
    dorsal: int
    posicion: str
    edad: int

class JugadorCreate(JugadorBase):
    pass

class Jugador(JugadorBase):
    id: str = Field(default_factory=str, alias="_id")
