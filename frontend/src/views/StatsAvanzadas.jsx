import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Tab,
  Tabs,
  TabList,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  useDisclosure,
  Icon,
  Avatar,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

function getClubIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.club_id || payload.club || payload.id || null;
  } catch {
    return null;
  }
}
// Carga todos los datos principales y muestra el spinner mientras loading sea true

const StatsAvanzadas = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });
  const [equipo, setEquipo] = useState({ id: "", nombre: "", logo: "" });

  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partidos, setPartidos] = useState([]);
  // Cambia la inicialización para evitar undefined
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const [statsPartidoSeleccionado, setStatsPartidoSeleccionado] = useState(null);

  // Estado para saber qué tab está activo
  const [tabIndex, setTabIndex] = useState(0);

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
      fetch(`https://myhandstats.onrender.com/accion_partido`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),


    ])
      .then(([usuarioData, clubData, equipoData, jugadoresData, partidosData, statsPartidoSeleccionadoData]) => {
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
        } else {
          setJugadores([]);
        }
        // Partidos
        setPartidos(partidosData);
        // Stats del partido seleccionado
        if (Array.isArray(statsPartidoSeleccionadoData)) {
          const partidoId = partidosData.length > 0 ? partidosData[0].id : null;
          const partidoStats = statsPartidoSeleccionadoData.find(
            (p) => p.partido_id === partidoId
          );
        // Selecciona el primer partido automáticamente si hay datos
        if (Array.isArray(partidosData) && partidosData.length > 0) {
          setPartidoSeleccionado(partidosData[0]);
        } else {
          setPartidoSeleccionado(null);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
  }, []);
  // Ajuste de padding para móvil
  const boxPadding = useBreakpointValue({ base: 2, md: 6 });

  // Calcula infoEquipo de forma memoizada
  const infoEquipo = useMemo(() => {
    let totalGolesFavor = 0;
    let totalLanzamientos = 0;
    let totalPerdidas = 0;
    let totalGoles7m = 0;
    let totalParadas = 0;
    let totalFaltas = 0;
    let totalRecuperacion = 0;
    let totalGolesEnContra = 0;

    jugadores.forEach((jugador) => {
      totalGolesFavor += jugador.golest || 0;
      totalLanzamientos += jugador.lanzamientos || 0;
      totalPerdidas += jugador.perdidas || 0;
      totalGoles7m += jugador.goles7m || 0;
      totalParadas += jugador.paradas || 0;
      totalFaltas += jugador.faltas || 0;
      totalRecuperacion += jugador.recuperacion || 0;
      totalGolesEnContra += jugador.gol_en_contra_t || 0;
    });

    return {
      ofensiva: {
        golest: totalGolesFavor,
        lanzamientos: totalLanzamientos,
        perdidas: totalPerdidas,
        goles7m: totalGoles7m,
      },
      defensiva: {
        paradas: totalParadas,
        faltas: totalFaltas,
        recuperacion: totalRecuperacion,
        goles_en_contra_t: totalGolesEnContra,
      },
    };
  }, [jugadores]);

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
    <Box bg="white" minH="100vh" p={{ base: 1, md: 6 }}>
      {/* Header */}
      <Sidebar isOpen={isOpen} onClose={onClose} />

      <Flex align="center" justify="space-between" mb={8}>
        <Flex align="center" gap={3}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          {/* Logo de la aplicación al lado del icono de hamburguesa */}
          <Image
            src="https://rdpazmfdbcundrogccsb.supabase.co/storage/v1/object/sign/imagenes/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzUwNmYzZWZkLTg5ZDktNGI0YS1hZjMwLTdjYzQyY2Q0MjcyMCJ9.eyJ1cmwiOiJpbWFnZW5lcy9sb2dvLnBuZyIsImlhdCI6MTc0ODQxODA1OCwiZXhwIjoyMzc5MTM4MDU4fQ.P1k167Q5lOLNPH_COkQdv8FCca2cSVSmwnrE1PXUPPk"
            alt="Logo aplicación"
            boxSize="60px"
            borderRadius="full"
            objectFit="cover"
          />
        </Flex>
        <Flex align="center" gap={3}>
          <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={0}>
            {equipo.nombre}
          </Text>
          <Avatar name={club.nombre} src={club.logo} />
          <Text fontSize="sm" color="gray.500">
            Estadísticas Avanzadas
          </Text>
        </Flex>

        <Flex align="center" gap={2}>
          <Text fontSize="m" fontWeight={"medium"} color="#014C4C">
            {userName}
          </Text>
          {/* Mostrar avatar de usuario si existe foto en el token */}
          {(() => {
            const token = localStorage.getItem("token");
            let foto = "";
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                foto = payload.foto || "";
              } catch (error) {
                console.error("Error al decodificar el token:", error);
              }
            }
            return foto ? (
              <Avatar size="sm" src={foto} name={userName} />
            ) : (
              <Avatar size="sm" name={userName} />
            );
          })()}
        </Flex>
      </Flex>

      {/* Tabs */}
      <Tabs
        variant="unstyled"
        mt={2}
        mb={6}
        w="100%"
        index={tabIndex}
        onChange={setTabIndex}
      >
        <TabList
          borderBottom="1px solid #e2e8f0"
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
        >
          <Tab
            _selected={{
              color: "#014C4C",
              borderBottom: "2px solid #014C4C",
              fontWeight: "bold",
              bg: "gray.50",
            }}
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 2, md: 4 }}
          >
            General
          </Tab>
          <Tab fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 4 }}>
            Por Partido
          </Tab>
          <Tab fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 4 }}>
            Por Jugador
          </Tab>
          <Tab fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 4 }}>
            Jugadores
          </Tab>
          <Tab fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 4 }}>
            Tiros
          </Tab>
        </TabList>
      </Tabs>

      {/* Renderizado condicional según el tab activo */}
      {tabIndex === 0 && (
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align="flex-start"
          flexWrap="wrap"
        >
          {/* Tablas de ataque y defensa */}
          <Box flex="2" minW={{ base: "100%", md: "60%" }}>
            {/* Ataque */}
            <Box
              border="2px solid #31979530"
              borderRadius="md"
              mb={4}
              p={boxPadding}
              bg="white"
              overflowX="auto"
            >
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Goles</Th>
                    <Th>Lanzamientos</Th>
                    <Th>Perdidas</Th>
                    <Th>Goles 7M</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr bg="gray.50">
                    <Td fontWeight="semibold">Ofensiva</Td>
                    <Td>{infoEquipo.ofensiva.golest}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos}</Td>
                    <Td>{infoEquipo.ofensiva.perdidas}</Td>
                    <Td>{infoEquipo.ofensiva.goles7m}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            {/* Defensa */}
            <Box
              border="2px solid #31979530"
              borderRadius="md"
              mb={4}
              p={boxPadding}
              bg="white"
              overflowX="auto"
            >
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Paradas</Th>
                    <Th>Faltas</Th>
                    <Th>Recuperación</Th>
                    <Th>Goles en Contra</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr bg="gray.50">
                    <Td fontWeight="semibold">Defensiva</Td>
                    <Td>{infoEquipo.defensiva.paradas}</Td>
                    <Td>{infoEquipo.defensiva.faltas}</Td>
                    <Td>{infoEquipo.defensiva.recuperacion}</Td>
                    <Td>{infoEquipo.defensiva.goles_en_contra_t}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
          {/* Tabla de jugadores */}
          <Box
            flex="1"
            minW={{ base: "100%", md: "35%" }}
            border="2px solid #31979530"
            borderRadius="md"
            p={boxPadding}
            bg="white"
            overflowX="auto"
          >
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Goles/7M</Th>
                  <Th>Paradas/7M</Th>
                </Tr>
              </Thead>
              <Tbody>
                {jugadores.map((row, idx) => (
                  <Tr key={idx} bg={idx % 2 === 0 ? "gray.50" : "white"}>
                    <Td fontWeight="semibold">{row.nombre}</Td>
                    <Td>
                      {row.goles7m} / {row.lanzamiento_7m}
                    </Td>
                    <Td>
                      {row.paradas7m} / {row.paradas}{" "}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      )}
      {tabIndex === 1 && (
        <Box>
          {/* Selector de partido */}
          <Box mb={4}>
            <select
              style={{
                width: "100%",
                fontSize: "18px",
                padding: "6px",
              }}
              value={partidoSeleccionado?.id || ""}
              onChange={(e) => {
                const partido = partidos.find(
                  (p) => String(p.id) === e.target.value
                );
                setPartidoSeleccionado(partido);
              }}
            >
              {partidos.length === 0 && (
                <option value="">No hay partidos</option>
              )}
              {partidos.map((partido) => (
                <option key={partido.id} value={partido.id}>
                  {/* Muestra la info más relevante disponible */}
                  {partido.nombre
                    || partido.jornada
                    || (partido.equiporival_id ? `Rival: ${partido.equiporival_id}` : "")
                    || (partido.fecha ? ` - ${String(partido.fecha).split("T")[0]}` : "")
                    || `Partido ${partido.id}`}
                </option>
              ))}
            </select>
          </Box>
          {/* Tablas de partes */}
          {partidoSeleccionado && partidoSeleccionado.partes && (
            <Flex gap={6} flexWrap="wrap">
              {partidoSeleccionado.partes.map((parte, idx) => (
                <Box
                  key={idx}
                  border="2px solid #319795"
                  borderRadius="md"
                  p={3}
                  minW="350px"
                  mb={4}
                  flex="1"
                >
                  <Text fontWeight="bold" mb={2}>
                    {parte.nombre}
                  </Text>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>Lanzamientos</Th>
                        <Th>Goles</Th>
                        <Th>Pérdidas</Th>
                        <Th>Faltas</Th>
                        <Th>A Puerta</Th>
                        <Th>Goles 7M</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {parte.datos.map((fila, i) => (
                        <Tr key={i}>
                          <Td fontWeight="semibold">{fila.tipo}</Td>
                          <Td>{fila.lanzamientos}</Td>
                          <Td>{fila.goles}</Td>
                          <Td>{fila.perdidas}</Td>
                          <Td>{fila.faltas}</Td>
                          <Td>{fila.aPuerta}</Td>
                          <Td>{fila.goles7m}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {/* Sanciones */}
                  <Box border="1px solid #319795" borderRadius="md" mt={4} p={2}>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>2 Minutos</Th>
                          <Th>Amarillas</Th>
                          <Th>Rojas</Th>
                          <Th>Azul</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{parte.sanciones.min2}</Td>
                          <Td>{parte.sanciones.amarillas}</Td>
                          <Td>{parte.sanciones.rojas}</Td>
                          <Td>{parte.sanciones.azul}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box>
          {/* Aquí el contenido de Por Jugador */}
          <Text>Estadísticas por jugador</Text>
        </Box>
      )}
      {tabIndex === 3 && (
        <Box>
          {/* Aquí el contenido de Jugadores */}
          <Text>Listado de jugadores</Text>
        </Box>
      )}
      {tabIndex === 4 && (
        <Box>
          {/* Aquí el contenido de Tiros */}
          <Text>Estadísticas de tiros</Text>
        </Box>
      )}
    </Box>
  );
};

export default StatsAvanzadas;
