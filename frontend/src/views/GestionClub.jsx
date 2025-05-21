import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Heading, Text, Button, Stack, Icon, Flex, useDisclosure, Spinner, Center
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import Sidebar from '../components/Sidebar';

const ClubAdminPanel = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
        if (decodedToken.rol !== "admin") {
          navigate("/dashboard");
        } else {
          setToken(decodedToken);
        }
      } catch (error) {
        console.error("Error al decodificar el token", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!token) return null;

  return (
    <Box p={6}>
      <Sidebar isOpen={isOpen} onClose={onClose} />

      <Flex align="center" justify="space-between" mb={6}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Heading size="lg">Panel de Administración del Club</Heading>
        <Box w="6" />
      </Flex>

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
