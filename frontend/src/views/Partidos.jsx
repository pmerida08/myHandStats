import React, { useEffect, useState } from 'react';
import {
  Box, Text, Flex, Button, SimpleGrid, useDisclosure, Spinner,
  VStack, Icon
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import AuthWrapper from "../components/AuthWrapper";

const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroMes, setFiltroMes] = useState("todos");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const equipo_id = localStorage.getItem("id_equipo");
  const nombreEquipo = localStorage.getItem("nombre_equipo") ?? "Mi Equipo";

  const fetchPartidos = () => {
    if (!equipo_id) return;
    setLoading(true);
    fetch(`https://myhandstats.onrender.com/equipo/${equipo_id}/partidos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const ordenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          setPartidos(ordenados);
        } else {
          console.error("Error de formato en la respuesta", data);
        }
      })
      .catch((err) => console.error("Error al cargar partidos", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPartidos();
  }, [equipo_id]);

  return (
    <AuthWrapper requiredRole={null}>
      <Box p={4} minH="100vh" bg="white" position="relative">
        <Sidebar isOpen={isOpen} onClose={onClose} />

        <Flex align="center" justify="space-between" mb={6}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Text fontSize="2xl" fontWeight="bold" color="#014C4C">Partidos</Text>
          <Box w="6" />
        </Flex>

        {/* Filtro por mes */}
        <Flex mb={4} gap={4} align="center" flexWrap="wrap">
          <Text fontWeight="medium">Filtrar por mes:</Text>
          <select onChange={(e) => setFiltroMes(e.target.value)} value={filtroMes}>
            <option value="todos">Todos</option>
            <option value="0">Enero</option>
            <option value="1">Febrero</option>
            <option value="2">Marzo</option>
            <option value="3">Abril</option>
            <option value="4">Mayo</option>
            <option value="5">Junio</option>
            <option value="6">Julio</option>
            <option value="7">Agosto</option>
            <option value="8">Septiembre</option>
            <option value="9">Octubre</option>
            <option value="10">Noviembre</option>
            <option value="11">Diciembre</option>
          </select>
        </Flex>

        {loading ? (
          <Flex justify="center" mt={10}><Spinner size="xl" /></Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {partidos
              .filter(partido => {
                if (filtroMes === "todos") return true;
                const mes = new Date(partido.fecha).getMonth(); // 0 = enero
                return mes.toString() === filtroMes;
              })
              .map((partido) => {
                const fecha = new Date(partido.fecha).toLocaleDateString();
                const golesEquipo = partido.goles_id_equipo ?? 0;
                const golesRival = partido.goles_id_equiporival ?? 0;
                const nombreRival = partido.equiporival_id ?? "Rival";

                // Colores por resultado
                let resultadoColor = "#718096"; // empate
                if (golesEquipo > golesRival) resultadoColor = "#38A169"; // victoria
                else if (golesEquipo < golesRival) resultadoColor = "#E53E3E"; // derrota

                return (
                  <Box
                    key={partido.id}
                    bg="white"
                    p={6}
                    borderRadius="xl"
                    boxShadow="md"
                    borderLeft={`8px solid ${resultadoColor}`}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    transition="0.3s"
                    _hover={{ boxShadow: "lg", transform: "scale(1.01)" }}
                  >
                    <Text fontSize="sm" color="gray.500" mb={2}>{fecha}</Text>

                    <Flex justify="space-between" align="center" mb={6}>
                      <VStack spacing={1} align="start" maxW="60%">
                        <Text fontWeight="bold" fontSize="lg" isTruncated>{nombreEquipo}</Text>
                        <Text fontSize="4xl" fontWeight="bold" color={resultadoColor}>{golesEquipo}</Text>
                      </VStack>

                      <Text fontSize="4xl" fontWeight="bold" color="gray.400">:</Text>

                      <VStack spacing={1} align="end" maxW="60%">
                        <Text fontWeight="bold" fontSize="lg" isTruncated>{nombreRival}</Text>
                        <Text fontSize="4xl" fontWeight="bold" color={resultadoColor}>{golesRival}</Text>
                      </VStack>
                    </Flex>

                    <Flex justify="flex-end">
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => navigate(`/resumen-partido/${partido.id}`)}
                      >
                        Ver Partido
                      </Button>
                    </Flex>
                  </Box>
                );
              })}
          </SimpleGrid>
        )}
      </Box>
    </AuthWrapper>
  );
};

export default Partidos;
