import React, { useEffect, useState } from 'react';
import {
  Box, Text, Flex, Icon, Button, SimpleGrid, useDisclosure, Spinner,
  Circle, VStack, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl, Input, useToast
} from '@chakra-ui/react';
import { FaBars, FaPlus } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import AuthWrapper from "../components/AuthWrapper";


const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevoVisitante, setNuevoVisitante] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const token = localStorage.getItem("token");
  const equipo_id = localStorage.getItem("id_equipo"); // <-- corregido aquí

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

  const crearPartido = () => {
    if (!nuevaFecha || !nuevoVisitante) {
      toast({
        title: "Faltan datos",
        description: "Debes completar la fecha y el equipo visitante",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const body = {
      fecha: nuevaFecha,
      equipo_local: parseInt(equipo_id),
      equipo_visitante_nombre: nuevoVisitante,
    };

    fetch(`https://myhandstats.onrender.com/${equipo_id}/partido/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear partido");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Partido creado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsModalOpen(false);
        setNuevaFecha("");
        setNuevoVisitante("");
        fetchPartidos(); // Recargar lista
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "No se pudo crear el partido",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

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

      {/* Botón flotante para crear partido */}
      <IconButton
        icon={<FaPlus />}
        bg="#014C4C"
        color="white"
        borderRadius="full"
        size="lg"
        position="fixed"
        bottom={6}
        right={6}
        aria-label="Añadir partido"
        boxShadow="lg"
        _hover={{ bg: "#013C3C" }}
        onClick={() => setIsModalOpen(true)}
      />

      {/* Modal para crear partido */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear nuevo partido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Fecha del partido"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Nombre del equipo visitante"
                  value={nuevoVisitante}
                  onChange={(e) => setNuevoVisitante(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={crearPartido}>
              Crear
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </AuthWrapper>
  );
};

export default Partidos;
