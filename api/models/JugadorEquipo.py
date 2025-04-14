class JugadorEquipoBase(BaseModel):
    jugador_id: str
    equipo_id: str

class JugadorEquipoCreate(JugadorEquipoBase):
    pass

class JugadorEquipo(JugadorEquipoBase):
    id: str = Field(default_factory=str, alias="_id")
