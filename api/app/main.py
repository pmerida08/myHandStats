# app/main.py
from fastapi import FastAPI

from app.routes import login, register, usuarios, jugadores, equipos, partidos, posiciones, fases_juego, acciones_partidos, clubes, clubes_entradores, entrenadores, equipos_entrenadores, jugadores_partidos, jugadores_posiciones, acciones_fases, acciones
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router, prefix="/login")
app.include_router(register.router, prefix="/register")
app.include_router(usuarios.router, prefix="/usuario")
app.include_router(clubes.router, prefix="/club")
app.include_router(equipos.router, prefix="/equipo")
app.include_router(jugadores.router, prefix="/jugador")
app.include_router(jugadores_posiciones.router, prefix="/jugadores_posiciones")
app.include_router(partidos.router, prefix="/partidos")
app.include_router(posiciones.router, prefix="/posiciones")
app.include_router(fases_juego.router, prefix="/fases_juego")
app.include_router(jugadores_partidos.router, prefix="/jugadores_partidos")
app.include_router(acciones_partidos.router, prefix="/acciones_partidos")
app.include_router(clubes_entradores.router, prefix="/clubes_entradores")
app.include_router(acciones_fases.router, prefix="/accion_fases")
app.include_router(entrenadores.router, prefix="/entrenadores")
app.include_router(equipos_entrenadores.router, prefix="/equipos_entrenadores")
app.include_router(acciones.router, prefix="/acciones")
