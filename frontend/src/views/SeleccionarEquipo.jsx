import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const SeleccionEquipo = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('https://myhandstats.onrender.com/club/equipos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener los equipos');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEquipos(data);
        } else {
          console.error('Respuesta inesperada:', data);
          setEquipos([]);
        }
      })
      .catch((err) => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSeleccion = (equipo) => {
    console.log('Equipo seleccionado:', equipo);
    // Aquí podrías guardar en context, navegar a otra vista, etc.
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="#014C4C">Selecciona tu equipo</Heading>
      </Flex>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" color="teal.600" />
        </Box>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {equipos.map((equipo) => (
            <Box
              key={equipo.id}
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
              transition="0.2s"
            >
              <Text fontSize="xl" fontWeight="bold" color="#014C4C" mb={2}>
                {equipo.nombre}
              </Text>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => handleSeleccion(equipo)}
              >
                Seleccionar
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default SeleccionEquipo;
