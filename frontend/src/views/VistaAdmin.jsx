/**
 * VistaAdmin
 * 
 * Vista de administración para gestionar los equipos de un club.
 * 
 * Características:
 * - Muestra un listado de equipos del club (simulado, pendiente de endpoint real).
 * - Permite ordenar los equipos por nombre o fecha (menú de ejemplo).
 * - Muestra un spinner de carga mientras se obtienen los datos.
 * - Si no hay equipos, muestra mensaje y botón para crear uno nuevo.
 * - Diseño visual con Chakra UI y uso de iconos.
 * 
 * Uso:
 * - Accesible solo para administradores del club.
 * - Se utilizará como panel principal de gestión de equipos.
 */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import { FaBars, FaPlus, FaChevronDown } from "react-icons/fa";

const VistaAdmin = () => {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // TODO: Reemplazar cuando el endpoint esté disponible
    /*
    fetch('http://localhost:8000/api/equipos/club/123')  // ← Reemplaza con ID de club dinámico
      .then(res => res.json())
      .then(data => {
        setEquipos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al obtener equipos:', err);
        setCargando(false);
      });
    */

    setCargando(false); // Quita esto cuando actives el fetch real
  }, []);

  return (
    <Box p={4} minH="100vh" bg="white">
      {/* Header */}
      <Flex align="center" justify="space-between" mb={6}>
        <Icon as={FaBars} boxSize={6} />

        <Text fontSize="xl" fontWeight="bold" color="#014C4C">
          Vista Administrador
        </Text>

        <Box w="6" />
      </Flex>

      {/* Menú ordenar por */}
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          rightIcon={<FaChevronDown />}
          color="#014C4C"
        >
          Ordenar por
        </MenuButton>
        <MenuList>
          <MenuItem>Nombre</MenuItem>
          <MenuItem>Fecha</MenuItem>
        </MenuList>
      </Menu>

      {/* Contenido principal */}
      <Flex direction="column" align="center" justify="center" mt={20}>
        {cargando ? (
          <Spinner size="lg" color="#014C4C" />
        ) : equipos.length === 0 ? (
          <>
            <Text mb={4}>Aún no tienes equipos</Text>
            <Button
              bg="#014C4C"
              color="white"
              borderRadius="md"
              size="lg"
              _hover={{ bg: "#016666" }}
            >
              <Icon as={FaPlus} />
            </Button>
          </>
        ) : (
          equipos.map((equipo, idx) => (
            <Box
              key={idx}
              p={4}
              border="1px solid #ccc"
              borderRadius="md"
              mb={3}
            >
              <Text>{equipo.nombre}</Text>
            </Box>
          ))
        )}
      </Flex>
    </Box>
  );
};

export default VistaAdmin;
