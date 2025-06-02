import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import {
  Box,
  Flex,
  Text,
  useDisclosure,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Icon,
  Spinner,
  Divider,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";

const ResumenPartido = () => {
  const { partido_id } = useParams();
  const equipo_id = localStorage.getItem("id_equipo");
  const token = localStorage.getItem("token");

  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabSeleccionado, setTabSeleccionado] = useState("Resumen");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  // FETCH DATOS DEL PARTIDO
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del partido");
        }
        return response.json();
      })
      .then((data) => {
        setPartido(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del partido:", error);
      })
      .finally(() => setLoading(false));
  }, [equipo_id, partido_id]);

  // Valores por defecto si aún no hay datos
  const datosPartido = partido ?? {
    fecha: "2025-05-20T00:00:00",
    goles_id_equipo: 0,
    goles_id_equiporival: 0,
    equiporival_id: "Rival",
    lanzamientos_equipo: 0,
    lanzamientos_rival: 0,
    perdidas_equipo: 0,
    perdidas_rival: 0,
    eficacia_ataque_equipo: 0,
    eficacia_ataque_rival: 0,
    goleadores: [],
    timeline: [],
    jugadores: [],
    tiros: [],
  };

  const fechaFormateada = new Date(datosPartido.fecha).toLocaleDateString("es-ES");

  // Ejemplo de tabs activos (puedes implementar navegación real si lo necesitas)
  const tabs = [
    { label: "Resumen", activo: true },
    { label: "Goleadores", activo: false },
    { label: "Timeline", activo: false },
    { label: "Jugadores", activo: false },
    { label: "Tiros", activo: false },
  ];

  // Ejemplo de datos de goleadores (puedes adaptar según tu API)
  const goleadores = datosPartido.goleadores?.length
    ? datosPartido.goleadores
    : [
        { nombre: "Jugador 1", goles: 5 },
        { nombre: "Jugador 2", goles: 3 },
      ];

  // Ejemplo de timeline
  const timeline = datosPartido.timeline?.length
    ? datosPartido.timeline
    : [
        { minuto: 5, evento: "Gol", jugador: "Jugador 1", equipo: "Tú Equipo" },
        { minuto: 10, evento: "Gol", jugador: "Rival 1", equipo: "Rival" },
      ];

  // Ejemplo de jugadores
  const jugadores = datosPartido.jugadores?.length
    ? datosPartido.jugadores
    : [
        { nombre: "Jugador 1", dorsal: 7, goles: 5 },
        { nombre: "Jugador 2", dorsal: 10, goles: 3 },
      ];

  // Ejemplo de tiros
  const tiros = datosPartido.tiros?.length
    ? datosPartido.tiros
    : [
        { zona: "LD", goles: 3, lanzamientos: 5 },
        { zona: "LI", goles: 2, lanzamientos: 4 },
      ];

  // Cálculo de eficacia en ataque
  const eficaciaEquipo = datosPartido.eficacia_ataque_equipo || Math.round((datosPartido.goles_id_equipo / (datosPartido.lanzamientos_equipo || 1)) * 100);
  const eficaciaRival = datosPartido.eficacia_ataque_rival || Math.round((datosPartido.goles_id_equiporival / (datosPartido.lanzamientos_rival || 1)) * 100);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bg}>
        <Spinner size="xl" color="teal.600" />
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg={bg}>
      <Box flex="1" bg="white" p={{ base: 2, md: 8 }}>
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Flex align="center" justify="space-between" mb={6}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Text fontSize="2xl" fontWeight="bold" color="#014C4C">
            Resumen del Partido
          </Text>
          <Box w="6" />
        </Flex>

        {/* Encabezado */}
        <Box textAlign="center" mb={6}>
          <Text fontSize="xl" fontWeight="bold" color="#014C4C">Estadísticas del Partido</Text>
          <Text color="gray.600">Liga</Text>
          <Text fontSize="sm" color="gray.500">Jornada 1 - {fechaFormateada}</Text>
        </Box>

        {/* Marcador */}
        <Flex justify="center" align="center" mb={6} gap={8}>
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.600">Tú Equipo</Text>
            <Box bg="teal.600" color="white" px={4} py={2} rounded="md" fontWeight="bold" fontSize="2xl">
              {datosPartido.goles_id_equipo}
            </Box>
          </Box>
          <Text fontWeight="bold" fontSize="lg">vs</Text>
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.600">{datosPartido.equiporival_id}</Text>
            <Box bg="red.400" color="white" px={4} py={2} rounded="md" fontWeight="bold" fontSize="2xl">
              {datosPartido.goles_id_equiporival}
            </Box>
          </Box>
        </Flex>

        {/* Tabs */}
        <Flex justify="center" mb={6} gap={6}>
          {tabs.map(tab => (
            <Text
              key={tab.label}
              fontWeight="bold"
              color={tab.activo ? "#014C4C" : "gray.400"}
              fontSize="md"
              borderBottom={tab.activo ? "2px solid #014C4C" : "none"}
              px={2}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ color: "#014C4C" }}
            >
              {tab.label}
            </Text>
          ))}
        </Flex>

        {/* Lanzamientos */}
        <Box mb={4}>
          <Text textAlign="center" fontSize="sm" mb={2}>
            {datosPartido.lanzamientos_equipo ?? 20}/{datosPartido.lanzamientos_equipo ?? 40} - Lanzamientos - {datosPartido.lanzamientos_rival ?? 30}/{datosPartido.lanzamientos_rival ?? 40}
          </Text>
          <Flex h="10px" bg="#f0f0f0" overflow="hidden" borderRadius="md">
            <Box w={`${((datosPartido.lanzamientos_equipo / ((datosPartido.lanzamientos_equipo || 1) + (datosPartido.lanzamientos_rival || 1))) * 100 || 50)}%`} bg="teal.500" />
            <Box w={`${((datosPartido.lanzamientos_rival / ((datosPartido.lanzamientos_equipo || 1) + (datosPartido.lanzamientos_rival || 1))) * 100 || 50)}%`} bg="red.300" />
          </Flex>
        </Box>

        {/* Pérdidas */}
        <Box mb={6}>
          <Text textAlign="center" fontSize="sm" mb={2}>
            {datosPartido.perdidas_equipo ?? 8} - Pérdidas - {datosPartido.perdidas_rival ?? 3}
          </Text>
          <Flex h="10px" bg="#f0f0f0" overflow="hidden" borderRadius="md">
            <Box w={`${((datosPartido.perdidas_equipo / ((datosPartido.perdidas_equipo || 1) + (datosPartido.perdidas_rival || 1))) * 100 || 50)}%`} bg="teal.500" />
            <Box w={`${((datosPartido.perdidas_rival / ((datosPartido.perdidas_equipo || 1) + (datosPartido.perdidas_rival || 1))) * 100 || 50)}%`} bg="red.300" />
          </Flex>
        </Box>

        {/* Eficacia en ataque */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} maxW="400px" mx="auto" mb={8}>
          <Box textAlign="center">
            <CircularProgress value={eficaciaEquipo} size="90px" thickness="10px" color="teal.500">
              <CircularProgressLabel fontSize="lg">{eficaciaEquipo}%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} fontSize="md" color="#014C4C">Eficacia en Ataque</Text>
            <Badge colorScheme="teal" mt={1}>Tu equipo</Badge>
          </Box>
          <Box textAlign="center">
            <CircularProgress value={eficaciaRival} size="90px" thickness="10px" color="red.400">
              <CircularProgressLabel fontSize="lg">{eficaciaRival}%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} fontSize="md" color="#014C4C">Eficacia en Ataque</Text>
            <Badge colorScheme="red" mt={1}>Rival</Badge>
          </Box>
        </SimpleGrid>

        <Divider mb={8} />

        {/* Goleadores */}
        <Box mb={8}>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="#014C4C">Goleadores</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {goleadores.map((g, idx) => (
              <Flex key={idx} align="center" justify="space-between" bg="#e0f7f7" p={3} borderRadius="md">
                <Text fontWeight="medium">{g.nombre}</Text>
                <Badge colorScheme="teal">{g.goles} goles</Badge>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Timeline */}
        <Box mb={8}>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="#014C4C">Timeline</Text>
          <Box bg="#f9fafb" borderRadius="md" p={4}>
            {timeline.map((t, idx) => (
              <Flex key={idx} align="center" mb={2}>
                <Badge colorScheme={t.equipo === "Tú Equipo" ? "teal" : "red"} mr={2}>{t.minuto}'</Badge>
                <Text fontWeight="medium" mr={2}>{t.evento}</Text>
                <Text color="gray.600">{t.jugador} ({t.equipo})</Text>
              </Flex>
            ))}
          </Box>
        </Box>

        {/* Jugadores */}
        <Box mb={8}>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="#014C4C">Jugadores destacados</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {jugadores.map((j, idx) => (
              <Flex key={idx} align="center" justify="space-between" bg="#f0f0f0" p={3} borderRadius="md">
                <Text fontWeight="medium">{j.nombre} <Badge colorScheme="gray" ml={2}>#{j.dorsal}</Badge></Text>
                <Badge colorScheme="teal">{j.goles} goles</Badge>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Tiros por zona */}
        <Box mb={8}>
          <Text fontWeight="bold" fontSize="lg" mb={4} color="#014C4C">Tiros por zona</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {tiros.map((t, idx) => (
              <Flex key={idx} align="center" justify="space-between" bg="#f9fafb" p={3} borderRadius="md">
                <Text fontWeight="medium">Zona {t.zona}</Text>
                <Text color="gray.600">{t.goles} goles / {t.lanzamientos} lanzamientos</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
};

export default ResumenPartido;
