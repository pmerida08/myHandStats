import React, { useEffect, useState } from 'react';
import {
  Box, Text, Flex, Icon, Button, SimpleGrid, useDisclosure, Spinner, Select, Circle, VStack
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Partidos = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Obtener equipos
  useEffect(() => {
    fetch('https://myhandstats.onrender.com/club/equipos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEquipos(data);
        } else {
          console.error('Respuesta inesperada:', data);
          setEquipos([]);
        }
      })
      .catch((err) => console.error('Error al cargar equipos:', err));
  }, []);

  // Obtener partidos al seleccionar equipo
  useEffect(() => {
    if (!equipoSeleccionado) return;
    setLoading(true);
    fetch(`https://myhandstats.onrender.com/equipo/${equipoSeleccionado}/partidos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPartidos(data);
        else console.error("Error de formato en la respuesta", data);
      })
      .catch((err) => console.error("Error al cargar partidos", err))
      .finally(() => setLoading(false));
  }, [equipoSeleccionado]);

  return (
    <Box p={4} minH="100vh" bg="white">
      <Sidebar isOpen={isOpen} onClose={onClose} />

      <Flex align="center" justify="space-between" mb={6}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Text fontSize="2xl" fontWeight="bold" color="#014C4C">Partidos</Text>
        <Box w="6" />
      </Flex>

      <Box maxW="300px" mb={6} mx="auto">
        <Select
          placeholder="Selecciona un equipo"
          value={equipoSeleccionado}
          onChange={(e) => {
            const id = e.target.value;
            setEquipoSeleccionado(id);
            localStorage.setItem("equipo_id", id);
          }}
        >
          {equipos.map((equipo) => (
            <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
          ))}
        </Select>
      </Box>

      {loading ? (
        <Flex justify="center" mt={10}><Spinner size="xl" /></Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {partidos.map((partido) => (
            <Box key={partido.id} bg="#006666" color="white" p={6} borderRadius="xl" textAlign="center" boxShadow="md">
              <VStack spacing={3}>
                <Text fontWeight="bold" fontSize="lg">
                  {new Date(partido.fecha).toLocaleDateString()}
                </Text>
                <Flex align="center" justify="center" gap={6}>
                  <Text fontSize="xl" fontWeight="bold">{partido.goles_local}</Text>
                  <Circle size="50px" bg="white" color="#006666" />
                  <Text fontSize="xl" fontWeight="bold">{partido.goles_visitante}</Text>
                </Flex>
                <Text fontSize="sm">{partido.equipo_local} vs {partido.equipo_visitante}</Text>
                <Button
                  mt={2}
                  size="sm"
                  colorScheme="whiteAlpha"
                  variant="outline"
                  onClick={() => navigate(`/resumen-partido/${partido.id}`)}
                >
                  Ver Partido
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Partidos;