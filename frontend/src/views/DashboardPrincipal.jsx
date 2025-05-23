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
} from "@chakra-ui/react";
import { FaBars, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });
  const [equipo, setEquipo] = useState({ id: "", nombre: "", logo: "" });
  const [ultimosPartidos, setUltimosPartidos] = useState([]);
  const [golesFavor, setGolesFavor] = useState(0);
  const [golesContra, setGolesContra] = useState(0);
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://myhandstats.onrender.com/usuario/perfil", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.info.nombre);
      })
      .catch(() => setUserName("Usuario"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const clubId = getClubIdFromToken(token);

    if (!clubId) {
      setClub({ nombre: "Club no encontrado", logo: "" });
      return;
    }

    fetch("https://myhandstats.onrender.com/club", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let clubData = null;
        if (Array.isArray(data.info)) {
          clubData = data.info.find((c) => c.id == clubId);
        } else {
          clubData = data;
        }
        if (clubData) {
          setClub({
            nombre: clubData.nombre,
            logo: clubData.logo,
          });
        } else {
          setClub({ nombre: "Club no encontrado", logo: "" });
        }
      })
      .catch(() => setClub({ nombre: "Club ejemplo", logo: "" }));
  }, []);

  useEffect(() => {
    const equipoId = localStorage.getItem("id_equipo");
    if (!equipoId) {
      setEquipo({ nombre: "Equipo no encontrado", logo: "" });
      return;
    }

    fetch(`https://myhandstats.onrender.com/equipo/${equipoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setEquipo({
            id: data.id,
            nombre: data.nombre,
            logo: data.logo,
          });
        } else {
          setEquipo({ nombre: "Equipo no encontrado", logo: "" });
        }
      })
      .catch(() => setEquipo({ nombre: "Equipo ejemplo", logo: "" }));
  }, []);

  // Obtener goles de los jugadores del equipo cuando equipo.id esté disponible
  useEffect(() => {
    if (!equipo.id) return;
    const token = localStorage.getItem("token");
    fetch(`https://myhandstats.onrender.com/equipo/${equipo.id}/jugadores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Jugadores del equipo:", data); // <-- Añade esta línea
        if (Array.isArray(data)) {
          setJugadores(data);
          // Suma todos los goles a favor (golest)
          const totalGolesFavor = data.reduce(
            (acc, jugador) => acc + (jugador.golest || 0),
            0
          );
          setGolesFavor(totalGolesFavor);

          const totalGolesContra = data.reduce(
            (acc, jugador) => acc + (jugador.gol_en_contra_t || 0),
            0
          );

          setGolesContra(totalGolesContra);
        } else {
          setGolesFavor(0);
          setGolesContra(0);
        }
      })
      .catch(() => {
        setGolesFavor(0);
        setGolesContra(0);
      });
  }, [equipo.id]);

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

  useEffect(() => {
    if (!equipo.id) return; // Solo ejecuta si hay id de equipo
    const token = localStorage.getItem("token");
    fetch(`https://myhandstats.onrender.com/equipo/${equipo.id}/partidos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUltimosPartidos(data);
        }
      })
      .catch(() => setUltimosPartidos([]));
  }, [equipo.id]);

  // Calcular porcentaje de partidos ganados
  const totalPartidos = ultimosPartidos.length;
  const partidosGanados = ultimosPartidos.filter(
    (partido) => (partido.goles_id_equipo ?? 0) > (partido.goles_id_equiporival ?? 0)
  ).length;
  const porcentajeGanados = totalPartidos > 0 ? Math.round((partidosGanados / totalPartidos) * 100) : 0;
  const esPorcentajeAlto = porcentajeGanados >= 50;

  return (
    <Box p={4} minH="100vh" bg="white">
      {/* Sidebar desplegable */}
      <Sidebar isOpen={isOpen} onClose={onClose} />

      {/* Header con título y hamburguesa */}
      <Flex align="center" justify="space-between" mb={8}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Flex align="center" gap={3}>
          <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={0}>
            Dashboard
          </Text>
          <Avatar name={club.nombre} src={club.logo} />
          <Text fontSize="sm" color="gray.500">
            {equipo.nombre}
          </Text>
        </Flex>

        {/* Avatar de usuario */}
        <Flex align="center" gap={2}>
          <Text fontSize="sm" color="#014C4C">
            {userName}
          </Text>
        </Flex>
      </Flex>

      {/* Grid principal */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {/* Goles últimos partidos */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Goles últimos partidos</Text>
            <Button size="sm" variant="outline">
              View Report
            </Button>
          </Flex>
          <Box h="200px" w="200px" mx="auto">
            <Doughnut data={golesData} />
          </Box>
          <Divider my={4} />
          <Flex gap={4} justify="center">
            <Box h={2} w={2} borderRadius="full" bg="#014C4C" />
            <Text fontSize="xs">Goles a favor</Text>
            <Box h={2} w={2} borderRadius="full" bg="gray.300" />
            <Text fontSize="xs">Goles en contra</Text>
          </Flex>
        </Box>

        {/* Fases del Juego */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Fases del Juego últimos partidos</Text>
            <Button size="sm" variant="ghost" isDisabled>
              View Report
            </Button>
          </Flex>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Lanzamientos 7m */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold">Lanzamientos 7m</Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Los máximos lanzadores de 7 metros del equipo
          </Text>
          {Array.isArray(jugadores) && jugadores.length > 0 ? (
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    .map((jugador) => (
                      <tr key={jugador.id}>
                        <td style={{ padding: "4px" }}>{jugador.nombre}</td>
                        <td style={{ textAlign: "right", padding: "4px" }}>
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
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold">Goleadores</Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Los máximos goleadores del equipo
          </Text>
          {Array.isArray(jugadores) && jugadores.length > 0 ? (
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    .map((jugador) => (
                      <tr key={jugador.id}>
                        <td style={{ padding: "4px" }}>{jugador.nombre}</td>
                        <td style={{ textAlign: "right", padding: "4px" }}>
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

        {/* Partidos */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Historial de partidos</Text>
            <Button size="sm" variant="outline">
              View Report
            </Button>
          </Flex>
          <Flex align="center" gap={2} mb={2}>
            <Text fontSize={"sm"}>Porcentaje de victorias:</Text>
            <Text color={esPorcentajeAlto ? "green.600" : "red.600"} fontWeight="bold">
              {porcentajeGanados}%
            </Text>
            <Icon
              as={esPorcentajeAlto ? FaArrowUp : FaArrowDown}
              color={esPorcentajeAlto ? "green.600" : "red.600"}
              boxSize={4}
            />
          </Flex>
          {Array.isArray(ultimosPartidos) && ultimosPartidos.length > 0 ? (
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "4px" }}>Rival</th>
                    <th style={{ textAlign: "left", padding: "4px" }}>Fecha</th>
                    <th style={{ textAlign: "right", padding: "4px" }}>
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "sm", color: "#4A5568" }}>
                  {ultimosPartidos.map((partido) => {
                    const golesFavor = partido.goles_id_equipo ?? 0;
                    const golesContra = partido.goles_id_equiporival ?? 0;
                    let bgColor = "";
                    if (golesFavor > golesContra)
                      bgColor = "#d1fae5";
                    else if (golesFavor < golesContra) bgColor = "#fee2e2";

                    return (
                      <tr key={partido.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "4px" }}>
                          {partido.equiporival_id || "Desconocido"}
                        </td>
                        <td style={{ padding: "4px" }}>
                          {partido.fecha
                            ? new Date(partido.fecha).toLocaleDateString()
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
      </Grid>
    </Box>
  );
};

export default DashboardPrincipal;
