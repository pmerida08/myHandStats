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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from "@chakra-ui/react";
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
  const [statsPartidoSeleccionado, setStatsPartidoSeleccionado] =
    useState(null);

  // Estado para saber qué tab está activo
  const [tabIndex, setTabIndex] = useState(0);

  // Primer useEffect: carga datos generales y partidos
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
          } else {
            setJugadores([]);
          }
          // Partidos
          setPartidos(partidosData);
          // Selecciona el primer partido automáticamente si hay datos
          if (Array.isArray(partidosData) && partidosData.length > 0) {
            setPartidoSeleccionado(partidosData[0]);
          } else {
            setPartidoSeleccionado(null);
          }
          setLoading(false);
        }
      )
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Segundo useEffect: solo cuando hay partidoSeleccionado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const equipoId = localStorage.getItem("id_equipo");
    if (!partidoSeleccionado || !equipoId) {
      setStatsPartidoSeleccionado(null);
      return;
    }
    fetch(
      `https://myhandstats.onrender.com/equipo/${equipoId}/partido/${partidoSeleccionado.id}/jugadores_partido/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setStatsPartidoSeleccionado(data);
      })
      .catch(() => setStatsPartidoSeleccionado(null));
  }, [partidoSeleccionado]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const equipoId = localStorage.getItem("id_equipo");

    fetch(`https://myhandstats.onrender.com/equipo/${equipoId}/jugadores/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setJugadores(data);
      })
      .catch((error) => {
        console.error("Error al cargar los jugadores:", error);
      });
  }, [equipo]);

  // Cuarto useEffect: solo cuando hay jugadorSeleccionado
  // https://myhandstats.onrender.com/equipo/27/jugador/7/partidos/

  // Ajuste de padding para móvil
  const boxPadding = useBreakpointValue({ base: 2, md: 6 });

  // Calcula infoEquipo de forma memoizada
  const infoEquipo = useMemo(() => {
    // Ofensiva
    let totalLanzamientos = 0;
    let totalLanzamiento_7m = 0,
      totalLanzamiento_ed = 0,
      totalLanzamiento_ei = 0,
      totalLanzamiento_ld = 0,
      totalLanzamiento_li = 0,
      totalLanzamiento_c = 0,
      totalLanzamiento_pi = 0;
    let totalLanzamiento_ext_li = 0,
      totalLanzamiento_ext_ld = 0,
      totalLanzamiento_ext_c = 0;

    let totalGoles = 0;
    let totalGolesli = 0,
      totalGolesld = 0,
      totalGolesei = 0,
      totalGolesed = 0,
      totalGolesc = 0,
      totalGoles7m = 0,
      totalGolespi = 0;

    // Defensiva
    // perdida
    let totalFalloPase = 0,
      totalFalloRecepcion = 0,
      totalPasos = 0,
      totalFaltaEnAtaque = 0,
      totalDobles = 0,
      totalInvasionArea = 0;
    // recuperacion
    let totalBlocaje = 0,
      totalRobo = 0;
    // lanzamiento_en_contra
    let totalLanzamientoEnContra_ei = 0,
      totalLanzamientoEnContra_ed = 0,
      totalLanzamientoEnContra_li = 0,
      totalLanzamientoEnContra_ld = 0,
      totalLanzamientoEnContra_c = 0,
      totalLanzamientoEnContra_pi = 0,
      totalLanzamientoEnContra_7m = 0;
    // gol_en_contra
    let totalGolEnContra_ei = 0,
      totalGolEnContra_ed = 0,
      totalGolEnContra_li = 0,
      totalGolEnContra_ld = 0,
      totalGolEnContra_c = 0,
      totalGolEnContra_pi = 0,
      totalGolEnContra_7m = 0;
    // amonestacion
    let totalAmarillas = 0,
      totalAzules = 0,
      totalRojas = 0,
      totalExclusion2Min = 0;

    jugadores.forEach((jugador) => {
      // Ofensiva - lanzamientos
      totalLanzamiento_7m += jugador.lanzamiento_7m || 0;
      totalLanzamiento_ed += jugador.lanzamiento_ed || 0;
      totalLanzamiento_ei += jugador.lanzamiento_ei || 0;
      totalLanzamiento_ld += jugador.lanzamiento_ld || 0;
      totalLanzamiento_li += jugador.lanzamiento_li || 0;
      totalLanzamiento_c += jugador.lanzamiento_c || 0;
      totalLanzamiento_pi += jugador.lanzamiento_pi || 0;
      totalLanzamiento_ext_li += jugador.lanzamiento_ext_li || 0;
      totalLanzamiento_ext_ld += jugador.lanzamiento_ext_ld || 0;
      totalLanzamiento_ext_c += jugador.lanzamiento_ext_c || 0;
      totalLanzamientos +=
        (jugador.lanzamiento_7m || 0) +
        (jugador.lanzamiento_ed || 0) +
        (jugador.lanzamiento_ei || 0) +
        (jugador.lanzamiento_ld || 0) +
        (jugador.lanzamiento_li || 0) +
        (jugador.lanzamiento_c || 0) +
        (jugador.lanzamiento_pi || 0) +
        (jugador.lanzamiento_ext_li || 0) +
        (jugador.lanzamiento_ext_ld || 0) +
        (jugador.lanzamiento_ext_c || 0);

      // Ofensiva - goles
      totalGolesli += jugador.golesli || 0;
      totalGolesld += jugador.golesld || 0;
      totalGolesei += jugador.golesei || 0;
      totalGolesed += jugador.golesed || 0;
      totalGolesc += jugador.golesc || 0;
      totalGoles7m += jugador.goles7m || 0;
      totalGolespi += jugador.golespi || 0;
      totalGoles +=
        (jugador.golesli || 0) +
        (jugador.golesld || 0) +
        (jugador.golesei || 0) +
        (jugador.golesed || 0) +
        (jugador.golesc || 0) +
        (jugador.goles7m || 0) +
        (jugador.golespi || 0);

      // Defensiva - perdida
      totalFalloPase += jugador.fallo_pase || 0;
      totalFalloRecepcion += jugador.fallo_recepcion || 0;
      totalPasos += jugador.pasos || 0;
      totalFaltaEnAtaque += jugador.falta_en_ataque || 0;
      totalDobles += jugador.dobles || 0;
      totalInvasionArea += jugador.invasion_area || 0;

      // Defensiva - recuperacion
      totalBlocaje += jugador.blocaje || 0;
      totalRobo += jugador.robo || 0;

      // Defensiva - lanzamiento_en_contra
      totalLanzamientoEnContra_ei += jugador.lanzamiento_en_contra_ei || 0;
      totalLanzamientoEnContra_ed += jugador.lanzamiento_en_contra_ed || 0;
      totalLanzamientoEnContra_li += jugador.lanzamiento_en_contra_li || 0;
      totalLanzamientoEnContra_ld += jugador.lanzamiento_en_contra_ld || 0;
      totalLanzamientoEnContra_c += jugador.lanzamiento_en_contra_c || 0;
      totalLanzamientoEnContra_pi += jugador.lanzamiento_en_contra_pi || 0;
      totalLanzamientoEnContra_7m += jugador.lanzamiento_en_contra_7m || 0;

      // Defensiva - gol_en_contra
      totalGolEnContra_ei += jugador.gol_en_contra_ei || 0;
      totalGolEnContra_ed += jugador.gol_en_contra_ed || 0;
      totalGolEnContra_li += jugador.gol_en_contra_li || 0;
      totalGolEnContra_ld += jugador.gol_en_contra_ld || 0;
      totalGolEnContra_c += jugador.gol_en_contra_c || 0;
      totalGolEnContra_pi += jugador.gol_en_contra_pi || 0;
      totalGolEnContra_7m += jugador.gol_en_contra_7m || 0;

      // Defensiva - amonestacion
      totalAmarillas += jugador.tarjetas_amarillas || 0;
      totalAzules += jugador.tarjetas_azules || 0;
      totalRojas += jugador.tarjetas_rojas || 0;
      totalExclusion2Min += jugador.exclusion_2_min || 0;
    });

    return {
      ofensiva: {
        lanzamientos: {
          total: totalLanzamientos,
          lanzamiento_7m: totalLanzamiento_7m,
          lanzamiento_ed: totalLanzamiento_ed,
          lanzamiento_ei: totalLanzamiento_ei,
          lanzamiento_ld: totalLanzamiento_ld,
          lanzamiento_li: totalLanzamiento_li,
          lanzamiento_c: totalLanzamiento_c,
          lanzamiento_pi: totalLanzamiento_pi,
          lanzamiento_ext_li: totalLanzamiento_ext_li,
          lanzamiento_ext_ld: totalLanzamiento_ext_ld,
          lanzamiento_ext_c: totalLanzamiento_ext_c,
        },
        goles: {
          total: totalGoles,
          golesli: totalGolesli,
          golesld: totalGolesld,
          golesei: totalGolesei,
          golesed: totalGolesed,
          golesc: totalGolesc,
          goles7m: totalGoles7m,
          golespi: totalGolespi,
        },
      },
      defensiva: {
        perdida: {
          fallo_pase: totalFalloPase,
          fallo_recepcion: totalFalloRecepcion,
          pasos: totalPasos,
          falta_en_ataque: totalFaltaEnAtaque,
          dobles: totalDobles,
          invasion_area: totalInvasionArea,
        },
        recuperacion: {
          blocaje: totalBlocaje,
          robo: totalRobo,
        },
        lanzamiento_en_contra: {
          lanzamiento_en_contra_ei: totalLanzamientoEnContra_ei,
          lanzamiento_en_contra_ed: totalLanzamientoEnContra_ed,
          lanzamiento_en_contra_li: totalLanzamientoEnContra_li,
          lanzamiento_en_contra_ld: totalLanzamientoEnContra_ld,
          lanzamiento_en_contra_c: totalLanzamientoEnContra_c,
          lanzamiento_en_contra_pi: totalLanzamientoEnContra_pi,
          lanzamiento_en_contra_7m: totalLanzamientoEnContra_7m,
        },
        gol_en_contra: {
          gol_en_contra_ei: totalGolEnContra_ei,
          gol_en_contra_ed: totalGolEnContra_ed,
          gol_en_contra_li: totalGolEnContra_li,
          gol_en_contra_ld: totalGolEnContra_ld,
          gol_en_contra_c: totalGolEnContra_c,
          gol_en_contra_pi: totalGolEnContra_pi,
          gol_en_contra_7m: totalGolEnContra_7m,
        },
        amonestacion: {
          tarjetas_amarillas: totalAmarillas,
          tarjetas_azules: totalAzules,
          tarjetas_rojas: totalRojas,
          exclusion_2_min: totalExclusion2Min,
        },
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

      <Flex align="center" justify="space-between" mb={8}>
        <Flex align="center" gap={3}>
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
            Por Partido
          </Tab>
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
            Por Jugador
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
          {/* Tabla Ofensiva */}
          <Box flex="2" minW={{ base: "100%", md: "60%" }}>
            <Box
              border="2px solid #31979530"
              borderRadius="md"
              mb={4}
              p={boxPadding}
              bg="white"
              overflowX="auto"
            >
              <Text fontWeight="bold" mb={2} color="#014C4C">
                Ofensiva - Lanzamientos
              </Text>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Total</Th>
                    <Th>7M</Th>
                    <Th>ED</Th>
                    <Th>EI</Th>
                    <Th>LD</Th>
                    <Th>LI</Th>
                    <Th>C</Th>
                    <Th>PI</Th>
                    <Th>Ext LI</Th>
                    <Th>Ext LD</Th>
                    <Th>Ext C</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{infoEquipo.ofensiva.lanzamientos.total}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_7m}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_ed}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_ei}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_ld}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_li}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_c}</Td>
                    <Td>{infoEquipo.ofensiva.lanzamientos.lanzamiento_pi}</Td>
                    <Td>
                      {infoEquipo.ofensiva.lanzamientos.lanzamiento_ext_li}
                    </Td>
                    <Td>
                      {infoEquipo.ofensiva.lanzamientos.lanzamiento_ext_ld}
                    </Td>
                    <Td>
                      {infoEquipo.ofensiva.lanzamientos.lanzamiento_ext_c}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box
              border="2px solid #31979530"
              borderRadius="md"
              mb={4}
              p={boxPadding}
              bg="white"
              overflowX="auto"
            >
              <Text fontWeight="bold" mb={2} color="#014C4C">
                Ofensiva - Goles
              </Text>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Total</Th>
                    <Th>LI</Th>
                    <Th>LD</Th>
                    <Th>EI</Th>
                    <Th>ED</Th>
                    <Th>C</Th>
                    <Th>7M</Th>
                    <Th>PI</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{infoEquipo.ofensiva.goles.total}</Td>
                    <Td>{infoEquipo.ofensiva.goles.golesli}</Td>
                    <Td>{infoEquipo.ofensiva.goles.golesld}</Td>
                    <Td>{infoEquipo.ofensiva.goles.golesei}</Td>
                    <Td>{infoEquipo.ofensiva.goles.golesed}</Td>
                    <Td>{infoEquipo.ofensiva.goles.golesc}</Td>
                    <Td>{infoEquipo.ofensiva.goles.goles7m}</Td>
                    <Td>{infoEquipo.ofensiva.goles.golespi}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>
          {/* Tabla Defensiva */}
          <Box
            flex="2"
            minW={{ base: "100%", md: "60%" }}
            border="2px solid #31979530"
            borderRadius="md"
            mb={4}
            p={boxPadding}
            bg="white"
            overflowX="auto"
          >
            <Text fontWeight="bold" mb={2} color="#014C4C">
              Defensiva - Pérdidas
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Fallo Pase</Th>
                  <Th>Fallo Recepción</Th>
                  <Th>Pasos</Th>
                  <Th>Falta Ataque</Th>
                  <Th>Dobles</Th>
                  <Th>Invasión Área</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{infoEquipo.defensiva.perdida.fallo_pase}</Td>
                  <Td>{infoEquipo.defensiva.perdida.fallo_recepcion}</Td>
                  <Td>{infoEquipo.defensiva.perdida.pasos}</Td>
                  <Td>{infoEquipo.defensiva.perdida.falta_en_ataque}</Td>
                  <Td>{infoEquipo.defensiva.perdida.dobles}</Td>
                  <Td>{infoEquipo.defensiva.perdida.invasion_area}</Td>
                </Tr>
              </Tbody>
            </Table>
            <Text fontWeight="bold" mt={6} mb={2} color="#014C4C">
              Defensiva - Recuperación
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Blocaje</Th>
                  <Th>Robo</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{infoEquipo.defensiva.recuperacion.blocaje}</Td>
                  <Td>{infoEquipo.defensiva.recuperacion.robo}</Td>
                </Tr>
              </Tbody>
            </Table>
            <Text fontWeight="bold" mt={6} mb={2} color="#014C4C">
              Defensiva - Lanzamientos en Contra
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>EI</Th>
                  <Th>ED</Th>
                  <Th>LI</Th>
                  <Th>LD</Th>
                  <Th>C</Th>
                  <Th>PI</Th>
                  <Th>7M</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_ei
                    }
                  </Td>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_ed
                    }
                  </Td>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_li
                    }
                  </Td>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_ld
                    }
                  </Td>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_c
                    }
                  </Td>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_pi
                    }
                  </Td>
                  <Td>
                    {
                      infoEquipo.defensiva.lanzamiento_en_contra
                        .lanzamiento_en_contra_7m
                    }
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Text fontWeight="bold" mt={6} mb={2} color="#014C4C">
              Defensiva - Goles en Contra
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>EI</Th>
                  <Th>ED</Th>
                  <Th>LI</Th>
                  <Th>LD</Th>
                  <Th>C</Th>
                  <Th>PI</Th>
                  <Th>7M</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_ei}</Td>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_ed}</Td>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_li}</Td>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_ld}</Td>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_c}</Td>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_pi}</Td>
                  <Td>{infoEquipo.defensiva.gol_en_contra.gol_en_contra_7m}</Td>
                </Tr>
              </Tbody>
            </Table>
            <Text fontWeight="bold" mt={6} mb={2} color="#014C4C">
              Defensiva - Amonestaciones
            </Text>
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Amarillas</Th>
                  <Th>Azules</Th>
                  <Th>Rojas</Th>
                  <Th>2 Min</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {infoEquipo.defensiva.amonestacion.tarjetas_amarillas}
                  </Td>
                  <Td>{infoEquipo.defensiva.amonestacion.tarjetas_azules}</Td>
                  <Td>{infoEquipo.defensiva.amonestacion.tarjetas_rojas}</Td>
                  <Td>{infoEquipo.defensiva.amonestacion.exclusion_2_min}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          {/* Tabla de jugadores (puedes dejarla igual si quieres) */}
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
                      {row.lanzamiento_7m - row.goles7m} /{" "}
                      {row.lanzamiento_c -
                        row.goles_c +
                        (row.lanzamiento_pi - row.goles_pi) +
                        (row.lanzamiento_ed - row.golesed) +
                        (row.lanzamiento_ei - row.golesei) +
                        (row.lanzamiento_ld - row.golesld) +
                        (row.lanzamiento_li - row.golesli)}
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
              {partidos.map((partido) => {
                let fechaFormateada = "";
                if (partido.fecha) {
                  const fecha = new Date(partido.fecha);
                  const dia = String(fecha.getDate()).padStart(2, "0");
                  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
                  const anio = fecha.getFullYear();
                  fechaFormateada = `${dia}-${mes}-${anio}`;
                }
                return (
                  <option key={partido.id} value={partido.id}>
                    {`Rival: ${
                      partido.equiporival_id || ""
                    } - ${fechaFormateada}`}
                  </option>
                );
              })}
            </select>
          </Box>

          {/* Totales de estadísticas del partido */}
          {partidoSeleccionado && (
            <Box mb={4}>
              {Array.isArray(statsPartidoSeleccionado) &&
              statsPartidoSeleccionado.length > 0 ? (
                (() => {
                  // Agrupa y suma los datos por categorías
                  const sum = (campo) =>
                    statsPartidoSeleccionado.reduce(
                      (acc, jugador) => acc + (Number(jugador[campo]) || 0),
                      0
                    );

                  // Ofensiva
                  const lanzamientos = [
                    sum("lanzamiento_7m"),
                    sum("lanzamiento_ed"),
                    sum("lanzamiento_ei"),
                    sum("lanzamiento_ld"),
                    sum("lanzamiento_li"),
                    sum("lanzamiento_c"),
                    sum("lanzamiento_pi"),
                    sum("lanzamiento_ext_li"),
                    sum("lanzamiento_ext_ld"),
                    sum("lanzamiento_ext_c"),
                  ];
                  const totalLanzamientos = lanzamientos.reduce(
                    (a, b) => a + b,
                    0
                  );

                  const goles = [
                    sum("golesli"),
                    sum("golesld"),
                    sum("golesei"),
                    sum("golesed"),
                    sum("golesc"),
                    sum("goles7m"),
                    sum("golespi"),
                  ];
                  const totalGoles = goles.reduce((a, b) => a + b, 0);

                  // Defensiva - Pérdidas
                  const perdidas = [
                    sum("fallo_pase"),
                    sum("fallo_recepcion"),
                    sum("pasos"),
                    sum("falta_en_ataque"),
                    sum("dobles"),
                    sum("invasion_area"),
                  ];

                  // Defensiva - Recuperación
                  const recuperacion = [sum("blocaje"), sum("robo")];

                  // Defensiva - Lanzamientos en Contra
                  const lanzamientosEnContra = [
                    sum("lanzamiento_en_contra_ei"),
                    sum("lanzamiento_en_contra_ed"),
                    sum("lanzamiento_en_contra_li"),
                    sum("lanzamiento_en_contra_ld"),
                    sum("lanzamiento_en_contra_c"),
                    sum("lanzamiento_en_contra_pi"),
                    sum("lanzamiento_en_contra_7m"),
                  ];

                  // Defensiva - Goles en Contra
                  const golesEnContra = [
                    sum("gol_en_contra_ei"),
                    sum("gol_en_contra_ed"),
                    sum("gol_en_contra_li"),
                    sum("gol_en_contra_ld"),
                    sum("gol_en_contra_c"),
                    sum("gol_en_contra_pi"),
                    sum("gol_en_contra_7m"),
                  ];

                  // Amonestaciones
                  const amonestaciones = [
                    sum("tarjetas_amarillas"),
                    sum("tarjetas_azules"),
                    sum("tarjetas_rojas"),
                    sum("exclusion_2_min"),
                  ];

                  return (
                    <Box>
                      {/* Ofensiva - Lanzamientos */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Ofensiva - Lanzamientos
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Total</Th>
                              <Th>7M</Th>
                              <Th>ED</Th>
                              <Th>EI</Th>
                              <Th>LD</Th>
                              <Th>LI</Th>
                              <Th>C</Th>
                              <Th>PI</Th>
                              <Th>Ext LI</Th>
                              <Th>Ext LD</Th>
                              <Th>Ext C</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{totalLanzamientos}</Td>
                              <Td>{lanzamientos[0]}</Td>
                              <Td>{lanzamientos[1]}</Td>
                              <Td>{lanzamientos[2]}</Td>
                              <Td>{lanzamientos[3]}</Td>
                              <Td>{lanzamientos[4]}</Td>
                              <Td>{lanzamientos[5]}</Td>
                              <Td>{lanzamientos[6]}</Td>
                              <Td>{lanzamientos[7]}</Td>
                              <Td>{lanzamientos[8]}</Td>
                              <Td>{lanzamientos[9]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                      {/* Ofensiva - Goles */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Ofensiva - Goles
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Total</Th>
                              <Th>LI</Th>
                              <Th>LD</Th>
                              <Th>EI</Th>
                              <Th>ED</Th>
                              <Th>C</Th>
                              <Th>7M</Th>
                              <Th>PI</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{totalGoles}</Td>
                              <Td>{goles[0]}</Td>
                              <Td>{goles[1]}</Td>
                              <Td>{goles[2]}</Td>
                              <Td>{goles[3]}</Td>
                              <Td>{goles[4]}</Td>
                              <Td>{goles[5]}</Td>
                              <Td>{goles[6]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                      {/* Defensiva - Pérdidas */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Defensiva - Pérdidas
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Fallo Pase</Th>
                              <Th>Fallo Recepción</Th>
                              <Th>Pasos</Th>
                              <Th>Falta Ataque</Th>
                              <Th>Dobles</Th>
                              <Th>Invasión Área</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{perdidas[0]}</Td>
                              <Td>{perdidas[1]}</Td>
                              <Td>{perdidas[2]}</Td>
                              <Td>{perdidas[3]}</Td>
                              <Td>{perdidas[4]}</Td>
                              <Td>{perdidas[5]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                      {/* Defensiva - Recuperación */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Defensiva - Recuperación
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Blocaje</Th>
                              <Th>Robo</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{recuperacion[0]}</Td>
                              <Td>{recuperacion[1]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                      {/* Defensiva - Lanzamientos en Contra */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Defensiva - Lanzamientos en Contra
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>EI</Th>
                              <Th>ED</Th>
                              <Th>LI</Th>
                              <Th>LD</Th>
                              <Th>C</Th>
                              <Th>PI</Th>
                              <Th>7M</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{lanzamientosEnContra[0]}</Td>
                              <Td>{lanzamientosEnContra[1]}</Td>
                              <Td>{lanzamientosEnContra[2]}</Td>
                              <Td>{lanzamientosEnContra[3]}</Td>
                              <Td>{lanzamientosEnContra[4]}</Td>
                              <Td>{lanzamientosEnContra[5]}</Td>
                              <Td>{lanzamientosEnContra[6]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                      {/* Defensiva - Goles en Contra */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Defensiva - Goles en Contra
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>EI</Th>
                              <Th>ED</Th>
                              <Th>LI</Th>
                              <Th>LD</Th>
                              <Th>C</Th>
                              <Th>PI</Th>
                              <Th>7M</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{golesEnContra[0]}</Td>
                              <Td>{golesEnContra[1]}</Td>
                              <Td>{golesEnContra[2]}</Td>
                              <Td>{golesEnContra[3]}</Td>
                              <Td>{golesEnContra[4]}</Td>
                              <Td>{golesEnContra[5]}</Td>
                              <Td>{golesEnContra[6]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                      {/* Amonestaciones */}
                      <Box
                        border="2px solid #319795"
                        borderRadius="md"
                        p={3}
                        mb={4}
                        maxW="100%"
                        textAlign="center"
                      >
                        <Text fontWeight="bold" mb={2} color="#014C4C">
                          Amonestaciones
                        </Text>
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Amarillas</Th>
                              <Th>Azules</Th>
                              <Th>Rojas</Th>
                              <Th>2 Min</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>{amonestaciones[0]}</Td>
                              <Td>{amonestaciones[1]}</Td>
                              <Td>{amonestaciones[2]}</Td>
                              <Td>{amonestaciones[3]}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                    </Box>
                  );
                })()
              ) : (
                <Flex align="center" justify="center" minH="60px">
                  <Text color="gray.500" fontWeight="bold" textAlign="center">
                    No se pudieron encontrar estadísticas del partido
                  </Text>
                </Flex>
              )}
            </Box>
          )}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box>
          <Text fontWeight="bold" mb={4} color="#014C4C">
            Estadísticas por jugador
          </Text>
          <Accordion allowMultiple>
            {jugadores.map((jugador) => (
              <AccordionItem
                key={jugador.id}
                border="1px solid #31979530"
                borderRadius="md"
                mb={4}
              >
                <h2>
                  <AccordionButton _expanded={{ bg: "gray.50" }}>
                    <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                      {jugador.nombre}{" "}
                      <Text
                        as="span"
                        color="gray.500"
                        fontWeight="normal"
                      >{`#${jugador.dorsal}`}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg="white">
                  {/* Ataque */}
                  <Box mb={4}>
                    <Text fontWeight="semibold" mb={2} color="#014C4C">
                      Ataque
                    </Text>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Lanzamientos</Th>
                          <Th>Goles</Th>
                          <Th>Pérdidas</Th>
                          <Th>Faltas</Th>
                          <Th>A Puerta</Th>
                          <Th>Goles 7M</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>
                            {(jugador.lanzamiento_7m || 0) +
                              (jugador.lanzamiento_ed || 0) +
                              (jugador.lanzamiento_ei || 0) +
                              (jugador.lanzamiento_ld || 0) +
                              (jugador.lanzamiento_li || 0) +
                              (jugador.lanzamiento_c || 0) +
                              (jugador.lanzamiento_pi || 0) +
                              (jugador.lanzamiento_ext_li || 0) +
                              (jugador.lanzamiento_ext_ld || 0) +
                              (jugador.lanzamiento_ext_c || 0)}
                          </Td>
                          <Td>
                            {(jugador.golesli || 0) +
                              (jugador.golesld || 0) +
                              (jugador.golesei || 0) +
                              (jugador.golesed || 0) +
                              (jugador.golesc || 0) +
                              (jugador.goles7m || 0) +
                              (jugador.golespi || 0)}
                          </Td>
                          <Td>{jugador.perdidas || 0}</Td>
                          <Td>{jugador.faltas || 0}</Td>
                          <Td>{jugador.lanzamientos || 0}</Td>
                          <Td>{jugador.goles7m || 0}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                  {/* Defensa */}
                  <Box mb={4}>
                    <Text fontWeight="semibold" mb={2} color="#014C4C">
                      Defensa
                    </Text>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Recuperación</Th>
                          <Th>Paradas</Th>
                          <Th>Paradas 7M</Th>
                          <Th>Faltas</Th>
                          <Th>Amarillas</Th>
                          <Th>Rojas</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>{jugador.recuperaciones || 0}</Td>
                          <Td>{jugador.paradas || 0}</Td>
                          <Td>{jugador.paradas7m || 0}</Td>
                          <Td>{jugador.faltas || 0}</Td>
                          <Td>{jugador.tarjetas_amarillas || 0}</Td>
                          <Td>{jugador.tarjetas_rojas || 0}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                  {/* Sanciones */}
                  <Box mb={4}>
                    <Text fontWeight="semibold" mb={2} color="#014C4C">
                      Sanciones
                    </Text>
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
                          <Td>{jugador.exclusion_2_min || 0}</Td>
                          <Td>{jugador.tarjetas_amarillas || 0}</Td>
                          <Td>{jugador.tarjetas_rojas || 0}</Td>
                          <Td>{jugador.tarjetas_azules || 0}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                  {/* Puedes añadir aquí más tablas o grids para posiciones de lanzamiento, etc. */}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default StatsAvanzadas;
