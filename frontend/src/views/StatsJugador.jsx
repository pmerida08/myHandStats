/**
 * StatsJugador
 * 
 * Vista de estadísticas individuales para un jugador.
 * 
 * Características:
 * - Muestra los datos y estadísticas de un jugador específico del equipo.
 * - Visualiza la eficacia de lanzamientos, goles por zona, pérdidas, fallos, amonestaciones y exclusiones.
 * - Si el jugador es portero, muestra goles en contra por zona.
 * - Usa gráficos de barras y doughnut para representar los datos (Chart.js).
 * - Incluye Header y Sidebar personalizados.
 * - Spinner de carga mientras se obtienen los datos.
 * 
 * Uso:
 * - Accesible para cualquier usuario autenticado desde el listado de jugadores o desde el resumen de partido.
 * - Permite analizar el rendimiento individual de cada jugador.
 */
import {
  Box,
  Text,
  Image,
  Heading,
  Grid,
  Spinner,
  Flex,
  Card,
  Divider,
  useColorModeValue,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import Header from "../components/Header"; // Añade este import

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

function StatsJugador() {
  const { jugador_id } = useParams();
  const [jugador, setJugador] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chartBoxBg = useColorModeValue("white", "gray.700");

  // Estado para usuario y club
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id_equipo = localStorage.getItem("id_equipo");

    // Cargar datos del jugador
    fetch(
      `https://myhandstats.onrender.com/equipo/${id_equipo}/jugador/${jugador_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setJugador(data);
      })
      .catch((err) => console.error("Error al cargar estadísticas:", err))
      .finally(() => setLoading(false));

    // Cargar nombre usuario
    fetch("https://myhandstats.onrender.com/usuario/perfil", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserName(data.info?.nombre || "Usuario"));

    // Cargar club
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
  }, [jugador_id]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!jugador) return <Text>Error al cargar datos del jugador.</Text>;

  const isPortero =
    jugador.posiciones && jugador.posiciones[0]?.nombre.toLowerCase() === "portero";

  // Lanzamientos y goles
  const totalGoles = jugador.golest || 0;
  const totalLanzamientos = jugador.lanzamientos || 0;
  const estadisticasNegativas = [
    { label: "Perdidas", value: jugador.perdidas || 0 },
    { label: "Fallo pase", value: jugador.fallo_pase || 0 },
    { label: "Fallo recepción", value: jugador.fallo_recepcion || 0 },
    { label: "Dobles", value: jugador.dobles || 0 },
    { label: "Pasos", value: jugador.pasos || 0 },
    { label: "Invasión área", value: jugador.invasion_area || 0 },
    { label: "Falta ataque", value: jugador.falta_en_ataque || 0 },
    { label: "Exclusiones", value: jugador.exclusiones || 0 },
    { label: "2 Min", value: jugador.exclusion_2_min || 0 },
    { label: "Amarillas", value: jugador.tarjetas_amarillas || 0 },
    { label: "Rojas", value: jugador.tarjetas_rojas || 0 },
    { label: "Azules", value: jugador.tarjetas_azules || 0 },
  ];

  const golesPorZona = [
    { label: "LI", value: jugador.golesli || 0 },
    { label: "LD", value: jugador.golesld || 0 },
    { label: "EI", value: jugador.golesei || 0 },
    { label: "ED", value: jugador.golesed || 0 },
    { label: "C", value: jugador.golesc || 0 },
    { label: "PI", value: jugador.golespi || 0 },
    { label: "7m", value: jugador.goles7m || 0 },
  ];

  const golesEnContra = [
    { label: "LI", value: jugador.gol_en_contra_li || 0 },
    { label: "LD", value: jugador.gol_en_contra_ld || 0 },
    { label: "EI", value: jugador.gol_en_contra_ei || 0 },
    { label: "ED", value: jugador.gol_en_contra_ed || 0 },
    { label: "C", value: jugador.gol_en_contra_c || 0 },
    { label: "PI", value: jugador.gol_en_contra_pi || 0 },
    { label: "7m", value: jugador.gol_en_contra_7m || 0 },
  ];

  // Calcular totales para portero
  const goles_en_contra_totales = golesEnContra.reduce((acc, zona) => acc + zona.value, 0);
  const lanzamientos_en_contra_totales = 
    (jugador.lanzamientos_en_contra_li || 0) +
    (jugador.lanzamientos_en_contra_ld || 0) +
    (jugador.lanzamientos_en_contra_ei || 0) +
    (jugador.lanzamientos_en_contra_ed || 0) +
    (jugador.lanzamientos_en_contra_c || 0) +
    (jugador.lanzamientos_en_contra_pi || 0) +
    (jugador.lanzamientos_en_contra_7m || 0);

  return (
    <AuthWrapper requiredRole={null}>
      <Box p={4} position="relative">
        {/* Header añadido */}
        <Header
          onOpen={onOpen}
          userName={userName}
          club={club}
          texto="Estadísticas del Jugador"
        />
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Box>
          <Card
            w="100%"
            mx={0}
            p={{ base: 4, md: 8 }}
            borderRadius="xl"
            shadow="md"
            bg={chartBoxBg}
          >
            <Flex
              align="center"
              mb={8}
              direction={{ base: "column", md: "row" }}
            >
              <Image
                src={jugador.foto}
                alt={jugador.nombre}
                boxSize="110px"
                borderRadius="full"
                objectFit="cover"
                mr={{ md: 8 }}
                mb={{ base: 4, md: 0 }}
                border="3px solid #014C4C"
                bg="white"
              />
              <Box textAlign={{ base: "center", md: "left" }}>
                <Heading size="lg" color="#014C4C">
                  {jugador.nombre}
                </Heading>
                <Text
                  fontSize="lg"
                  color="gray.600"
                  fontWeight="bold"
                  mt={2}
                  display="flex"
                  alignItems="center"
                  justifyContent={{ base: "center", md: "flex-start" }}
                >
                  Dorsal:
                  <Box as="span" color="#014C4C" ml={2}>
                    {jugador.dorsal}
                  </Box>
                </Text>
                <Text
                  fontSize="md"
                  color="gray.600"
                  display="flex"
                  alignItems="center"
                  justifyContent={{ base: "center", md: "flex-start" }}
                >
                  Posición:
                  <Box as="span" color="#014C4C" ml={2}>
                    {jugador.posiciones?.[0]?.nombre || "Sin posición"}
                  </Box>
                </Text>
              </Box>
            </Flex>

            <Divider mb={8} />

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
              {/* Eficacia de Lanzamientos Totales */}
              {!isPortero && (
                <Card bg={chartBoxBg} p={4} shadow="sm">
                  <Heading
                    size="sm"
                    mb={4}
                    textAlign="center"
                    color="#014C4C"
                    fontWeight="bold"
                  >
                    Eficacia de Lanzamientos Totales
                  </Heading>
                  <Box h="260px">
                    <Doughnut
                      data={{
                        labels: ["Goles", "Fallos"],
                        datasets: [
                          {
                            data: [totalGoles, totalLanzamientos - totalGoles],
                            backgroundColor: ["#38A169", "#E53E3E"],
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </Box>
                </Card>
              )}

              {/* Gráfica para portero: Goles en contra totales vs Lanzamientos totales */}
              {isPortero && (
                <Card bg={chartBoxBg} p={4} shadow="sm">
                  <Heading
                    size="sm"
                    mb={4}
                    textAlign="center"
                    color="#014C4C"
                    fontWeight="bold"
                  >
                    Goles en Contra Totales vs Lanzamientos Totales
                  </Heading>
                  <Box h="260px">
                    <Doughnut
                      data={{
                        labels: ["Goles en contra", "Paradas"],
                        datasets: [
                          {
                            data: [
                              goles_en_contra_totales,
                              lanzamientos_en_contra_totales - goles_en_contra_totales,
                            ],
                            backgroundColor: ["#E53E3E", "#38A169"],
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </Box>
                </Card>
              )}
              {/* Goles por Zona o Goles en Contra por Zona */}
              <Card bg={chartBoxBg} p={4} shadow="sm">
                <Heading
                  size="sm"
                  mb={4}
                  textAlign="center"
                  color="#014C4C"
                  fontWeight="bold"
                >
                  {isPortero ? "Goles en Contra por Zona" : "Goles por Zona"}
                </Heading>
                <Box h="260px">
                  <Bar
                    data={{
                      labels: (isPortero ? golesEnContra : golesPorZona).map((z) => z.label),
                      datasets: [
                        {
                          label: isPortero ? "Goles en contra" : "Goles",
                          data: (isPortero ? golesEnContra : golesPorZona).map((z) => z.value),
                          backgroundColor: isPortero ? "#E53E3E" : "#3182CE",
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </Box>
              </Card>

              {/* Solo para jugadores de campo: estadísticas negativas y amonestaciones */}
              {!isPortero && (
                <>
                  <Card
                    bg={chartBoxBg}
                    p={4}
                    shadow="sm"
                    gridColumn={{ md: "span 2" }}
                  >
                    <Heading
                      size="sm"
                      mb={4}
                      textAlign="center"
                      color="#014C4C"
                      fontWeight="bold"
                    >
                      Pérdidas y Fallos
                    </Heading>
                    <Box h="260px">
                      <Bar
                        data={{
                          labels: [
                            "Pérdidas",
                            "Fallo pase",
                            "Fallo recepción",
                            "Dobles",
                            "Pasos",
                            "Invasión área",
                            "Falta ataque",
                          ],
                          datasets: [
                            {
                              label: "Cantidad",
                              data: [
                                jugador.perdidas || 0,
                                jugador.fallo_pase || 0,
                                jugador.fallo_recepcion || 0,
                                jugador.dobles || 0,
                                jugador.pasos || 0,
                                jugador.invasion_area || 0,
                                jugador.falta_en_ataque || 0,
                              ],
                              backgroundColor: "#DD6B20",
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{ responsive: true, maintainAspectRatio: false }}
                      />
                    </Box>
                  </Card>
                  <Card
                    bg={chartBoxBg}
                    p={4}
                    shadow="sm"
                    gridColumn={{ md: "span 2" }}
                  >
                    <Heading
                      size="sm"
                      mb={4}
                      textAlign="center"
                      color="#014C4C"
                      fontWeight="bold"
                    >
                      Amonestaciones y Exclusiones
                    </Heading>
                    <Box h="260px">
                      <Bar
                        data={{
                          labels: [
                            "Exclusiones",
                            "2 Min",
                            "Amarillas",
                            "Rojas",
                            "Azules",
                          ],
                          datasets: [
                            {
                              label: "Cantidad",
                              data: [
                                jugador.exclusiones || 0,
                                jugador.exclusion_2_min || 0,
                                jugador.tarjetas_amarillas || 0,
                                jugador.tarjetas_rojas || 0,
                                jugador.tarjetas_azules || 0,
                              ],
                              backgroundColor: "#E53E3E",
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{ responsive: true, maintainAspectRatio: false }}
                      />
                    </Box>
                  </Card>
                </>
              )}
            </Grid>
          </Card>
        </Box>
      </Box>
    </AuthWrapper>
  );
}

export default StatsJugador;
