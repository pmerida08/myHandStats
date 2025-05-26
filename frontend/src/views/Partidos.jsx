import React, { useEffect, useState } from 'react';
import {
  Box, Text, Flex, Icon, Button, SimpleGrid, useDisclosure, Spinner,
  Circle, VStack, IconButton
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import AuthWrapper from "../components/AuthWrapper";

const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const equipo_id = localStorage.getItem("id_equipo");

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
        if (Array.isArray(data)) setPartidos(data);
        else console.error("Error de formato en la respuesta", data);
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
                    <Text fontSize="xl" fontWeight="bold">
                      {partido.goles_local ?? partido.goles_id_equipo ?? 0}
                    </Text>
                    <Circle size="50px" bg="white" color="#006666" />
                    <Text fontSize="xl" fontWeight="bold">
                      {partido.goles_visitante ?? partido.goles_id_equiporival ?? 0}
                    </Text>
                  </Flex>
                  <Text fontSize="sm">
                    {partido.equipo_visitante ?? partido.equiporival_id}
                  </Text>
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
    </AuthWrapper>
  );
};

export default Partidos;
