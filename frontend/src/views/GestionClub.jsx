import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Stack,
  useDisclosure,
  Spinner,
  Center,
  useColorModeValue,
  Image
} from "@chakra-ui/react";
import { FaUsers, FaUsersCog, FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import Sidebar from '../components/Sidebar';
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header"; // <-- Añade el import

const ClubAdminPanel = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  // Para el header
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });

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

    // Cargar datos para el header
    if (storedToken) {
      fetch("https://myhandstats.onrender.com/usuario/perfil", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => setUserName(data.info?.nombre || "Administrador"));

      fetch("https://myhandstats.onrender.com/club", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          let clubId = null;
          try {
            const payload = JSON.parse(atob(storedToken.split(".")[1]));
            clubId = payload.club_id || payload.club || payload.id || null;
          } catch {
            clubId = null;
          }
          let clubObj = null;
          if (Array.isArray(data.info)) {
            clubObj = data.info.find((c) => c.id == clubId);
          } else {
            clubObj = data;
          }
          setClub({
            nombre: clubObj?.nombre || "Club no encontrado",
            logo: clubObj?.logo || "",
          });
        });
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
        <Image
          src="/myHandstatsLogo.png"
          alt="Logo MyHandStats"
          position="fixed"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          opacity={0.12}
          zIndex={0}
          boxSize={["250px", "350px", "450px"]}
          pointerEvents="none"
          userSelect="none"
        />
        <Header
          onOpen={onOpen}
          userName={userName}
          club={club}
          texto="Panel de Administración del Club"
        />
        <Sidebar isOpen={isOpen} onClose={onClose} />

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
