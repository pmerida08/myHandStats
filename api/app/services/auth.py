# app/services/auth.py
import bcrypt
import jwt
from jwt import PyJWTError as JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from app.config import SECRET_KEY, ALGORITHM, EXPIRATION_MINUTES
from app.supabase_client import supabase
from app.utils.hashing import pwd_context  


def verificar_password(hashed_password: str, plain_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def generar_token(email: str, user_id: int, clubs_id: int, rol: str):
    expire = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    payload = {
        "sub": email,  
        "id": user_id,
        "clubs_id": clubs_id,
        "rol": rol,
        "exp": expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def obtener_info_desde_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodifica el token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # Asegúrate de que el email esté en "sub"
        user_id: int = payload.get("id")
        clubs_id: int = payload.get("clubs_id")
        rol: str = payload.get("rol")

        if email is None:
            raise credentials_exception
        return {
            "email": email,
            "user_id": user_id,
            "clubs_id": clubs_id,
            "rol": rol
        }
    except JWTError:
        raise credentials_exception

def autenticar_usuario(email: str, password: str):
    response = supabase.table("usuarios").select("*").eq("email", email).single().execute()

    # Verificar si la respuesta contiene datos
    if not response.data:
        return None

    usuario = response.data  # Acceder a los datos directamente

    # Verificar si la contraseña es correcta
    if not pwd_context.verify(password, usuario["password"]):
        return None

    return usuario