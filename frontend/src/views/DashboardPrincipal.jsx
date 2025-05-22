import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Icon,
  Button,
  Grid,
  Divider,
  useDisclosure,
  Avatar,
} from "@chakra-ui/react";
import { FaBars, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

// Función para decodificar el token JWT y extraer el id del club
function getClubIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.club_id || payload.club || payload.id || null;
  } catch {
    return null;
  }
}

const DashboardPrincipal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });
  const [equipo, setEquipo] = useState({ nombre: "", logo: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://myhandstats.onrender.com/usuario/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.info.nombre);
      })
      .catch(() => setUserName("Usuario"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const clubId = getClubIdFromToken(token);

    if (!clubId) {
      setClub({ nombre: "Club no encontrado", logo: "" });
      return;
    }

    fetch("https://myhandstats.onrender.com/club", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let clubData = null;
        if (Array.isArray(data.info)) {
          clubData = data.find((c) => c.id == clubId);
        } else {
          clubData = data;
        }
        if (clubData) {
          setClub({
            nombre: clubData.nombre,
            logo: clubData.logo,
          });
        } else {
          setClub({ nombre: "Club no encontrado", logo: "" });
        }
      })
      .catch(() =>
        setClub({ nombre: "Club ejemplo", logo: "" })
      );
  }, []);

  useEffect(() => {
    const equipoId = localStorage.getItem("id_equipo");
    if (!equipoId) {
      setEquipo({ nombre: "Equipo no encontrado", logo: "" });
      return;
    }

    fetch(`https://myhandstats.onrender.com/equipo/${equipoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEquipo({
            nombre: data.nombre,
          });
        } else {
          setEquipo({ nombre: "Equipo no encontrado", logo: "" });
        }
      })
      .catch(() =>
        setEquipo({ nombre: "Equipo ejemplo", logo: "" })
      );
  }, []);

  const golesData = {
    labels: ["Goles a favor", "Goles en contra"],
    datasets: [
      {
        data: [12, 8], // Reemplaza con tus datos reales
        backgroundColor: ["#014C4C", "#e2e8f0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box p={4} minH="100vh" bg="white">
      {/* Sidebar desplegable */}
      <Sidebar isOpen={isOpen} onClose={onClose} />

      {/* Header con título y hamburguesa */}
      <Flex align="center" justify="space-between" mb={8}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Flex align="center" gap={3}>
          <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={0}>
            Dashboard
          </Text>
          <Avatar name={club.nombre} src={club.logo} />
          <Text fontSize="sm" color="gray.500">
            {equipo.nombre}
          </Text>
        </Flex>

        {/* Avatar de usuario */}
        <Flex align="center" gap={2}>
          <Text fontSize="sm" color="#014C4C">
            {userName}
          </Text>
          <Avatar
            name={userName}
            src="https://rdpazmfdbcundrogccsb.supabase.co/storage/v1/object/sign/imagenes/perfil.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwNmYzZWZkLTg5ZDktNGI0YS1hZjMwLTdjYzQyY2Q0MjcyMCJ9.eyJ1cmwiOiJpbWFnZW5lcy9wZXJmaWwuanBnIiwiaWF0IjoxNzQ3Njc1NjIyLCJleHAiOjE3NzkyMTE2MjJ9.paxIryVGuoxiwBFFusk7ZS4aONm1S4S06XYEuk3D2bI"
          />
        </Flex>
      </Flex>

      {/* Grid principal */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {/* Goles últimos partidos */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Goles últimos partidos</Text>
            <Button size="sm" variant="outline">
              View Report
            </Button>
          </Flex>
          <Box h="200px" w="200px" mx="auto">
            <Doughnut data={golesData} />
          </Box>
          <Divider my={4} />
          <Flex gap={4} justify="center">
            <Box h={2} w={2} borderRadius="full" bg="#014C4C" />
            <Text fontSize="xs">Goles a favor</Text>
            <Box h={2} w={2} borderRadius="full" bg="gray.300" />
            <Text fontSize="xs">Goles en contra</Text>
          </Flex>
        </Box>

        {/* Fases del Juego */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Fases del Juego últimos partidos</Text>
            <Button size="sm" variant="ghost" isDisabled>
              View Report
            </Button>
          </Flex>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Lanzamientos 7m */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold">Lanzamientos 7m</Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Los máximos lanzadores de 7 metros del equipo
          </Text>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Goleadores */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold">Goleadores</Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Los máximos goleadores del equipo
          </Text>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Orden */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Order</Text>
            <Button size="sm" variant="outline">
              View Report
            </Button>
          </Flex>
          <Flex align="center" gap={2} color="red.500" fontSize="sm" mb={2}>
            <Icon as={FaArrowDown} />
            <Text>0%</Text>
          </Flex>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardPrincipal;
