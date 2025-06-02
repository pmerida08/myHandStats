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
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";

const ResumenPartido = () => {
  const { partido_id } = useParams();
  const equipo_id = localStorage.getItem("id_equipo");
  const token = localStorage.getItem("token");

  const [partido, setPartido] = useState(null);
  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabSeleccionado, setTabSeleccionado] = useState("Resumen");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Acciones relevantes por tipo
  const accionesGol = [23]; // ejemplo: 23 = Gol
  const accionesLanzamiento = [4, 15, 30]; // ejemplo: 4 = lanzamiento, 15 = fallo, 30 = blocado
  const accionesPerdida = [12, 14, 17]; // ejemplo: 12 = pérdida, 14 = pasos, etc.

  // FETCH DATOS DEL PARTIDO
  useEffect(() => {
    if (!equipo_id || !partido_id || !token) return;

    const fetchDatos = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Partido
        const partidoRes = await fetch(`https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}`, { headers });
        const partidoData = await partidoRes.json();
        setPartido(partidoData);

        // 2. Acciones del partido
        const accionesRes = await fetch(`https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}/acciones_partido`, { headers });
        const accionesData = await accionesRes.json();
        setAcciones(accionesData);

      } catch (error) {
        console.error("Error al cargar datos del partido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [equipo_id, partido_id, token]);

  if (loading || !partido) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bg}>
        <Spinner size="xl" color="teal.600" />
      </Flex>
    );
  }

  // Datos básicos
  const fechaFormateada = new Date(partido.fecha).toLocaleDateString("es-ES");
  const nombreRival = partido.equiporival_id ?? "Rival";

  // Función auxiliar para contar acciones por jugador y tipo
  const contarAcciones = (ids) =>
    acciones.filter((a) => ids.includes(a.acciones_id)).length;

  // Lanzamientos = goles + fallos + blocados, etc.
  const lanzamientosEquipo = contarAcciones([...accionesGol, ...accionesLanzamiento]);
  const golesEquipo = contarAcciones(accionesGol);
  const perdidasEquipo = contarAcciones(accionesPerdida);

  // Simular datos del rival (ajustar según tu modelo real si se separan)
  const totalLanzamientosRival = 40;
  const golesRival = partido.goles_id_equiporival ?? 0;
  const perdidasRival = 3;

  // Eficacia
  const eficaciaEquipo = lanzamientosEquipo > 0 ? Math.round((golesEquipo / lanzamientosEquipo) * 100) : 0;
  const eficaciaRival = totalLanzamientosRival > 0 ? Math.round((golesRival / totalLanzamientosRival) * 100) : 0;

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
            <Text fontSize="sm" color="gray.600">{nombreRival}</Text>
            <Box bg="red.400" color="white" px={4} py={2} rounded="sm" fontWeight="bold">
              {golesRival}
            </Box>
          </Box>
        </Flex>

        {/* Tabs */}
        <Flex justify="center" mb={6} gap={6}>
          {tabs.map(tab => (
            <Text
              key={tab}
              fontWeight="medium"
              color={tab === "Resumen" ? "black" : "gray.500"}
              fontSize="sm"
              px={2}
            >
              {tab.label}
            </Text>
          ))}
        </Flex>

        {/* Lanzamientos */}
        <Box mb={4}>
          <Text textAlign="center" fontSize="sm" mb={2}>
            {golesEquipo}/{lanzamientosEquipo} - Lanzamientos - {golesRival}/{totalLanzamientosRival}
          </Text>
          <Flex h="8px" bg="#f0f0f0" overflow="hidden">
            <Box w={`${(lanzamientosEquipo / 80) * 100}%`} bg="teal.500" />
            <Box w={`${(totalLanzamientosRival / 80) * 100}%`} bg="red.300" />
          </Flex>
        </Box>

        {/* Pérdidas */}
        <Box mb={6}>
          <Text textAlign="center" fontSize="sm" mb={2}>
            {perdidasEquipo} - Pérdidas - {perdidasRival}
          </Text>
          <Flex h="8px" bg="#f0f0f0" overflow="hidden">
            <Box w={`${(perdidasEquipo / 20) * 100}%`} bg="teal.500" />
            <Box w={`${(perdidasRival / 20) * 100}%`} bg="red.300" />
          </Flex>
        </Box>

        {/* Eficacia en ataque */}
        <SimpleGrid columns={2} spacing={10} maxW="300px" mx="auto">
          <Box textAlign="center">
            <CircularProgress value={eficaciaEquipo} size="80px" thickness="10px" color="teal.500">
              <CircularProgressLabel fontSize="md">{eficaciaEquipo}%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} fontSize="sm">Eficacia en Ataque</Text>
          </Box>
          <Box textAlign="center">
            <CircularProgress value={eficaciaRival} size="80px" thickness="10px" color="red.400">
              <CircularProgressLabel fontSize="md">{eficaciaRival}%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} fontSize="sm">Eficacia en Ataque</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default ResumenPartido;
