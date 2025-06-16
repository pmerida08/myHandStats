/**
 * ResumenPartido
 * 
 * Vista para mostrar el resumen detallado de un partido específico.
 * 
 * Características:
 * - Muestra el resultado, estadísticas y acciones del partido.
 * - Tabs para ver resumen, goleadores, timeline de acciones, jugadores y tiros.
 * - Visualización de estadísticas como eficacia, pérdidas y goles.
 * - Timeline visual de las acciones del partido con iconos.
 * - Tabla de goleadores y jugadores participantes.
 * - Obtiene y relaciona datos de partido, acciones, tipos de acciones y jugadores.
 * - Incluye Header y Sidebar personalizados.
 * - Spinner de carga mientras se obtienen los datos.
 * 
 * Uso:
 * - Accesible para cualquier usuario autenticado.
 * - Se accede desde la lista de partidos o desde el menú del equipo.
 */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBars,
  FaFutbol,
  FaBullseye,
  FaTimes,
  FaSync,
  FaExclamationTriangle,
  FaSquareFull,
  FaUndo,
  FaHandPaper,
  FaSquare,
  FaRegQuestionCircle,

} from "react-icons/fa";
import {
  Box,
  Flex,
  Text,
  useDisclosure,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Icon,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  VStack,
  Image
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header"; // Añade este import

const ResumenPartido = () => {
  const { partido_id } = useParams();
  const equipo_id = localStorage.getItem("id_equipo");
  const token = localStorage.getItem("token");

  const [partido, setPartido] = useState(null);
  const [acciones, setAcciones] = useState([]);
  const [tiposAcciones, setTiposAcciones] = useState([]);
  const [jugadoresPartido, setJugadoresPartido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabSeleccionado, setTabSeleccionado] = useState("Resumen");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Añade estado para el usuario y club
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });

  useEffect(() => {
    if (!equipo_id || !partido_id || !token) return;

    const fetchDatos = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [
          partidoRes,
          accionesRes,
          tiposRes,
          jugadoresRes,
          jugadoresEquipoRes,
        ] = await Promise.all([
          fetch(
            `https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}`,
            { headers }
          ),
          fetch(
            `https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}/acciones_partido`,
            { headers }
          ),
          fetch(`https://myhandstats.onrender.com/acciones`, { headers }),
          fetch(
            `https://myhandstats.onrender.com/equipo/${equipo_id}/partido/${partido_id}/jugadores_partido`,
            { headers }
          ),
          fetch(
            `https://myhandstats.onrender.com/equipo/${equipo_id}/jugadores`,
            { headers }
          ),
        ]);

        const partidoData = await partidoRes.json();
        const accionesPartido = await accionesRes.json();
        const tiposAccionesData = await tiposRes.json();
        const jugadoresData = await jugadoresRes.json();
        const jugadoresEquipo = await jugadoresEquipoRes.json();

        const jugadoresConNombre = jugadoresData.map((jp) => {
          const jugadorInfo = jugadoresEquipo.find(
            (j) => j.id === jp.jugadores_id
          );
          return {
            ...jp,
            nombre: jugadorInfo?.nombre || `Jugador ${jp.jugadores_id}`,
            dorsal: jugadorInfo?.dorsal || "-",
          };
        });

        setPartido(partidoData);
        setAcciones(accionesPartido);
        setTiposAcciones(tiposAccionesData);
        setJugadoresPartido(jugadoresConNombre);
      } catch (error) {
        console.error("Error al cargar datos del partido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [equipo_id, partido_id, token]);

  useEffect(() => {
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
  }, [token]);

  if (loading || !partido) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const fechaFormateada = new Date(partido.fecha).toLocaleDateString("es-ES");
  const nombreRival = partido.equiporival_id ?? "Rival";

  const getIdsPorTipo = (tipo) =>
    tiposAcciones.filter((a) => a.tipo_accion === tipo).map((a) => a.id);

  const formatearAccion = (id) => {
    const accion = tiposAcciones.find((t) => t.id === id);
    if (!accion) return <>❔ Acción desconocida</>;

    const tipo = accion.tipo_accion;
    const nombre = accion.nombre;

    if (tipo === "goles")
      return (
        <>
          <FaFutbol style={{ display: "inline" }} /> Gol
        </>
      );
    if (tipo === "lanzamiento")
      return (
        <>
          <FaBullseye style={{ display: "inline" }} /> Lanzamiento
        </>
      );
    if (tipo === "perdida")
      return (
        <>
          <FaTimes style={{ display: "inline" }} /> Pérdida
        </>
      );
    if (tipo === "recuperacion")
      return (
        <>
          <FaSync style={{ display: "inline" }} /> Recuperación
        </>
      );
    if (tipo === "gol_en_contra")
      return (
        <>
          <FaExclamationTriangle style={{ display: "inline" }} /> Gol en Contra
        </>
      );
    if (tipo === "amonestacion") {
      const mapa = {
        tarjetas_amarillas: {
          icon: <FaSquareFull color="#facc15" />,
          label: "Amarilla",
        },
        tarjetas_rojas: {
          icon: <FaSquareFull color="#f87171" />,
          label: "Roja",
        },
        tarjetas_azules: {
          icon: <FaSquareFull color="#60a5fa" />,
          label: "Azul",
        },
        exclusion_2_min: { icon: <FaExclamationTriangle />, label: "2 min" },
      };
      const item = mapa[nombre];
      return item ? (
        <>
          {item.icon} {item.label}
        </>
      ) : (
        <>⚠️ Amonestación</>
      );
    }
    return <>📌 {nombre}</>;
  };

  const golesIds = getIdsPorTipo("goles");
  const lanzamientosIds = getIdsPorTipo("lanzamiento");
  const perdidasIds = getIdsPorTipo("perdida");

  const golesEquipo = acciones.filter((a) => golesIds.includes(a.acciones_id));
  const lanzamientosExtra = acciones.filter((a) =>
    lanzamientosIds.includes(a.acciones_id)
  );
  const perdidasEquipo = acciones.filter((a) =>
    perdidasIds.includes(a.acciones_id)
  );

  const totalLanzamientos = golesEquipo.length + lanzamientosExtra.length;
  const eficaciaEquipo =
    totalLanzamientos > 0
      ? Math.round((golesEquipo.length / totalLanzamientos) * 100)
      : 0;

  const goleadores = jugadoresPartido.filter((j) => j.golest > 0);

  const ordenarAccionesPorTiempo = (acciones) => {
    const toSegundos = (minuto) => {
      const [m, s] = minuto.split(":").map(Number);
      return m * 60 + s;
    };
    return [...acciones].sort(
      (a, b) => toSegundos(a.minuto) - toSegundos(b.minuto)
    );
  };

  const golesContraIds = getIdsPorTipo("gol_en_contra");

  return (
    <AuthWrapper requiredRole={null}>
      <Flex>
        <Box flex="1" bg="white" p={6}>
          <Header
            onOpen={onOpen}
            userName={userName}
            club={club}
            texto="Resumen del Partido"
          />
          <Sidebar isOpen={isOpen} onClose={onClose} />

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

          <Flex justify="center" align="center" mb={6} gap={8}>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">
                Tú Equipo
              </Text>
              <Box
                bg="teal.600"
                color="white"
                px={4}
                py={2}
                rounded="sm"
                fontWeight="bold"
              >
                {partido.goles_id_equipo}
              </Box>
            </Box>
            <Text fontWeight="bold" fontSize="lg">
              vs
            </Text>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">
                {nombreRival}
              </Text>
              <Box
                bg="red.400"
                color="white"
                px={4}
                py={2}
                rounded="sm"
                fontWeight="bold"
              >
                {partido.goles_id_equiporival ?? 0}
              </Box>
            </Box>
          </Flex>

          <Flex justify="center" mb={6} gap={6}>
            {["Resumen", "Goleadores", "Timeline", "Jugadores"].map(
              (tab) => (
                <Text
                  key={tab}
                  fontWeight="medium"
                  color={tab === tabSeleccionado ? "black" : "gray.500"}
                  fontSize="sm"
                  px={2}
                  cursor="pointer"
                  onClick={() => setTabSeleccionado(tab)}
                >
                  {tab}
                </Text>
              )
            )}
          </Flex>

          {/* TAB RESUMEN DEL PARTIDO */}
          {tabSeleccionado === "Resumen" && (
            <>
              <Box mb={4}>
                <Text textAlign="center" fontSize="sm" mb={2}>
                  {golesEquipo.length}/{totalLanzamientos} - Lanzamientos
                </Text>
                <Flex h="8px" bg="#f0f0f0" overflow="hidden">
                  <Box w={`${(totalLanzamientos / 80) * 100}%`} bg="teal.500" />
                </Flex>
              </Box>

              <Box mb={6}>
                <Text textAlign="center" fontSize="sm" mb={2}>
                  {perdidasEquipo.length} - Pérdidas
                </Text>
                <Flex h="8px" bg="#f0f0f0" overflow="hidden">
                  <Box
                    w={`${(perdidasEquipo.length / 20) * 100}%`}
                    bg="teal.500"
                  />
                </Flex>
              </Box>

              <SimpleGrid columns={1} spacing={10} maxW="150px" mx="auto">
                <Box textAlign="center">
                  <CircularProgress
                    value={eficaciaEquipo}
                    size="80px"
                    thickness="10px"
                    color="teal.500"
                  >
                    <CircularProgressLabel fontSize="md">
                      {eficaciaEquipo}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text mt={2} fontSize="sm">
                    Eficacia en Ataque
                  </Text>
                </Box>
              </SimpleGrid>
            </>
          )}

          {/* CONTENIDO TAB GOLEADORES */}
          {tabSeleccionado === "Goleadores" && (
            <Box>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                textAlign="center"
                mb={4}
              >
                Goleadores del Partido
              </Text>
              <TableContainer>
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Jugador</Th>
                      <Th>Dorsal</Th>
                      <Th isNumeric>Goles Totales</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {goleadores.map((j) => (
                      <Tr key={j.jugadores_id}>
                        <Td>{j.nombre}</Td>
                        <Td>{j.dorsal}</Td>
                        <Td isNumeric>{j.golest}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* CONTENIDO TAB TIMELINE */}
          {tabSeleccionado === "Timeline" && (
            <Box>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                textAlign="center"
                mb={6}
              >
                Timeline del Partido
              </Text>

              <VStack spacing={8} align="stretch" position="relative">
                <Box
                  position="absolute"
                  top={0}
                  bottom={0}
                  left="50%"
                  w="2px"
                  bg="green.400"
                  zIndex={0}
                />

                {ordenarAccionesPorTiempo(acciones).map((accion, index) => {
                  const esGolEnContra = golesContraIds.includes(
                    accion.acciones_id
                  );
                  const tipo = tiposAcciones.find(
                    (t) => t.id === accion.acciones_id
                  )?.tipo_accion;
                  const nombre = tiposAcciones.find(
                    (t) => t.id === accion.acciones_id
                  )?.nombre;

                  const iconos = {
                    goles: <FaFutbol color="green" />,
                    lanzamiento: <FaBullseye color="blue" />,
                    perdida: <FaTimes color="red" />,
                    recuperacion: <FaUndo color="teal" />,
                    gol_en_contra: <FaExclamationTriangle color="red" />,
                    tarjetas_amarillas: (
                      <FaSquare style={{ color: "#ECC94B" }} />
                    ),
                    tarjetas_rojas: <FaSquare style={{ color: "#E53E3E" }} />,
                    tarjetas_azules: <FaSquare style={{ color: "#3182CE" }} />,
                    exclusion_2_min: <FaHandPaper color="orange" />,
                  };

                  const icono = iconos[nombre] || iconos[tipo] || (
                    <FaRegQuestionCircle />
                  );

                  return (
                    <Flex
                      key={index}
                      justify={esGolEnContra ? "flex-end" : "flex-start"}
                      position="relative"
                      zIndex={1}
                    >
                      <Box
                        w="50%"
                        pr={esGolEnContra ? 0 : 6}
                        pl={esGolEnContra ? 6 : 0}
                      >
                        <HStack
                          spacing={3}
                          px={4}
                          py={2}
                          rounded="md"
                          justify={esGolEnContra ? "flex-start" : "flex-end"}
                        >
                          <Box>
                            <Text
                              fontWeight="semibold"
                              fontSize="sm"
                              color="gray.800"
                            >
                              {nombre
                                ?.replaceAll("_", " ")
                                ?.replace("tarjetas", "")
                                .toLowerCase()}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {accion.minuto}'
                            </Text>
                          </Box>
                          {icono}
                        </HStack>
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>
          )}

          {/* TAB JUGADORES */}
          {tabSeleccionado === "Jugadores" && (
            <Box>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                textAlign="center"
                mb={4}
              >
                Jugadores del Partido
              </Text>
              <TableContainer>
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Jugador</Th>
                      <Th>Dorsal</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {jugadoresPartido.map((j) => (
                      <Tr key={j.jugadores_id}>
                        <Td>{j.nombre}</Td>
                        <Td>{j.dorsal}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB TIROS */}
        </Box>
      </Flex>
    </AuthWrapper>
  );
};

export default ResumenPartido;
