import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  Select,
  useToast,
  Flex,
  IconButton,
  HStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import { useDisclosure } from "@chakra-ui/react";
import AuthWrapper from "../components/AuthWrapper";

const GestionEntrenadores = ({ equipoId }) => {
  const [entrenadoresDisponibles, setEntrenadoresDisponibles] = useState([]);
  const [entrenadoresAsignados, setEntrenadoresAsignados] = useState([]);
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    cargarEntrenadores();
    // eslint-disable-next-line
  }, []);

  const cargarEntrenadores = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res1 = await fetch(`https://myhandstats.onrender.com/club/entrenadores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data1 = await res1.json();
      setEntrenadoresDisponibles(data1.entrenadores || data1 || []);

      const equipoIdLocal = localStorage.getItem("id_equipo");
      const res2 = await fetch(`https://myhandstats.onrender.com/equipo/${equipoIdLocal}/entrenadores_equipo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data2 = await res2.json();

      let entrenadoresAsignados = [];
      if (Array.isArray(data2)) {
        entrenadoresAsignados = await Promise.all(
          data2.map(async (entId) => {
            const res = await fetch(
              `https://myhandstats.onrender.com/club/entrenador/${entId.entrenador_id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const detalle = await res.json();
            return detalle;
          })
        );
        setEntrenadoresAsignados(entrenadoresAsignados);
      } else if (data2.entrenadores) {
        setEntrenadoresAsignados(data2.entrenadores);
      } else {
        setEntrenadoresAsignados([]);
      }
    } catch (error) {
      toast({
        title: "Error al cargar entrenadores",
        description: error.message,
        status: "error",
      });
    }
    setLoading(false);
  };

  const asociarEntrenador = async () => {
    if (!entrenadorSeleccionado) return;
    const token = localStorage.getItem("token");
    try {
      const equipo_id = localStorage.getItem("id_equipo") || equipoId;
      const res = await fetch(`https://myhandstats.onrender.com/equipo/equipo_entrenador/${equipo_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipo_id: String(equipo_id),
          entrenador_id: String(entrenadorSeleccionado),
          rol: "entrenador",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al asociar entrenador");
      }

      toast({ title: "Entrenador asignado", status: "success" });
      setEntrenadorSeleccionado("");
      cargarEntrenadores();
    } catch (error) {
      toast({
        title: "Error al asignar entrenador",
        description: error.message,
        status: "error",
      });
    }
  };

  const eliminarAsociacion = async (entrenadorId) => {
    const token = localStorage.getItem("token");
    const equipo_id = localStorage.getItem("id_equipo") || equipoId;
    try {
      const res = await fetch(
        `https://myhandstats.onrender.com/equipo/${equipo_id}/entrenador_equipo/${entrenadorId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al eliminar entrenador");
      }

      toast({ title: "Entrenador desasignado", status: "info" });
      cargarEntrenadores();
    } catch (error) {
      toast({
        title: "Error al eliminar entrenador",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <AuthWrapper requiredRole="admin">
      <Box bg="#f7f9fa" minH="100vh">
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Flex align="center" p={4}>
          <IconButton icon={<FaBars />} onClick={onOpen} aria-label="Menú" />
          <Heading size="lg" ml={4}>Gestión de Entrenadores</Heading>
        </Flex>

        <Flex justify="center" align="center" direction="column" px={4}>
          <Box w="100%" maxW="600px" bg="white" p={6} borderRadius="lg" boxShadow="lg" mt={4}>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="teal.700">
                Asignar Entrenador al Equipo
              </Heading>
              <Select
                placeholder="Selecciona un entrenador"
                value={entrenadorSeleccionado}
                onChange={(e) => setEntrenadorSeleccionado(e.target.value)}
              >
                {entrenadoresDisponibles.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} ({e.email})
                  </option>
                ))}
              </Select>
              <Button colorScheme="teal" onClick={asociarEntrenador}>
                Asignar
              </Button>
            </VStack>
          </Box>

          <Box w="100%" maxW="600px" bg="white" p={6} borderRadius="lg" boxShadow="lg" mt={8}>
            <Heading size="md" mb={4} color="teal.700">
              Entrenadores Asignados al Equipo
            </Heading>
            {loading ? (
              <Spinner />
            ) : (
              <VStack spacing={4} align="stretch">
                {entrenadoresAsignados.length === 0 && (
                  <Text color="gray.500">No hay entrenadores asignados a este equipo.</Text>
                )}
                {entrenadoresAsignados.map((e, idx) => (
                  <HStack
                    key={e.id ? e.id : `${e.entrenador_id}-${idx}`}
                    justify="space-between"
                    border="1px solid #e2e8f0"
                    p={3}
                    borderRadius="md"
                  >
                    <Box>
                      <Text fontWeight="bold" fontSize="md">
                        {e.nombre ? e.nombre : `ID: ${e.entrenador_id || e.id}`}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {e.email || ""}
                      </Text>
                      <Text fontSize="sm" color="teal.700">
                        Rol: {e.rol}
                      </Text>
                    </Box>
                    <IconButton
                      icon={<span style={{ fontWeight: "bold", fontSize: "18px" }}>×</span>}
                      colorScheme="red"
                      size="sm"
                      onClick={() => eliminarAsociacion(e.entrenador_id || e.id)}
                      aria-label="Eliminar"
                    />
                  </HStack>
                ))}
              </VStack>
            )}
          </Box>
        </Flex>
      </Box>
    </AuthWrapper>
  );
};

export default GestionEntrenadores;
