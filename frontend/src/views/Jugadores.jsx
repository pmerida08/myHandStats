import {
  Box,
  Text,
  Select,
  SimpleGrid,
  IconButton,
  Avatar,
  Button,
  useBreakpointValue,
  Spinner,
  useDisclosure,
  Flex,
  Icon
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaPlus, FaUser } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; 
import { FaBars, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Jugadores = () => {
  const gridCols = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener equipos
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Authorization:", `Bearer ${token}`);

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

  // Obtener jugadores por equipo
  useEffect(() => {
    if (!equipoSeleccionado) return;

    setLoading(true);
    const token = localStorage.getItem('token');

    fetch(`https://myhandstats.onrender.com/equipo/${equipoSeleccionado}/jugadores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJugadores(data);
        } else {
          console.error('Respuesta inesperada:', data);
          setJugadores([]);
        }
      })
      .catch((err) => console.error('Error al cargar jugadores:', err))
      .finally(() => setLoading(false));
  }, [equipoSeleccionado]);

  return (
    <Box p={4} position="relative">
    <Sidebar isOpen={isOpen} onClose={onClose} />
      <Flex align="center" justify="space-between" mb={8}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Text fontSize="2xl" fontWeight="bold" color="#014C4C">Jugadores</Text>
        <Box w="6" />
      </Flex>

      <Box maxW="250px" mx="auto" mb={6}>
        <Select
          placeholder="Selecciona un equipo"
          value={equipoSeleccionado}
          onChange={(e) => setEquipoSeleccionado(e.target.value)}
        >
          {Array.isArray(equipos) &&
            equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.nombre}
              </option>
            ))}
        </Select>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" color="teal.600" />
        </Box>
      ) : (
        <SimpleGrid columns={gridCols} spacing={6}>
          {jugadores.map((jugador) => (
            <Box
              key={jugador.id}
              bg="#CFE7E7"
              borderRadius="xl"
              boxShadow="md"
              py={5}
              px={10}
              textAlign="center"
              maxW="230px"
              mx="auto"
            >
              <Avatar icon={<FaUser />} size="xl" bg="#A2CFCF" mb={3} />
              <Text fontWeight="bold" fontSize="md">{jugador.nombre}</Text>
              <Text fontSize="sm" mt={1}>{jugador.edad} años</Text>
              <Text fontSize="sm">Dorsal: {jugador.dorsal}</Text>
              <Text fontSize="sm" mb={3}>{jugador.posicion}</Text>
              <Button
                bg="#014C4C"
                color="white"
                size="sm"
                borderRadius="md"
                _hover={{ bg: "#013C3C" }}
                w="100%"
              >
                Ver Stats
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <IconButton
        icon={<FaPlus />}
        bg="#014C4C"
        color="white"
        borderRadius="full"
        size="lg"
        position="fixed"
        bottom={6}
        right={6}
        aria-label="Añadir jugador"
        boxShadow="lg"
        _hover={{ bg: "#013C3C" }}
      />
    </Box>
  );
};

export default Jugadores;
