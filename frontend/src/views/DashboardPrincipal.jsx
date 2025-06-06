import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Icon,
  Button,
  Grid,
  Divider,
  useDisclosure,
  Avatar,
  GridItem,
  Collapse,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { FaBars, FaArrowUp, FaArrowDown } from "react-icons/fa";

import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header";

// Función para decodificar el token JWT y extraer el id del club
function getClubIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.club_id || payload.club || payload.id || null;
  } catch {
    return null;
  }
}

const DashboardPrincipal = () => {
  const { onOpen } = useDisclosure();
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });
  const [equipo, setEquipo] = useState({ id: "", nombre: "", logo: "" });
  const [ultimosPartidos, setUltimosPartidos] = useState([]);
  const [golesFavor, setGolesFavor] = useState(0);
  const [golesContra, setGolesContra] = useState(0);
  const [jugadores, setJugadores] = useState([]);
  const [mostrarTodosGoleadores, setMostrarTodosGoleadores] = useState(false);
  const [mostrarTodosLanzadores, setMostrarTodosLanzadores] = useState(false);
  const [mostrarTodosPartidos, setMostrarTodosPartidos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partidoIndex, setPartidoIndex] = useState(0);
  const [mostrarTodosAmonestados, setMostrarTodosAmonestados] = useState(false);
  const [mostrarTodosDefensivos, setMostrarTodosDefensivos] = useState(false);
  const [mostrarTodosPerdidas, setMostrarTodosPerdidas] = useState(false);

  // Carga todos los datos principales y muestra el spinner mientras loading sea true
  useEffect(() => {
    const token = localStorage.getItem("token");
    const clubId = getClubIdFromToken(token);
    const equipoId = localStorage.getItem("id_equipo");

    if (!clubId || !equipoId) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch("https://myhandstats.onrender.com/usuario/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch("https://myhandstats.onrender.com/club", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`https://myhandstats.onrender.com/equipo/${equipoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`https://myhandstats.onrender.com/equipo/${equipoId}/jugadores`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      fetch(`https://myhandstats.onrender.com/equipo/${equipoId}/partidos/`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(
        ([usuarioData, clubData, equipoData, jugadoresData, partidosData]) => {
          setUserName(usuarioData.info?.nombre || "Usuario");
          // Club
          let clubObj = null;
          if (Array.isArray(clubData.info)) {
            clubObj = clubData.info.find((c) => c.id == clubId);
          } else {
            clubObj = clubData;
          }
          setClub({
            nombre: clubObj?.nombre || "Club no encontrado",
            logo: clubObj?.logo || "",
          });
          // Equipo
          setEquipo({
            id: equipoData?.id || "",
            nombre: equipoData?.nombre || "Equipo no encontrado",
            logo: equipoData?.logo || "",
          });
          // Jugadores y goles
          if (Array.isArray(jugadoresData)) {
            setJugadores(jugadoresData);
            const totalGolesFavor = jugadoresData.reduce(
              (acc, jugador) => acc + (jugador.golest || 0),
              0
            );
            setGolesFavor(totalGolesFavor);
            const totalGolesContra = jugadoresData.reduce(
              (acc, jugador) => acc + (jugador.gol_en_contra_t || 0),
              0
            );
            setGolesContra(totalGolesContra);
          } else {
            setJugadores([]);
            setGolesFavor(0);
            setGolesContra(0);
          }
          // Partidos
          setUltimosPartidos(Array.isArray(partidosData) ? partidosData : []);
          setLoading(false);
        }
      )
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const golesData = {
    labels: ["Goles a favor", "Goles en contra"],
    datasets: [
      {
        data: [golesFavor, golesContra],
        backgroundColor: ["#014C4C", "#e2e8f0"],
        borderWidth: 1,
      },
    ],
  };

  // Calcular porcentaje de partidos ganados
  const totalPartidos = ultimosPartidos.length;
  const partidosGanados = ultimosPartidos.filter(
    (partido) =>
      (partido.goles_id_equipo ?? 0) > (partido.goles_id_equiporival ?? 0)
  ).length;
  const porcentajeGanados =
    totalPartidos > 0 ? Math.round((partidosGanados / totalPartidos) * 100) : 0;
  const esPorcentajeAlto = porcentajeGanados >= 50;

  // Prepara los datos para el gráfico de barras
  const partidosOrdenados = ultimosPartidos
    .slice()
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .slice(-5); // últimos 5 partidos

  const partidoActual = partidosOrdenados[partidoIndex] || {};

  const barData = {
    labels: ["Goles a favor", "Goles en contra"],
    datasets: [
      {
        label: partidoActual.equiporival_id || "Rival",
        data: [
          partidoActual.goles_id_equipo,
          partidoActual.goles_id_equiporival,
        ],
        backgroundColor: ["#319795", "#CBD5E1"],
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { beginAtZero: true, min: 0, max: 10, ticks: { stepSize: 5 } },
    },
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="teal.600" thickness="4px" speed="0.7s" />
      </Box>
    );
  }

  return (
    <AuthWrapper requiredRole={null}>
      <Box p={4} minH="100vh" bg="white">
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

        {/* Header con título y hamburguesa */}
        <Header
          onOpen={onOpen}
          userName={userName}
          club={club}
          equipo={equipo}
          texto={equipo.nombre || "Mi Equipo"}
        />

        {/* Sustituye el Grid por Flex */}
        <Flex
          direction="column"
          gap={4}
          width="100%"
          mx="auto"
          zIndex={1}
          position="relative"
        >
          {/* Primera fila: Goles últimos partidos y Fases del Juego */}
          <Flex gap={4} flexDirection={{ base: "column", md: "row" }}>
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              minH="320px"
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              bg="whiteAlpha.900"
            >
              {/* ...contenido de la primera tarjeta... */}
              {/* Goles totales */}
              <Flex justify="space-between" mb={2} align="center">
                <Flex align="center" gap={2}>
                  <Text fontWeight="bold">Goles totales</Text>
                </Flex>
              </Flex>
              <Box h="200px" maxW="320px" mx="auto" position="relative">
                <Doughnut data={golesData} />
                <Flex
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  flexDirection="column"
                  align="center"
                  pointerEvents="none"
                  zIndex={1}
                ></Flex>
              </Box>
              <Flex justify="center" align="center" gap={6} mt={2}>
                <Flex align="center" gap={1}>
                  <Box h={2} w={2} borderRadius="full" bg="#014C4C" />
                  <Text fontSize="sm" fontWeight="bold" color="#014C4C">
                    {golesFavor}
                  </Text>
                  <Text fontSize="xs" color="gray.600" ml={1}>
                    a favor
                  </Text>
                </Flex>
                <Flex align="center" gap={1}>
                  <Box h={2} w={2} borderRadius="full" bg="gray.300" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    {golesContra}
                  </Text>
                  <Text fontSize="xs" color="gray.600" ml={1}>
                    en contra
                  </Text>
                </Flex>
              </Flex>
              <Divider my={4} />
            </Box>
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              minH="320px"
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              bg="whiteAlpha.900"
            >
              {/* ...contenido de la segunda tarjeta... */}
              {/* Comparativa últimos partidos */}
              <Flex justify="space-between" mb={2} align="center">
                <Flex align="center" gap={2}>
                  <Text fontWeight="bold">Comparativa últimos partidos</Text>
                  <Text fontSize="md" color="gray.600" fontWeight="semibold">
                    {partidoActual.goles_id_equipo ?? 0} -{" "}
                    {partidoActual.goles_id_equiporival ?? 0}
                  </Text>
                </Flex>
                <Flex gap={2}>
                  <Button
                    size="xs"
                    onClick={() => setPartidoIndex((i) => Math.max(i - 1, 0))}
                    isDisabled={partidoIndex === 0}
                  >
                    {"<"}
                  </Button>
                  <Button
                    size="xs"
                    onClick={() =>
                      setPartidoIndex((i) =>
                        Math.min(i + 1, partidosOrdenados.length - 1)
                      )
                    }
                    isDisabled={partidoIndex === partidosOrdenados.length - 1}
                  >
                    {">"}
                  </Button>
                </Flex>
              </Flex>
              {partidosOrdenados.length > 0 ? (
                <>
                  <Text fontSize="sm" mb={2}>
                    Rival: <b>{partidoActual.equiporival_id || "Rival"}</b>{" "}
                    <br />
                    Fecha:{" "}
                    <b>
                      {partidoActual.fecha
                        ? new Date(partidoActual.fecha).toLocaleDateString()
                        : "Sin fecha"}
                    </b>
                  </Text>
                  <Box h="200px" w="100%" maxW="320px" mx="auto">
                    <Bar data={barData} options={barOptions} />
                  </Box>
                </>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
          </Flex>

          {/* Segunda fila: Lanzamientos 7m, Goleadores, Amonestaciones, Historial de partidos */}
          <Flex
            gap={4}
            mb={2}
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            flexWrap="wrap"
          >
            {/* Lanzamientos 7m */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              flex="1"
              bg="whiteAlpha.900"
              minW="250px"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">Lanzamientos 7m</Text>
                {jugadores.length > 5 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMostrarTodosLanzadores((v) => !v)}
                    transition="all 0.2s"
                    _active={{
                      transform: "scale(0.95)",
                      bg: "#e6fffa",
                    }}
                    _hover={{
                      bg: "#f0fdfa",
                      transform: "scale(1.05)",
                    }}
                  >
                    {mostrarTodosLanzadores ? "Ver top 5" : "Ver todos"}
                  </Button>
                )}
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Los máximos lanzadores de 7 metros del equipo
              </Text>
              {Array.isArray(jugadores) && jugadores.length > 0 ? (
                <Box overflowX="auto">
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Jugador
                        </th>
                        <th style={{ textAlign: "right", padding: "4px" }}>
                          Lanzamientos 7m
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jugadores
                        .sort(
                          (a, b) =>
                            (b.lanzamiento_7m || 0) - (a.lanzamiento_7m || 0)
                        )
                        .slice(
                          0,
                          mostrarTodosLanzadores ? jugadores.length : 5
                        )
                        .map((jugador) => (
                          <tr key={jugador.id}>
                            <td style={{ padding: "4px" }}>
                              {jugador.nombre}
                            </td>
                            <td
                              style={{ textAlign: "right", padding: "4px" }}
                            >
                              {jugador.lanzamiento_7m || 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
            {/* Goleadores */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              flex="1"
              bg="whiteAlpha.900"
              minW="250px"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">Goleadores</Text>
                {jugadores.length > 5 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMostrarTodosGoleadores((v) => !v)}
                    transition="all 0.2s"
                    _active={{
                      transform: "scale(0.95)",
                      bg: "#e6fffa",
                    }}
                    _hover={{
                      bg: "#f0fdfa",
                      transform: "scale(1.05)",
                    }}
                  >
                    {mostrarTodosGoleadores ? "Ver top 5" : "Ver todos"}
                  </Button>
                )}
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Los máximos goleadores del equipo
              </Text>
              {Array.isArray(jugadores) && jugadores.length > 0 ? (
                <Box overflowX="auto">
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      transition: "all 0.3s",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Jugador
                        </th>
                        <th style={{ textAlign: "right", padding: "4px" }}>
                          Goles
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jugadores
                        .sort((a, b) => (b.golest || 0) - (a.golest || 0))
                        .slice(
                          0,
                          mostrarTodosGoleadores ? jugadores.length : 5
                        )
                        .map((jugador) => (
                          <tr key={jugador.id}>
                            <td style={{ padding: "4px" }}>
                              {jugador.nombre}
                            </td>
                            <td
                              style={{ textAlign: "right", padding: "4px" }}
                            >
                              {jugador.golest || 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
            {/* Amonestaciones */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              flex="1"
              bg="whiteAlpha.900"
              minW="250px"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">Amonestaciones</Text>
                {jugadores.length > 5 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMostrarTodosAmonestados?.((v) => !v)}
                    transition="all 0.2s"
                    _active={{
                      transform: "scale(0.95)",
                      bg: "#e6fffa",
                    }}
                    _hover={{
                      bg: "#f0fdfa",
                      transform: "scale(1.05)",
                    }}
                  >
                    {mostrarTodosAmonestados ? "Ver top 5" : "Ver todos"}
                  </Button>
                )}
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Jugadores con más tarjetas (rojas, amarillas, azules, 2 min)
              </Text>
              {Array.isArray(jugadores) && jugadores.length > 0 ? (
                <Box overflowX="auto">
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Jugador
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#e53e3e",
                          }}
                        >
                          Rojas
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#ecc94b",
                          }}
                        >
                          Amarillas
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#3182ce",
                          }}
                        >
                          Azules
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#805ad5",
                          }}
                        >
                          2 min
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jugadores
                        .sort(
                          (a, b) =>
                            (b.tarjetas_rojas || 0) +
                            (b.tarjetas_amarillas || 0) +
                            (b.tarjetas_azules || 0) +
                            (b.exclusion_2_min || 0) -
                            ((a.tarjetas_rojas || 0) +
                              (a.tarjetas_amarillas || 0) +
                              (a.tarjetas_azules || 0) +
                              (a.exclusion_2_min || 0))
                        )
                        .slice(
                          0,
                          mostrarTodosAmonestados ? jugadores.length : 5
                        )
                        .map((jugador) => (
                          <tr key={jugador.id}>
                            <td style={{ padding: "4px" }}>
                              {jugador.nombre}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "4px",
                                color: "#e53e3e",
                              }}
                            >
                              {jugador.tarjetas_rojas || 0}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "4px",
                                color: "#ecc94b",
                              }}
                            >
                              {jugador.tarjetas_amarillas || 0}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "4px",
                                color: "#3182ce",
                              }}
                            >
                              {jugador.tarjetas_azules || 0}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "4px",
                                color: "#805ad5",
                              }}
                            >
                              {jugador.exclusion_2_min || 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
            {/* Historial de partidos */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              flex="1"
              bg="whiteAlpha.900"
              minW="250px"
            >
              <Flex justify="space-between" mb={2} align="center">
                <Text fontWeight="bold">Historial de partidos</Text>
                {ultimosPartidos.length > 5 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMostrarTodosPartidos((v) => !v)}
                    transition="all 0.2s"
                    _active={{
                      transform: "scale(0.95)",
                      bg: "#e6fffa",
                    }}
                    _hover={{
                      bg: "#f0fdfa",
                      transform: "scale(1.05)",
                    }}
                  >
                    {mostrarTodosPartidos ? "Ver últimos 5" : "Ver todos"}
                  </Button>
                )}
              </Flex>
              <Flex align="center" gap={2} mb={2}>
                <Text fontSize={"sm"}>Porcentaje de victorias:</Text>
                <Text
                  color={esPorcentajeAlto ? "green.600" : "red.600"}
                  fontWeight="bold"
                >
                  {porcentajeGanados}%
                </Text>
                <Icon
                  as={esPorcentajeAlto ? FaArrowUp : FaArrowDown}
                  color={esPorcentajeAlto ? "green.600" : "red.600"}
                  boxSize={4}
                />
              </Flex>
              {Array.isArray(ultimosPartidos) &&
              ultimosPartidos.length > 0 ? (
                <Box overflowX="auto">
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Rival
                        </th>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Fecha
                        </th>
                        <th style={{ textAlign: "right", padding: "4px" }}>
                          Resultado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimosPartidos
                        .slice()
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                        .slice(
                          0,
                          mostrarTodosPartidos ? ultimosPartidos.length : 5
                        )
                        .map((partido) => {
                          const golesFavor = partido.goles_id_equipo ?? 0;
                          const golesContra =
                            partido.goles_id_equiporival ?? 0;
                          let bgColor = "";
                          if (golesFavor > golesContra) bgColor = "#d1fae5";
                          else if (golesFavor < golesContra)
                            bgColor = "#fee2e2";

                          return (
                            <tr
                              key={partido.id}
                              style={{ borderBottom: "1px solid #e2e8f0" }}
                            >
                              <td style={{ padding: "4px" }}>
                                {partido.equiporival_id || "Desconocido"}
                              </td>
                              <td style={{ padding: "4px" }}>
                                {partido.fecha
                                  ? new Date(
                                      partido.fecha
                                    ).toLocaleDateString()
                                  : "Sin fecha"}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                  backgroundColor: bgColor,
                                  borderRadius: "6px",
                                  fontWeight: "bold",
                                }}
                              >
                                {golesFavor} - {golesContra}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
          </Flex>

          {/* Tercera fila: Aspecto defensivo y pérdidas */}
          <Flex
            gap={4}
            mb={2}
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            flexWrap="wrap"
          >
            {/* Aspecto defensivo */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              flex="1"
              bg="whiteAlpha.900"
              minW="250px"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">Aspecto defensivo</Text>
                {jugadores.length > 5 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMostrarTodosDefensivos?.((v) => !v)}
                    transition="all 0.2s"
                    _active={{
                      transform: "scale(0.95)",
                      bg: "#e6fffa",
                    }}
                    _hover={{
                      bg: "#f0fdfa",
                      transform: "scale(1.05)",
                    }}
                  >
                    {mostrarTodosDefensivos ? "Ver top 5" : "Ver todos"}
                  </Button>
                )}
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Jugadores con más blocajes y robos
              </Text>
              {Array.isArray(jugadores) && jugadores.length > 0 ? (
                <Box overflowX="auto">
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Jugador
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#38a169",
                          }}
                        >
                          Blocajes
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#3182ce",
                          }}
                        >
                          Robos
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jugadores
                        .sort(
                          (a, b) =>
                            (b.blocaje || 0) +
                            (b.robo || 0) -
                            ((a.blocaje || 0) + (a.robo || 0))
                        )
                        .slice(
                          0,
                          mostrarTodosDefensivos ? jugadores.length : 5
                        )
                        .map((jugador) => (
                          <tr key={jugador.id}>
                            <td style={{ padding: "4px" }}>
                              {jugador.nombre}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "4px",
                                color: "#38a169",
                              }}
                            >
                              {jugador.blocaje || 0}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                padding: "4px",
                                color: "#3182ce",
                              }}
                            >
                              {jugador.robo || 0}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
            {/* Pérdidas */}
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              flex="1"
              bg="whiteAlpha.900"
              minW="250px"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold">Pérdidas</Text>
                {jugadores.length > 5 && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setMostrarTodosPerdidas?.((v) => !v)}
                    transition="all 0.2s"
                    _active={{
                      transform: "scale(0.95)",
                      bg: "#e6fffa",
                    }}
                    _hover={{
                      bg: "#f0fdfa",
                      transform: "scale(1.05)",
                    }}
                  >
                    {mostrarTodosPerdidas ? "Ver top 5" : "Ver todos"}
                  </Button>
                )}
              </Flex>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Jugadores con más pérdidas (fallos y faltas técnicas)
              </Text>
              {Array.isArray(jugadores) && jugadores.length > 0 ? (
                <Box overflowX="auto">
                  <table
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "4px" }}>
                          Jugador
                        </th>
                        <th style={{ textAlign: "center", padding: "4px" }}>
                          F. Pase
                        </th>
                        <th style={{ textAlign: "center", padding: "4px" }}>
                          F. Recepción
                        </th>
                        <th style={{ textAlign: "center", padding: "4px" }}>
                          Pasos
                        </th>
                        <th style={{ textAlign: "center", padding: "4px" }}>
                          F. Ataque
                        </th>
                        <th style={{ textAlign: "center", padding: "4px" }}>
                          Dobles
                        </th>
                        <th style={{ textAlign: "center", padding: "4px" }}>
                          Inv. Área
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "4px",
                            color: "#e53e3e",
                          }}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jugadores
                        .sort(
                          (a, b) =>
                            (b.fallo_pase || 0) +
                            (b.fallo_recepcion || 0) +
                            (b.pasos || 0) +
                            (b.falta_en_ataque || 0) +
                            (b.dobles || 0) +
                            (b.invasion_area || 0) -
                            ((a.fallo_pase || 0) +
                              (a.fallo_recepcion || 0) +
                              (a.pasos || 0) +
                              (a.falta_en_ataque || 0) +
                              (a.dobles || 0) +
                              (a.invasion_area || 0))
                        )
                        .slice(0, mostrarTodosPerdidas ? jugadores.length : 5)
                        .map((jugador) => {
                          const total =
                            (jugador.fallo_pase || 0) +
                            (jugador.fallo_recepcion || 0) +
                            (jugador.pasos || 0) +
                            (jugador.falta_en_ataque || 0) +
                            (jugador.dobles || 0) +
                            (jugador.invasion_area || 0);
                          return (
                            <tr key={jugador.id}>
                              <td style={{ padding: "4px" }}>
                                {jugador.nombre}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {jugador.fallo_pase || 0}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {jugador.fallo_recepcion || 0}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {jugador.pasos || 0}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {jugador.falta_en_ataque || 0}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {jugador.dobles || 0}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                }}
                              >
                                {jugador.invasion_area || 0}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                  padding: "4px",
                                  color: "#e53e3e",
                                  fontWeight: "bold",
                                }}
                              >
                                {total}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Text fontSize="sm">Aún no hay registros</Text>
              )}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </AuthWrapper>
  );
};

export default DashboardPrincipal;
