# app/services/auth.py
import bcrypt
import jwt
from jwt import PyJWTError as JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from app.config import SECRET_KEY, ALGORITHM, EXPIRATION_MINUTES

def verificar_password(hashed_password: str, plain_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def generar_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES)
    payload = {
        "sub": email,  
        "exp": expire
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def obtener_email_desde_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodifica el token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # ⚡ Asegúrate de que el email esté en "sub"
        if email is None:
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception
