/**
 * DashboardPartido
 *
 * Vista principal para la gestión y registro de acciones durante un partido.
 * Permite seleccionar equipo, gestionar jugadores, registrar acciones, controlar el tiempo y marcar goles.
 *
 * Características principales:
 * - Selección de equipo y jugadores.
 * - Control de fases del juego y acciones (goles, faltas, sanciones, etc.).
 * - Cronómetro para el partido.
 * - Registro de goles y goles en contra.
 * - Modal para seleccionar zona de disparo y lanzador.
 * - Finalización de parte y partido con confirmación.
 */
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  Button,
  Grid,
  SimpleGrid,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBars, FaPause } from "react-icons/fa";
import Swal from "sweetalert2";

const DashboardPartido = () => {
  // Estado para los equipos disponibles
  const [equipos, setEquipos] = useState([]);
  // Equipo seleccionado para el partido
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  // Jugadores del equipo seleccionado
  const [jugadores, setJugadores] = useState([]);
  // Jugador seleccionado para registrar acción
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  // Fase del juego seleccionada
  const [faseSeleccionada, setFaseSeleccionada] = useState("Ataque Posicional");
  // Estado del partido (iniciado o no)
  const [partidoIniciado, setPartidoIniciado] = useState(false);
  // Tipo de acción/modal activo
  const [modalTipo, setModalTipo] = useState(null);

  // Zona de disparo y lanzador para el modal
  const [zonaDisparo, setZonaDisparo] = useState(null);
  const [zonaLanzador, setZonaLanzador] = useState(null);
  // Control del modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Cronómetro y control de tiempo
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  // Marcador de goles
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);

  /**
   * Carga los equipos del club al montar el componente.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://myhandstats.onrender.com/club/equipos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEquipos(data);
        else console.error("Respuesta inesperada:", data);
      })
      .catch((err) => console.error("Error al cargar equipos:", err));
  }, []);

  /**
   * Carga los jugadores del equipo seleccionado.
   */
  useEffect(() => {
    if (!equipoSeleccionado) return;
    const token = localStorage.getItem("token");

    fetch(
      `https://myhandstats.onrender.com/equipo/${equipoSeleccionado}/jugadores`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJugadores(data);
        else console.error("Respuesta inesperada:", data);
      })
      .catch((err) => console.error("Error al cargar jugadores:", err));
  }, [equipoSeleccionado]);

  /**
   * Controla el cronómetro del partido.
   */
  useEffect(() => {
    let interval = null;
    if (activo) {
      interval = setInterval(() => {
        setSegundos((prev) => (prev < 1800 ? prev + 1 : 1800));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activo]);

  /**
   * Formatea el tiempo en mm:ss.
   */
  const formatoTiempo = () => {
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  /**
   * Inicia el partido si hay equipo seleccionado.
   */
  const handleComenzar = () => {
    if (!equipoSeleccionado) {
      Swal.fire(
        "Selecciona un equipo",
        "Debes elegir un equipo antes de comenzar",
        "warning"
      );
      return;
    }
    setPartidoIniciado(true);
  };

  /**
   * Guarda un gol, validando zonas seleccionadas.
   */
  const handleGuardarGol = () => {
    if (!zonaDisparo || (modalTipo === "gol" && !zonaLanzador)) {
      Swal.fire(
        "Faltan datos",
        "Debes seleccionar una zona de disparo y lanzador",
        "warning"
      );
      return;
    }
    setGolesLocal((prev) => prev + 1);
    onClose();
    setZonaDisparo(null);
    setZonaLanzador(null);
    setModalTipo(null);
  };

  /**
   * Maneja la selección de una acción (gol, falta, sanción, etc.).
   * Si requiere modal, lo abre; si no, registra la acción directamente.
   */
  const handleAccion = (accion) => {
    if (accion !== "Gol en Contra" && !jugadorSeleccionado) {
      Swal.fire(
        "Jugador no seleccionado",
        "Selecciona un jugador para registrar esta acción",
        "error"
      );
      return;
    }
    if (accion.tipo) {
      setModalTipo(accion.tipo);
      onOpen();
    } else {
      console.log("Acción ejecutada:", accion);
    }
  };

  /**
   * Muestra un diálogo de confirmación usando SweetAlert2.
   * @param {string} mensaje Mensaje a mostrar
   * @param {string} confirmButton Texto del botón de confirmación
   * @returns {Promise<boolean>} true si el usuario confirma
   */
  const confirmar = async (mensaje, confirmButton = "Sí") => {
    const result = await Swal.fire({
      title: mensaje,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmButton,
      cancelButtonText: "Cancelar",
    });
    return result.isConfirmed;
  };

  /**
   * Finaliza la parte actual del partido.
   */
  const handleFinalizarParte = async () => {
    if (await confirmar("¿Estás seguro de finalizar la parte?")) {
      setActivo(false);
      setSegundos(0);
      Swal.fire(
        "Parte finalizada",
        "Puedes comenzar la siguiente parte",
        "success"
      );
    }
  };

  /**
   * Finaliza el partido completamente.
   */
  const handleFinalizarPartido = async () => {
    if (await confirmar("¿Finalizar el partido completamente?")) {
      setActivo(false);
      Swal.fire("Partido finalizado", "Buen trabajo", "success");
    }
  };

  // Pantalla de selección de equipo antes de iniciar el partido
  if (!partidoIniciado) {
    return (
      <Box p={8} minH="100vh" bg="white" textAlign="center">
        <Text fontSize="xl" mb={4} fontWeight="bold">
          Selecciona el equipo para iniciar el partido
        </Text>
        <Select
          placeholder="Selecciona un equipo"
          value={equipoSeleccionado}
          onChange={(e) => setEquipoSeleccionado(e.target.value)}
          maxW="300px"
          mx="auto"
          mb={4}
        >
          {equipos.map((equipo) => (
            <option key={equipo.id} value={equipo.id}>
              {equipo.nombre}
            </option>
          ))}
        </Select>
        <Button
          bg="#014C4C"
          color="white"
          onClick={handleComenzar}
          _hover={{ bg: "#016666" }}
        >
          Comenzar Partido
        </Button>
      </Box>
    );
  }

  // Vista principal del dashboard de partido
  return (
    <Box p={4} minH="100vh" bg="white">
      <Flex align="center" justify="space-between" mb={6}>
        <Icon as={FaBars} boxSize={5} />
        <Flex align="center" gap={3}>
          <Text fontSize="2xl" color="blue.600" fontWeight="bold">
            {golesLocal}
          </Text>
          <Text fontSize="2xl" color="red.500" fontWeight="bold">
            :
          </Text>
          <Text fontSize="2xl" color="red.500" fontWeight="bold">
            {golesVisitante}
          </Text>
          <Flex
            align="center"
            justify="center"
            boxSize={8}
            bg="#014C4C"
            borderRadius="full"
            color="white"
            cursor="pointer"
            onClick={() => setActivo((prev) => !prev)}
          >
            <Icon as={FaPause} fontSize="xs" />
          </Flex>
          <Flex direction="column" align="center">
            <Text fontSize="sm">1º Parte</Text>
            <Text fontSize="xl" fontWeight="bold">
              {formatoTiempo()}
            </Text>
          </Flex>
        </Flex>
        <Button variant="outline" size="sm" onClick={handleFinalizarParte}>
          Acabar Parte
        </Button>
      </Flex>

      <Flex flexWrap="wrap" gap={6}>
        {/* Panel izquierdo: gestión de jugadores y timeouts */}
        <Box minW="200px">
          <Text fontWeight="bold" mb={2}>
            Timeouts
          </Text>
          <Flex gap={2} mb={4}>
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                borderRadius="full"
                bg="#014C4C"
                color="white"
                size="sm"
              >
                {num}
              </Button>
            ))}
          </Flex>
          <Text fontWeight="bold" mb={1}>
            Portero
          </Text>
          <Button colorScheme="teal" size="sm" mb={4}>
            1 Pepe
          </Button>
          <Text fontWeight="bold" mb={1}>
            En Pista
          </Text>
          <SimpleGrid columns={3} spacing={2} mb={4}>
            {jugadores.slice(0, 6).map((jugador) => (
              <Button
                key={jugador.id}
                size="sm"
                bg="#014C4C"
                color="white"
                onClick={() => setJugadorSeleccionado(jugador)}
              >
                {jugador.dorsal} {jugador.nombre}
              </Button>
            ))}
          </SimpleGrid>
          <Text fontWeight="bold" mb={1}>
            Banquillo
          </Text>
          <SimpleGrid columns={3} spacing={2}>
            {jugadores.slice(6).map((jugador) => (
              <Button
                key={jugador.id}
                size="sm"
                bg="#014C4C"
                color="white"
                onClick={() => setJugadorSeleccionado(jugador)}
              >
                {jugador.dorsal} {jugador.nombre}
              </Button>
            ))}
          </SimpleGrid>
        </Box>

        {/* Panel derecho: fases, acciones y finalización */}
        <Box flex="1">
          <Text fontWeight="bold" mb={2}>
            Fase del Juego
          </Text>
          <Flex wrap="wrap" gap={2} mb={4}>
            {["Ataque Posicional", "Defensa Posicional", "Contraataque", "Repliegue"].map((fase) => (
              <Button
                key={fase}
                size="sm"
                variant={faseSeleccionada === fase ? "solid" : "outline"}
                colorScheme={faseSeleccionada === fase ? "teal" : "gray"}
                onClick={() => setFaseSeleccionada(fase)}
              >
                {fase}
              </Button>
            ))}
          </Flex>
          <Text fontWeight="bold" mb={2}>
            Acciones
          </Text>
          <SimpleGrid columns={[2, 3, 4]} spacing={3} mb={6}>
            {[
              { label: "Gol", tipo: "gol" },
              { label: "Gol 7M", tipo: "gol7m" },
              "Parada",
              "Parada 7M",
              "Tiro Puerta",
              "Tiro Fuera",
              "Falta",
              "Falta 7M",
              "Gol en Contra",
              "Pérdida",
              "Amarilla",
              "Roja",
              "Azul",
              "2 Minutos",
              "Recupe.",
            ].map((accion) =>
              typeof accion === "string" ? (
                <Button
                  key={accion}
                  padding="16dp"
                  variant="outline"
                  onClick={() => handleAccion(accion)}
                >
                  {accion}
                </Button>
              ) : (
                <Button
                  key={accion.label}
                  size="sm"
                  variant="outline"
                  onClick={() => handleAccion(accion)}
                >
                  {accion.label}
                </Button>
              )
            )}
          </SimpleGrid>
          <Flex justify="flex-end">
            <Button
              bg="#014C4C"
              color="white"
              _hover={{ bg: "#016666" }}
              onClick={handleFinalizarPartido}
            >
              Finalizar Partido
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/* Modal para seleccionar zona de disparo y lanzador */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" bg="#014C4C" color="white">
            Posición del Lanzamiento
          </ModalHeader>
          <ModalBody>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={2}
              mb={6}
              textAlign="center"
            >
              {Array.from({ length: 9 }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setZonaDisparo(i + 1)}
                  variant={zonaDisparo === i + 1 ? "solid" : "outline"}
                  colorScheme="teal"
                >
                  {i + 1}
                </Button>
              ))}
            </Grid>
            {modalTipo === "gol" && (
              <>
                <Text textAlign="center" fontWeight="bold" mb={2}>
                  Posición del Lanzador
                </Text>
                <Grid templateColumns="repeat(5, 1fr)" gap={2} mb={2}>
                  {["Ala Izquierda", "Izquierda 6M", "Centro 6M", "Derecha 6M", "Ala Derecha"].map((pos) => (
                    <Button
                      key={pos}
                      onClick={() => setZonaLanzador(pos)}
                      variant={zonaLanzador === pos ? "solid" : "outline"}
                      colorScheme="teal"
                      size="sm"
                    >
                      {pos}
                    </Button>
                  ))}
                </Grid>
                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                  {["Izquierda 9M", "Centro 9M", "Derecha 9M", "Medio Campo", "Campo a Campo"].map((pos) => (
                    <Button
                      key={pos}
                      onClick={() => setZonaLanzador(pos)}
                      variant={zonaLanzador === pos ? "solid" : "outline"}
                      colorScheme="teal"
                      size="sm"
                    >
                      {pos}
                    </Button>
                  ))}
                </Grid>
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="teal" onClick={handleGuardarGol}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DashboardPartido;
