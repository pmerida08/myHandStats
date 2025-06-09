/**
 * Partidos
 * 
 * Vista para la gestión y visualización de partidos de un equipo.
 * Permite:
 * - Listar todos los partidos del equipo, ordenados por fecha.
 * - Filtrar partidos por mes.
 * - Visualizar el resumen de cada partido.
 * - Eliminar partidos (solo para usuarios con rol "admin").
 * 
 * Características:
 * - Solo accesible para usuarios autenticados.
 * - Muestra el header personalizado y logo de fondo.
 * - Incluye feedback visual con toasts y spinner de carga.
 * - Modal de confirmación para eliminar partidos.
 * - Colores visuales para victoria, empate y derrota.
 * 
 * Uso:
 * - Accesible desde el menú principal del equipo.
 * - Permite navegar al resumen de cada partido.
 */
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  useDisclosure,
  Spinner,
  VStack,
  Icon,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header";


const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroMes, setFiltroMes] = useState("todos");
  const { onOpen } = useDisclosure();
  const navigate = useNavigate();

  // Para el header
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });

  // Para eliminar partido
  const [partidoAEliminar, setPartidoAEliminar] = useState(null);
  const [isModalEliminarOpen, setIsModalEliminarOpen] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const toast = useToast();

  const token = localStorage.getItem("token");
  const equipo_id = localStorage.getItem("id_equipo");
  const nombreEquipo = localStorage.getItem("nombre_equipo") ?? "Mi Equipo";
  const [rol, setRol] = useState("");

  // Cargar datos de usuario y club igual que en Dashboard
  useEffect(() => {
    if (!token) return;
    fetch("https://myhandstats.onrender.com/usuario/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.info?.nombre || "Usuario");
        setRol(data.info?.rol || "");
      });

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
  }, [token]);

  const fetchPartidos = useCallback(() => {
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
          const ordenados = data.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );
          setPartidos(ordenados);
        } else {
          console.error("Error de formato en la respuesta", data);
        }
      })
      .catch((err) => console.error("Error al cargar partidos", err))
      .finally(() => setLoading(false));
  }, [equipo_id, token]);

  useEffect(() => {
    fetchPartidos();
  }, [fetchPartidos]);

  // Función para eliminar partido
  const eliminarPartido = async () => {
    if (!partidoAEliminar) return;
    setEliminando(true);
    try {
      const res = await fetch(
        `https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partidoAEliminar.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        let msg = "No se pudo eliminar el partido";
        try {
          const data = await res.json();
          if (data.detail) msg = data.detail;
        } catch {
          msg = "Error desconocido al eliminar el partido";
        }
        toast({
          title: "Error",
          description: msg,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Partido eliminado",
          description: "El partido se ha eliminado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchPartidos();
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el partido.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setEliminando(false);
      setIsModalEliminarOpen(false);
      setPartidoAEliminar(null);
    }
  };

  return (
    <AuthWrapper requiredRole={null}>
      <Box p={4} minH="100vh" bg="white" position="relative">
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
        <Header
          onOpen={onOpen}
          userName={userName}
          club={club}
          texto="Partidos"
        />

        {/* Filtro por mes */}
        {partidos.length > 0 && (
          <Flex mb={4} gap={4} align="center" flexWrap="wrap" justify="center">
            <Text fontWeight="medium">Filtrar por mes:</Text>
            <Box>
              <select
                onChange={(e) => setFiltroMes(e.target.value)}
                value={filtroMes}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "1.5px solid #319795",
                  background: "#f0fdfa",
                  color: "#014C4C",
                  fontWeight: "bold",
                  outline: "none",
                  fontSize: "1rem",
                  boxShadow: "0 1px 4px rgba(49,151,149,0.08)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
                onFocus={e => e.target.style.borderColor = "#014C4C"}
                onBlur={e => e.target.style.borderColor = "#319795"}
              >
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
            </Box>
          </Flex>
        )}

        {loading ? (
          <Flex justify="center" mt={10}>
            <Spinner size="xl" />
          </Flex>
        ) : partidos.length === 0 ? (
          <Flex justify="center" mt={10}>
            <Text color="gray.500" fontWeight="bold" fontSize="xl">
              No existen partidos todavía.
            </Text>
          </Flex>
        ) : (
          <Flex
            wrap="wrap"
            gap={2}
            justify="center"
            align="flex-start"
          >
            {partidos
              .filter((partido) => {
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
                if (golesEquipo > golesRival)
                  resultadoColor = "#38A169"; // victoria
                else if (golesEquipo < golesRival) resultadoColor = "#E53E3E"; // derrota

                return (
                  <Box
                    key={partido.id}
                    bg="white"
                    opacity={0.92}
                    p={6}
                    borderRadius="xl"
                    boxShadow="md"
                    borderLeft={`8px solid ${resultadoColor}`}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    transition="0.3s"
                    _hover={{ boxShadow: "lg", transform: "scale(1.01)", opacity: 1 }}
                    maxW="350px"
                    w="100%"
                    minW="260px"
                    m={2}
                  >
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      {fecha}
                    </Text>

                    <Flex justify="space-between" align="center" mb={6}>
                      <VStack spacing={1} align="start" maxW="60%">
                        <Text fontWeight="bold" fontSize="lg" isTruncated>
                          {nombreEquipo}
                        </Text>
                        <Text
                          fontSize="4xl"
                          fontWeight="bold"
                          color={resultadoColor}
                        >
                          {golesEquipo}
                        </Text>
                      </VStack>

                      <Text fontSize="4xl" fontWeight="bold" color="gray.400">
                        :
                      </Text>

                      <VStack spacing={1} align="end" maxW="60%">
                        <Text fontWeight="bold" fontSize="lg" isTruncated>
                          {nombreRival}
                        </Text>
                        <Text
                          fontSize="4xl"
                          fontWeight="bold"
                          color={resultadoColor}
                        >
                          {golesRival}
                        </Text>
                      </VStack>
                    </Flex>

                    <Flex justify="flex-end" gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="teal"
                        onClick={() =>
                          navigate(`/resumen-partido/${partido.id}`)
                        }
                      >
                        Ver Partido
                      </Button>
                      {rol === "admin" && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          isLoading={eliminando && partidoAEliminar?.id === partido.id}
                          onClick={() => {
                            setPartidoAEliminar(partido);
                            setIsModalEliminarOpen(true);
                          }}
                        >
                          Eliminar
                        </Button>
                      )}
                    </Flex>
                  </Box>
                );
              })}
          </Flex>
        )}

        {/* Modal de confirmación para eliminar partido */}
        <Modal isOpen={isModalEliminarOpen} onClose={() => setIsModalEliminarOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar eliminación</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              ¿Estás seguro de que quieres eliminar este partido? Esta acción no se puede deshacer.
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsModalEliminarOpen(false)} mr={3}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={eliminarPartido}
                isLoading={eliminando}
              >
                Eliminar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AuthWrapper>
  );
};

export default Partidos;
