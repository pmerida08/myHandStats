# app/main.py
from fastapi import FastAPI
from app.routes import usuarios, jugadores, equipos, partidos, zonas_lanzamientos, tipos_perdidas_balon, tipos_lanzamientos_7m, tipos_lazamientos, posiciones

app = FastAPI()

app.include_router(usuarios.router, prefix="/usuarios")
app.include_router(jugadores.router, prefix="/jugadores")
app.include_router(equipos.router, prefix="/equipos")
app.include_router(partidos.router, prefix="/partidos")
app.include_router(zonas_lanzamientos.router, prefix="/zonas_lanzamientos")
app.include_router(tipos_perdidas_balon.router, prefix="/tipos_perdidas_balon") 
app.include_router(tipos_lanzamientos_7m.router, prefix="/tipos_lanzamientos_7m")
app.include_router(tipos_lazamientos.router, prefix="/tipos_lanzamientos")
app.include_router(posiciones.router, prefix="/posiciones")