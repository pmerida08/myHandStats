import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Icon,
  Flex,
  useDisclosure,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBars, FaUsers, FaUsersCog, FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import Sidebar from '../components/Sidebar';
import AuthWrapper from "../components/AuthWrapper";

const ClubAdminPanel = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800"); // Cambiado a blanco para fondo claro
  const cardBg = useColorModeValue("white", "gray.700");

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
    <AuthWrapper requiredRole={null}>
      <Box minH="100vh" bg={bg} p={{ base: 2, md: 8 }} position="relative">
        <Sidebar isOpen={isOpen} onClose={onClose} />

        <Flex align="center" justify="space-between" mb={8}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Heading
            size="lg"
            color="#014C4C"
            textAlign="center"
            fontWeight="bold"
            letterSpacing="wide"
          >
            Panel de Administración del Club
          </Heading>
          <Box w="6" />
        </Flex>

        <Box
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="lg"
          maxW="500px"
          mx="auto"
          p={{ base: 6, md: 10 }}
        >
          <Text mb={8} fontSize="lg" color="gray.600" textAlign="center">
            Bienvenido, <b>administrador</b>. Aquí puedes gestionar tu club.
          </Text>

          <Stack spacing={6}>
            <Button
              leftIcon={<FaUsers />}
              colorScheme="blue"
              variant="solid"
              size="lg"
              borderRadius="lg"
              onClick={() => navigate("/club/usuarios")}
              boxShadow="md"
              _hover={{ bg: "#2563eb" }}
            >
              Gestionar Usuarios
            </Button>
            <Button
              leftIcon={<FaUsersCog />}
              colorScheme="green"
              variant="solid"
              size="lg"
              borderRadius="lg"
              onClick={() => navigate("/club/equipos")}
              boxShadow="md"
              _hover={{ bg: "#059669" }}
            >
              Gestionar Equipos
            </Button>
            <Button
              leftIcon={<FaChalkboardTeacher />}
              colorScheme="purple"
              variant="solid"
              size="lg"
              borderRadius="lg"
              onClick={() => navigate("/club/entrenadores")}
              boxShadow="md"
              _hover={{ bg: "#7c3aed" }}
            >
              Gestionar Entrenadores
            </Button>
            <Button
              leftIcon={<FaInfoCircle />}
              colorScheme="orange"
              variant="solid"
              size="lg"
              borderRadius="lg"
              onClick={() => navigate("/club/info")}
              boxShadow="md"
              _hover={{ bg: "#ea580c" }}
            >
              Editar Información del Club
            </Button>
          </Stack>
        </Box>
      </Box>
    </AuthWrapper>
  );
};

export default ClubAdminPanel;
