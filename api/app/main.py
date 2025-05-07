# app/main.py
from fastapi import FastAPI
from app.routes import usuarios, jugadores, equipos, partidos, posiciones, fases_juego, acciones_partidos, clubes

app = FastAPI()

app.include_router(usuarios.router, prefix="/usuarios")
app.include_router(clubes.router, prefix="/clubes")
app.include_router(jugadores.router, prefix="/jugadores")
app.include_router(equipos.router, prefix="/equipos")
app.include_router(partidos.router, prefix="/partidos")
app.include_router(posiciones.router, prefix="/posiciones")
app.include_router(fases_juego.router, prefix="/fases_juego")
app.include_router(acciones_partidos.router, prefix="/acciones_partidos")