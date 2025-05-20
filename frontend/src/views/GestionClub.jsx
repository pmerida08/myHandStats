import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";

// Simulación: reemplaza esto con tu contexto real de autenticación
const useAuth = () => {
  return {
    token: {
      rol: "admin", // o "user", para probar redirección
      clubs_id: 1,
    },
  };
};

const ClubAdminPanel = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token.rol !== "admin") {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <Box p={6}>
      <Heading mb={4}>Panel de Administración del Club</Heading>
      <Text mb={6}>Bienvenido, administrador. Aquí puedes gestionar tu club.</Text>

      <Stack spacing={4}>
        <Button colorScheme="blue" onClick={() => navigate("/admin/usuarios")}>
          Gestionar Usuarios
        </Button>
        <Button colorScheme="green" onClick={() => navigate("/admin/equipos")}>
          Gestionar Equipos
        </Button>
        <Button colorScheme="purple" onClick={() => navigate("/admin/entrenadores")}>
          Gestionar Entrenadores
        </Button>
        <Button colorScheme="orange" onClick={() => navigate("/admin/club")}>
          Editar Información del Club
        </Button>
      </Stack>
    </Box>
  );
};

export default ClubAdminPanel;
