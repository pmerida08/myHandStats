/**
 * AuthWrapper
 * 
 * Componente de alto nivel que protege rutas/componentes verificando si el usuario está autenticado
 * y, opcionalmente, si tiene el rol requerido.
 * 
 * Props:
 * - children: Elementos hijos a renderizar si el usuario está autorizado.
 * - requiredRole: (opcional) Rol necesario para acceder al contenido.
 * 
 * Funcionamiento:
 * - Comprueba si existe un token JWT en localStorage.
 * - Si no hay token o el token es inválido, redirige al login.
 * - Si se especifica un rol y el usuario no lo tiene, también redirige al login.
 * - Mientras verifica la autorización, muestra un spinner de carga.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Center } from "@chakra-ui/react";

const AuthWrapper = ({ children, requiredRole = null }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null); // null = en proceso

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthorized(false); // No hay token, no autorizado
      return;
    }

    try {
      // Decodifica el payload del JWT
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Si se requiere un rol y el usuario no lo tiene, no autorizado
      if (requiredRole && payload.rol !== requiredRole) {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true); // Usuario autorizado
    } catch (error) {
      console.error("Token inválido:", error);
      setIsAuthorized(false); // Token malformado
    }
  }, [requiredRole]);

  useEffect(() => {
    if (isAuthorized === false) {
      // Redirige tras un pequeño retardo para evitar conflictos de navegación
      setTimeout(() => {
        navigate("/login");
      }, 100);
    }
  }, [isAuthorized, navigate]);

  // Mientras se verifica la autorización, muestra un spinner
  if (isAuthorized === null) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Si no está autorizado, no renderiza nada (se redirige)
  if (!isAuthorized) {
    return null;
  }

  // Si está autorizado, renderiza los hijos
  return children;
};

export default AuthWrapper;
