/**
 * GestionEntrenadores
 *
 * Vista de administración para asignar y gestionar entrenadores de un equipo.
 * Permite:
 * - Ver los entrenadores disponibles en el club.
 * - Asignar entrenadores a un equipo.
 * - Ver y eliminar entrenadores ya asignados al equipo.
 *
 * Características:
 * - Solo accesible para usuarios con rol "admin".
 * - Muestra el header y sidebar personalizados.
 * - Incluye feedback visual con toasts y spinner de carga.
 *
 * Props:
 * - equipoId (opcional): ID del equipo a gestionar (si no se usa el de localStorage).
 */
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Select,
  useToast,
  Flex,
  IconButton,
  HStack,
  Text,
  Spinner,
  Image,
  Heading,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { useDisclosure } from "@chakra-ui/react";
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header";

const GestionEntrenadores = ({ equipoId }) => {
  // Estado para la lista de entrenadores disponibles en el club
  const [entrenadoresDisponibles, setEntrenadoresDisponibles] = useState([]);
  // Estado para la lista de entrenadores asignados al equipo
  const [entrenadoresAsignados, setEntrenadoresAsignados] = useState([]);
  // Estado para el entrenador seleccionado en el select
  const [entrenadorSeleccionado, setEntrenadorSeleccionado] = useState("");
  // Estado de carga
  const [loading, setLoading] = useState(false);
  // Control del sidebar
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Toast para notificaciones
  const toast = useToast();
  // Estado para el nombre de usuario y club (para el header)
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });

  /**
   * useEffect inicial:
   * - Carga el nombre del usuario y los datos del club para el header.
   * - Llama a cargarEntrenadores para obtener los entrenadores disponibles y asignados.
   */
  useEffect(() => {
    // Cargar nombre usuario y club
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://myhandstats.onrender.com/usuario/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserName(data.info?.nombre || "Usuario"));

      fetch("https://myhandstats.onrender.com/club", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          let clubId = null;
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            clubId = payload.club_id || payload.club || payload.id || null;
          } catch {
            clubId = null;
          }
          let clubObj = null;
          if (Array.isArray(data.info)) {
            clubObj = data.info.find((c) => c.id == clubId);
          } else {
            clubObj = data;
          }
          setClub({
            nombre: clubObj?.nombre || "Club no encontrado",
            logo: clubObj?.logo || "",
          });
        });
    }
    cargarEntrenadores();
    // eslint-disable-next-line
  }, []);

  /**
   * Carga los entrenadores disponibles en el club y los asignados al equipo.
   */
  const cargarEntrenadores = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      // Entrenadores disponibles en el club
      const res1 = await fetch(
        `https://myhandstats.onrender.com/club/entrenadores`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data1 = await res1.json();
      setEntrenadoresDisponibles(data1.entrenadores || data1 || []);

      // Entrenadores asignados al equipo
      const equipoIdLocal = localStorage.getItem("id_equipo");
      const res2 = await fetch(
        `https://myhandstats.onrender.com/equipo/${equipoIdLocal}/entrenadores_equipo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  /**
   * Asocia el entrenador seleccionado al equipo.
   */
  const asociarEntrenador = async () => {
    if (!entrenadorSeleccionado) return;
    const token = localStorage.getItem("token");
    try {
      const equipo_id = localStorage.getItem("id_equipo") || equipoId;
      const res = await fetch(
        `https://myhandstats.onrender.com/equipo/equipo_entrenador/${equipo_id}`,
        {
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
        }
      );

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

  /**
   * Elimina la asociación de un entrenador con el equipo.
   * @param {string|number} entrenadorId - ID del entrenador a desasociar
   */
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
      <Box p={4} position="relative" minH="100vh" bg="#f7f9fa">
        {/* Logo de fondo */}
        <Image
          src="https://rdpazmfdbcundrogccsb.supabase.co/storage/v1/object/public/imagenes//logo.avif"
          alt="Logo MyHandStats"
          position="fixed"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          opacity={0.12}
          zIndex={0}
          boxSize={["250px", "350px", "450px"]}
          pointerEvents="none"
          userSelect="none"
        />
        {/* Header y Sidebar */}
        <Header
          onOpen={onOpen}
          userName={userName}
          club={club}
          texto="Gestión de Entrenadores"
        />
        <Sidebar isOpen={isOpen} onClose={onClose} />
        {/* Panel principal */}
        <Flex justify="center" align="center" direction="column" px={4}>
          {/* Asignar entrenador */}
          <Box
            w="100%"
            maxW="600px"
            bg="white"
            opacity={0.93}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            mt={4}
          >
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

          {/* Entrenadores asignados */}
          <Box
            w="100%"
            maxW="600px"
            bg="white"
            opacity={0.93}
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            mt={8}
          >
            <Heading size="md" mb={4} color="teal.700">
              Entrenadores Asignados al Equipo
            </Heading>
            {loading ? (
              <Spinner />
            ) : (
              <VStack spacing={4} align="stretch">
                {entrenadoresAsignados.length === 0 && (
                  <Text color="gray.500">
                    No hay entrenadores asignados a este equipo.
                  </Text>
                )}
                {entrenadoresAsignados.map((e, idx) => (
                  <HStack
                    key={e.id ? e.id : `${e.entrenador_id}-${idx}`}
                    justify="space-between"
                    border="1px solid #e2e8f0"
                    p={3}
                    borderRadius="md"
                    bg="white"
                    opacity={0.93}
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
                      icon={
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                          ×
                        </span>
                      }
                      colorScheme="red"
                      size="sm"
                      onClick={() =>
                        eliminarAsociacion(e.entrenador_id || e.id)
                      }
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
