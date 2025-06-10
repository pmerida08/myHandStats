from fastapi import APIRouter, HTTPException, Depends
from app.services.auth import obtener_info_desde_token
from typing import List
from app.models.usuario import UsuarioOut, UsuarioUpdate, CrearUsuarioAdminDTO
from app.models.equipo import EquipoOut, EquipoCreate
from app.models.entrenador import EntrenadorOut
from app.utils.hashing import hash_password
from app.models.club import ClubUpdate, ClubOut
from app.supabase_client import supabase
from app.utils.email import enviar_correo_establecer_contraseña
from jose import jwt
from datetime import datetime, timedelta, timezone
import secrets
import string
import os
from dotenv import load_dotenv

# Importar el cliente de Supabase
router = APIRouter()

# Cargar las variables de entorno
load_dotenv()

# Asignar las variables de entorno a constantes
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

# Endpoint para obtener la información del club al que pertenece el usuario por el token JWT
@router.get("/", response_model=ClubOut)
def obtener_info_club(datos_token: dict = Depends(obtener_info_desde_token)):
    club_id = datos_token["clubs_id"]
    response = supabase.table("clubes").select("*").eq("id", club_id).execute()

    return response.data[0]        

# Endpoint para obtener los usuarios del club al que pertenece el usuario por el token JWT, solo si es administrador
@router.get("/usuarios/", response_model=List[UsuarioOut])
def obtener_usuarios_club(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los usuarios del club")

    response = supabase.table("usuarios").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los usuarios: {response.error.message}")

    return response.data

# Endpoint para obtener los equipos del club al que pertenece el usuario por el token JWT
@router.get("/equipos/", response_model=List[EquipoOut])
def obtener_equipos_club(datos_token: dict = Depends(obtener_info_desde_token)):
  
    response = supabase.table("equipos").select("*").eq("clubs_id", datos_token["clubs_id"]).execute()

    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los equipos: {response.error.message}")

    return response.data

# Endpoint para obtener los entrenadores del club al que pertenece el usuario por el token JWT, solo si es administrador
@router.get("/entrenadores/", response_model=List[EntrenadorOut])
def obtener_entrenadores_club(datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los entrenadores del club")

    # Obtener IDs de entrenadores asociados al club desde la tabla de relación
    rel_response = supabase.table("club_entrenador").select("entrenador_id").eq("club_id", datos_token["clubs_id"]).execute()
    if getattr(rel_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener la relación clubes-entrenadores: {rel_response.error.message}")

    # Si no hay entrenadores asociados, retornar una lista vacía
    entrenador_ids = [rel["entrenador_id"] for rel in rel_response.data]
    if not entrenador_ids:
        return []

    # Obtener los datos de los entrenadores usando los IDs obtenidos
    entrenadores_response = supabase.table("entrenadores").select("*").in_("id", entrenador_ids).execute()
    if getattr(entrenadores_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener los entrenadores: {entrenadores_response.error.message}")

    return entrenadores_response.data

# Endpoint para obtener un entrenador específico por su ID, solo si es administrador
@router.get("/entrenador/{entrenador_id}", response_model=EntrenadorOut)
def obtener_entrenador_por_id(entrenador_id: int, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden ver los entrenadores del club")

    # Comprobar si el entrenador pertenece al club
    response = supabase.table("club_entrenador").select("entrenador_id").eq("club_id", datos_token["clubs_id"]).eq("entrenador_id", entrenador_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado o no pertenece al club")

    # Obtener los datos del entrenador
    entrenador_response = supabase.table("entrenadores").select("*").eq("id", entrenador_id).execute()
    if getattr(entrenador_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al obtener el entrenador: {entrenador_response.error.message}")

    return entrenador_response.data[0]

# Endpoint para crear un nuevo club, solo si es administrador
@router.post("/nuevo_equipo/", response_model=EquipoOut)
def crear_nuevo_equipo_club(equipo: EquipoCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden registrar nuevos equipos")

    # Forzamos el club_id del equipo al club del token
    data = equipo.dict()
    data["clubs_id"] = datos_token["clubs_id"]

    response = supabase.table("equipos").insert(data).execute()
    if getattr (response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el equipo: {response.error.message}")

    return response.data[0]

# @router.post("/usuario/register", response_model=UsuarioOut)
# def registrar_nuevo_usuario_club(usuario: UsuarioCreate, datos_token: dict = Depends(obtener_info_desde_token)):
#     if datos_token["rol"] != "admin":
#         raise HTTPException(status_code=403, detail="Solo administradores pueden registrar nuevos usuarios")

    
#     data = usuario.dict()
#     data["clubs_id"] = datos_token["clubs_id"]
#     data["password"] = hash_password(data["password"])

#     response = supabase.table("usuarios").insert(data).execute()

#     nuevo_usuario = response.data[0]
#     nuevo_usuario.pop("password", None)

#     if getattr(response, "error", None):
#         raise HTTPException(status_code=400, detail=f"Error al crear el usuario: {response.error.message}")
    
    
#     if usuario.rol == "entrenador":
#         # Guardar relación en club_entrenador si el rol es entrenador
#         entrenador_data = {
#             "nombre": nuevo_usuario["nombre"],
#             "email": nuevo_usuario["email"],
#             "usuario_id": nuevo_usuario["id"],

#         }
#         entrenador_response = supabase.table("entrenadores").insert(entrenador_data).execute()
#         if getattr(entrenador_response, "error", None):
#             raise HTTPException(status_code=400, detail=f"Error al crear el entrenador: {entrenador_response.error.message}")
       
#         # Guardar relación en club_entrenador
#         relacion = {
#             "club_id": datos_token["clubs_id"],
#             "entrenador_id": entrenador_response.data[0]["id"]
#         }
#         rel_response = supabase.table("club_entrenador").insert(relacion).execute()
#         if getattr(rel_response, "error", None):
#             raise HTTPException(status_code=400, detail=f"Error al guardar la relación club-entrenador: {rel_response.error.message}")
        

#     return nuevo_usuario


# Endpoint para crear un nuevo usuario, solo si es administrador
@router.post("/crear-por-admin")
def crear_usuario_por_admin(dto: CrearUsuarioAdminDTO, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden crear usuarios")

    # Verificar que el email no esté registrado
    existe = supabase.table("usuarios").select("id").eq("email", dto.email).execute()
    if existe.data and len(existe.data) > 0:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # Asigna una contraseña temporal (por ejemplo, una cadena aleatoria o vacía hasheada)
    longitud = 12
    caracteres = string.ascii_letters + string.digits
    contraseña_aleatoria = ''.join(secrets.choice(caracteres) for _ in range(longitud))
    password_temporal = hash_password(contraseña_aleatoria)

    # Crear el usuario con el rol y club_id del token
    data = {
        "nombre": dto.nombre,
        "email": dto.email,
        "rol": dto.rol,
        "clubs_id": datos_token["clubs_id"],
        "password": password_temporal
    }
    
    response = supabase.table("usuarios").insert(data).execute()
    if getattr(response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al crear el usuario: {response.error.message}")

    nuevo_usuario = response.data[0]

    # Si el rol es entrenador, crea la relación en entrenadores y club_entrenador
    if dto.rol == "entrenador":
        entrenador_data = {
            "nombre": nuevo_usuario["nombre"],
            "email": nuevo_usuario["email"],
            "usuario_id": nuevo_usuario["id"],
        }
        
        entrenador_response = supabase.table("entrenadores").insert(entrenador_data).execute()
        if getattr(entrenador_response, "error", None):
            raise HTTPException(status_code=400, detail=f"Error al crear el entrenador: {entrenador_response.error.message}")

        relacion = {
            "club_id": datos_token["clubs_id"],
            "entrenador_id": entrenador_response.data[0]["id"]
        }
        
        rel_response = supabase.table("club_entrenador").insert(relacion).execute()
        if getattr(rel_response, "error", None):
            raise HTTPException(status_code=400, detail=f"Error al guardar la relación club-entrenador: {rel_response.error.message}")

    # GENERAR TOKEN Y ENVIAR CORREO
    # El token expira en 1 hora
    ahora = datetime.now(timezone.utc)
    expiracion = ahora + timedelta(hours=1)
    token_data = {
        "sub": str(nuevo_usuario["id"]),
        "tipo": "establecer_contrasena",
        "exp": int(expiracion.timestamp())
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    enviar_correo_establecer_contraseña(nuevo_usuario["email"], token)

    return {"mensaje": "Usuario creado correctamente"}

# Endpoint para actualizar la información del club, solo si es administrador
@router.put("/")
def actualizar_club(club_data: ClubUpdate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden actualizar el club")

    # Actualizar el club con el id_club del token
    data = club_data.dict(exclude_unset=True)
    response = supabase.table("clubes").update(data).eq("id", datos_token["clubs_id"]).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Club no encontrado")

    return response.data[0]

# Endpoint para actualizar un equipo, solo si es administrador 
@router.put("/equipo/{equipo_id}")
def actualizar_equipo(equipo_id: int, equipo_data: EquipoCreate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden actualizar el equipo")

    # Actualizar el equipo con el id_club del token
    data = equipo_data.dict(exclude_unset=True)
    response = supabase.table("equipos").update(data).eq("id", equipo_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")

    return response.data[0]

# Endpoint para actualizar un usuario, solo si es administrador
@router.put("/usuario/{usuario_id}")
def actualizar_usuario(usuario_id: int, usuario_data: UsuarioUpdate, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden actualizar el usuario")
    
    data = usuario_data.dict(exclude_unset=True)
    response = supabase.table("usuarios").update(data).eq("id", usuario_id).execute()

    # Obtener el usuario actualizado para comparar el rol anterior y el nuevo
    usuario_actual = supabase.table("usuarios").select("rol").eq("id", usuario_id).execute()
    if not usuario_actual.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Obtener el rol actual y el nuevo rol
    rol_actual = usuario_actual.data[0]["rol"]
    # Si el rol no se ha actualizado, mantener el rol actual
    rol_nuevo = usuario_data.rol if "rol" in usuario_data.dict(exclude_unset=True) else rol_actual

    # Si el rol cambia de "entrenador" a otro, eliminar de entrenadores, club_entrenador y equipo_entrenador
    if rol_actual == "entrenador" and rol_nuevo != "entrenador":
        # Buscar el entrenador relacionado
        entrenador = supabase.table("entrenadores").select("id").eq("usuario_id", usuario_id).execute()
        if entrenador.data:
            entrenador_id = entrenador.data[0]["id"]
            # Eliminar relación en club_entrenador
            supabase.table("club_entrenador").delete().eq("entrenador_id", entrenador_id).execute()
            # Eliminar relación en equipo_entrenador
            supabase.table("equipo_entrenador").delete().eq("entrenador_id", entrenador_id).execute()
            # Eliminar de entrenadores
            supabase.table("entrenadores").delete().eq("id", entrenador_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return response.data[0]

# Endpoint para eliminar un usuario, solo si es administrador
@router.delete("/usuario/{usuario_id}")
def eliminar_usuario(usuario_id: int, datos_token: dict = Depends(obtener_info_desde_token)):
    if datos_token["rol"] != "admin":
        raise HTTPException(status_code=403, detail="Solo los administradores pueden eliminar usuarios")

    # Verificar si el usuario existe
    response = supabase.table("usuarios").select("*").eq("id", usuario_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario = response.data[0] 

    # Eliminar cualquier relación en entrenadores, club_entrenador y equipo_entrenador
    entrenador = supabase.table("entrenadores").select("id").eq("usuario_id", usuario_id).execute()
    if entrenador.data:
        for ent in entrenador.data:
            entrenador_id = ent["id"]
            # Eliminar relación en club_entrenador
            supabase.table("club_entrenador").delete().eq("entrenador_id", entrenador_id).execute()
            # Eliminar relación en equipo_entrenador
            supabase.table("equipo_entrenador").delete().eq("entrenador_id", entrenador_id).execute()
            # Eliminar de entrenadores
            supabase.table("entrenadores").delete().eq("id", entrenador_id).execute()

    # Eliminar el usuario
    delete_response = supabase.table("usuarios").delete().eq("id", usuario_id).execute()

    if getattr(delete_response, "error", None):
        raise HTTPException(status_code=400, detail=f"Error al eliminar el usuario: {delete_response.error.message}")

    return {"mensaje": "Usuario eliminado correctamente"}