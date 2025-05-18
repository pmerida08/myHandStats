import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import Sidebar from '../components/Sidebar';
import axios from "axios";

const ResumenPartido = () => {
  const { equipo_id, partido_id } = useParams();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    axios
      .get(`https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}`)
      .then((response) => {
        setDatos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del partido:", error);
      });
  }, [equipo_id, partido_id]);

  const partido = datos ?? {
    fecha: "2025-05-20T00:00:00",
    goles_id_equipo: 0,
    goles_id_equiporival: 0,
    equiporival_id: "Rival",
  };

  const fechaFormateada = new Date(partido.fecha).toLocaleDateString("es-ES");

  return (
    <Flex>
      <Sidebar />

      <Box flex="1" bg="white" p={6}>
        {/* Cabecera */}
        <Box textAlign="center" mb={6}>
          <Text fontSize="xl" fontWeight="bold">Estadísticas Del Partido</Text>
          <Text color="gray.600">Liga</Text>
          <Text fontSize="sm" color="gray.500">
            Jornada 1 - {fechaFormateada}
          </Text>
        </Box>

        {/* Marcador */}
        <Flex justify="center" align="center" mb={6} gap={8}>
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.600">Tú Equipo</Text>
            <Box bg="teal.600" color="white" px={4} py={2} rounded="sm" fontWeight="bold">
              {partido.goles_id_equipo}
            </Box>
          </Box>
          <Text fontWeight="bold" fontSize="lg">vs</Text>
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.600">{partido.equiporival_id}</Text>
            <Box bg="red.400" color="white" px={4} py={2} rounded="sm" fontWeight="bold">
              {partido.goles_id_equiporival}
            </Box>
          </Box>
        </Flex>

        {/* Tabs (estáticos) */}
        <Flex justify="center" mb={6} gap={6}>
          {["Resumen", "Goleadores", "Timeline", "Jugadores", "Tiros"].map(tab => (
            <Text
              key={tab}
              fontWeight="medium"
              color={tab === "Resumen" ? "black" : "gray.500"}
              fontSize="sm"
              px={2}
            >
              {tab}
            </Text>
          ))}
        </Flex>

        {/* Lanzamientos */}
        <Box mb={4}>
          <Text textAlign="center" fontSize="sm" mb={2}>
            20/40 - Lanzamientos - 30/40
          </Text>
          <Flex h="8px" bg="#f0f0f0" overflow="hidden">
            <Box w="50%" bg="teal.500" />
            <Box w="37.5%" bg="red.300" />
          </Flex>
        </Box>

        {/* Pérdidas */}
        <Box mb={6}>
          <Text textAlign="center" fontSize="sm" mb={2}>
            8 - Pérdidas - 3
          </Text>
          <Flex h="8px" bg="#f0f0f0" overflow="hidden">
            <Box w="40%" bg="teal.500" />
            <Box w="15%" bg="red.300" />
          </Flex>
        </Box>

        {/* Eficacia en ataque */}
        <SimpleGrid columns={2} spacing={10} maxW="300px" mx="auto">
          <Box textAlign="center">
            <CircularProgress value={43} size="80px" thickness="10px" color="teal.500">
              <CircularProgressLabel fontSize="md">43%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} fontSize="sm">Eficacia en Ataque</Text>
          </Box>
          <Box textAlign="center">
            <CircularProgress value={73} size="80px" thickness="10px" color="red.400">
              <CircularProgressLabel fontSize="md">73%</CircularProgressLabel>
            </CircularProgress>
            <Text mt={2} fontSize="sm">Eficacia en Ataque</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default ResumenPartido;
