class EquipoBase(BaseModel):
    id_usuario: str
    categoria: str
    entrenador: str
    fecha_creacion: Optional[str] = None

class EquipoCreate(EquipoBase):
    pass

class Equipo(EquipoBase):
    id: str = Field(default_factory=str, alias="_id")
