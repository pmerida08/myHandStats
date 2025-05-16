import {
  Box,
  Text,
  Select,
  SimpleGrid,
  IconButton,
  Avatar,
  Button,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaPlus, FaUser } from 'react-icons/fa';

const Jugadores = () => {
  const equipos = ['Equipo A', 'Equipo B', 'Equipo C'];
  const gridCols = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

  return (
    <Box p={4} position="relative">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Jugadores
      </Text>

      <Box maxW="250px" mx="auto" mb={6}>
        <Select placeholder="Selecciona un equipo">
          {equipos.map((equipo, i) => (
            <option key={i} value={equipo}>
              {equipo}
            </option>
          ))}
        </Select>
      </Box>

      <SimpleGrid columns={gridCols} spacing={6}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Box
            key={i}
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
            <Text fontWeight="bold" fontSize="md">José Ramón</Text>
            <Text fontSize="sm" mt={1}>20 años</Text>
            <Text fontSize="sm">Dorsal: 7</Text>
            <Text fontSize="sm" mb={3}>Pivote</Text>
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
