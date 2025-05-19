from fastapi import APIRouter, HTTPException, Depends
from app.models.usuario import UsuarioUpdate, UsuarioOut
from app.supabase_client import supabase
from app.services.auth import obtener_info_desde_token
from app.utils.hashing import hash_password

router = APIRouter()


@router.put("/{id}", response_model=UsuarioOut)
def actualizar_usuario(id: int, usuario: UsuarioUpdate, datos_token: dict = Depends(obtener_info_desde_token)):
    # Verificaciones de autorización
    if datos_token["rol"] == "admin":
        # Puede editar cualquier usuario de su club
        usuario_a_editar = supabase.table("usuarios").select("clubs_id").eq("id", id).execute()
        if not usuario_a_editar.data or usuario_a_editar.data[0]["clubs_id"] != datos_token["clubs_id"]:
            raise HTTPException(status_code=403, detail="No puedes editar usuarios de otro club")
    elif datos_token["user_id"] != id:
        raise HTTPException(status_code=403, detail="No puedes editar otros usuarios")

    # Actualizar
    data = usuario.dict(exclude_unset=True)
    if "password" in data:
        data["password"] = hash_password(data["password"])

    response = supabase.table("usuarios").update(data).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    updated_user = response.data[0]
    updated_user.pop("password", None)
    return updated_user


# @router.delete("/{id}")
# def eliminar_usuario(id: int):
#     response = supabase.table("usuarios").delete().eq("id", id).execute()

#     # Si la respuesta tiene data vacía, es que no se encontró el usuario
#     if not response.data:
#         raise HTTPException(status_code=404, detail="Usuario no encontrado")

#     return {"message": "Usuario eliminado correctamente"}


@router.get("/perfil", tags=["Usuarios"])
def obtener_perfil(info: str = Depends(obtener_info_desde_token)):
    return {"info": info}

