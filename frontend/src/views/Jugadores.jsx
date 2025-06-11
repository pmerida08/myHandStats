/**
 * Jugadores
 *
 * Vista para la gestión y visualización de jugadores de un equipo.
 * Permite:
 * - Listar todos los jugadores del equipo.
 * - Buscar jugadores por nombre.
 * - Crear nuevos jugadores (con foto, dorsal, posición, etc.).
 * - Editar datos y foto de jugadores existentes.
 * - Visualizar estadísticas individuales de cada jugador.
 *
 * Características:
 * - Solo accesible para usuarios autenticados.
 * - Muestra el header personalizado y logo de fondo.
 * - Incluye feedback visual con toasts y spinner de carga.
 * - Modal para crear y editar jugadores.
 * - Permite subir y actualizar la foto del jugador usando Supabase Storage.
 * - Calcula y muestra la edad del jugador a partir de la fecha de nacimiento.
 */
import {
  Box,
  Text,
  IconButton,
  Avatar,
  Button,
  Spinner,
  useDisclosure,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  VStack,
  Select,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus, FaUser, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";

// Configuración de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const Jugadores = () => {
  const { onOpen } = useDisclosure();
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });
  const [editandoJugadorId, setEditandoJugadorId] = useState(null);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posiciones, setPosiciones] = useState([]);
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Añade este estado
  const toast = useToast();
  const navigate = useNavigate();

  const [jugadorForm, setJugadorForm] = useState({
    nombre: "",
    fecha_nacimiento: "",
    dorsal: "",
    posicion: "",
    foto: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJugadorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setJugadorForm((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  const handleFotoEditChange = (e) => {
    setSelectedFoto(e.target.files[0]);
  };

  const abrirModalEditar = (jugador) => {
    setJugadorForm({
      nombre: jugador.nombre || "",
      fecha_nacimiento: jugador.fecha_nac || "",
      dorsal: jugador.dorsal?.toString() || "",
      posicion: jugador.posiciones?.[0]?.id?.toString() || "",
      foto: null,
    });
    setEditandoJugadorId(jugador.id);
    setSelectedFoto(null);
    setIsModalOpen(true);
  };

  const subirFotoJugador = async (file, jugadorId) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `jugador_${jugadorId}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("imagenes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      toast({
        title: "Error al subir la foto",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("imagenes")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const crearJugador = async () => {
    const token = localStorage.getItem("token");
    let fotoUrl = "foto.jpg";

    // Si el usuario ha seleccionado una foto, súbela primero
    if (jugadorForm.foto) {
      const nuevaFotoUrl = await subirFotoJugador(jugadorForm.foto, Date.now());
      if (nuevaFotoUrl) {
        fotoUrl = nuevaFotoUrl;
      }
    }

    const body = {
      nombre: jugadorForm.nombre,
      fecha_nac: jugadorForm.fecha_nacimiento,
      foto: fotoUrl,
      dorsal: parseInt(jugadorForm.dorsal),
      equipos_id: parseInt(equipoSeleccionado),
      posiciones: jugadorForm.posicion ? [parseInt(jugadorForm.posicion)] : [],
      golesei: 0,
      golesli: 0,
      golesld: 0,
      goles7m: 0,
      golesc: 0,
      golesed: 0,
      golest: 0,
      golespi: 0,
      lanzamiento_7m: 0,
      lanzamientos: 0,
      perdidas: 0,
      recuperaciones: 0,
      exclusiones: 0,
      tarjetas_amarillas: 0,
      tarjetas_rojas: 0,
      tarjetas_azules: 0,
      lanzamiento_ed: 0,
      lanzamiento_ei: 0,
      lanzamiento_ld: 0,
      lanzamiento_li: 0,
      lanzamiento_c: 0,
      lanzamiento_pi: 0,
      lanzamiento_ext_li: 0,
      lanzamiento_ext_ld: 0,
      lanzamiento_ext_c: 0,
      exclusion_2_min: 0,
      fallo_pase: 0,
      fallo_recepcion: 0,
      pasos: 0,
      falta_en_ataque: 0,
      dobles: 0,
      invasion_area: 0,
      blocaje: 0,
      robo: 0,
      gol_en_contra_ei: 0,
      gol_en_contra_ed: 0,
      gol_en_contra_li: 0,
      gol_en_contra_c: 0,
      gol_en_contra_ld: 0,
      gol_en_contra_pi: 0,
      gol_en_contra_7m: 0,
      lanzamiento_en_contra_ei: 0,
      lanzamiento_en_contra_ed: 0,
      lanzamiento_en_contra_li: 0,
      lanzamiento_en_contra_c: 0,
      lanzamiento_en_contra_ld: 0,
      lanzamiento_en_contra_pi: 0,
      lanzamiento_en_contra_7m: 0,
    };

    try {
      const res = await fetch(
        `https://myhandstats.onrender.com/equipo/${equipoSeleccionado}/jugador/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        let errorMsg = "No se pudo crear el jugador";
        try {
          const errorData = await res.json();
          if (errorData && errorData.detail) {
            errorMsg = errorData.detail;
          }
        } catch {
          errorMsg = "Error desconocido al crear el jugador";
        }
        toast({
          title: "Error",
          description: errorMsg,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      setIsModalOpen(false);
      setJugadorForm({
        nombre: "",
        fecha_nacimiento: "",
        dorsal: "",
        posicion: "",
        foto: null,
      });
      cargarJugadores();
      toast({
        title: "Jugador creado",
        description: "El jugador se ha creado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo crear el jugador. Inténtalo de nuevo.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error("Error al crear jugador:", err);
    }
  };

  const editarJugador = async () => {
    const token = localStorage.getItem("token");
    let fotoUrl = null;

    // Si hay una nueva foto seleccionada, súbela primero
    if (selectedFoto && editandoJugadorId) {
      fotoUrl = await subirFotoJugador(selectedFoto, editandoJugadorId);
    }

    const body = {
      nombre: jugadorForm.nombre,
      fecha_nac: jugadorForm.fecha_nacimiento,
      dorsal: parseInt(jugadorForm.dorsal),
      posiciones: jugadorForm.posicion ? [parseInt(jugadorForm.posicion)] : [],
    };

    if (fotoUrl) {
      body.foto = fotoUrl;
    }

    try {
      const res = await fetch(
        `https://myhandstats.onrender.com/equipo/${equipoSeleccionado}/jugador/${editandoJugadorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        let errorMsg = "No se pudo actualizar el jugador";
        try {
          const errorData = await res.json();
          if (
            errorData &&
            (errorData.detail?.toLowerCase().includes("dorsal") ||
              errorData.detail?.toLowerCase().includes("ya existe"))
          ) {
            errorMsg = errorData.detail;
          }
        } catch {}
        toast({
          title: "Error",
          description: errorMsg,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      setIsModalOpen(false);
      setEditandoJugadorId(null);
      setJugadorForm({
        nombre: "",
        fecha_nacimiento: "",
        dorsal: "",
        posicion: "",
        foto: null,
      });
      setSelectedFoto(null);
      cargarJugadores();
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el jugador. Inténtalo de nuevo.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      console.error("Error al editar jugador:", err);
    }

    // Si se está editando la posición, hacer la petición aparte
    if (jugadorForm.posicion) {
      try {
        await fetch(
          `https://myhandstats.onrender.com/equipo/${equipoSeleccionado}/jugador/${editandoJugadorId}/posicion`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ posicion_id: jugadorForm.posicion[0] }),
          }
        );
      } catch (err) {
        console.error("Error al actualizar la posición:", err);
      }
    }
  };

  const cargarJugadores = () => {
    const token = localStorage.getItem("token");
    const equipoId = localStorage.getItem("id_equipo");

    if (!equipoId) return;

    setEquipoSeleccionado(equipoId);
    setLoading(true);

    fetch(`https://myhandstats.onrender.com/equipo/${equipoId}/jugadores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJugadores(data);
        } else {
          console.error("Respuesta inesperada:", data);
          setJugadores([]);
        }
      })
      .catch((err) => console.error("Error al cargar jugadores:", err))
      .finally(() => setLoading(false));
  };

  const cargarPosiciones = () => {
    fetch("https://myhandstats.onrender.com/posiciones")
      .then((res) => res.json())
      .then((data) => setPosiciones(data))
      .catch((err) => console.error("Error al cargar posiciones:", err));
  };

  // Cargar datos de usuario y club igual que en DashboardPrincipal
  useEffect(() => {
    const token = localStorage.getItem("token");
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
        // Buscar el club por id del token
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
    // ...otros useEffect existentes...
    cargarJugadores();
    cargarPosiciones();
  }, []);

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <AuthWrapper requiredRole={null}>
      <Box p={4} position="relative">
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
          texto="Jugadores"
        />

        {/* Buscador por nombre */}
        {jugadores.length > 0 && (
          <Box maxW="350px" mx="auto" mb={6}>
            <Input
              placeholder="Buscar jugador por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              bg="white"
              borderColor="#b2f5ea"
              _focus={{
                borderColor: "#319795",
                boxShadow: "0 0 0 1px #319795",
              }}
            />
          </Box>
        )}

        {loading ? (
          <Box textAlign="center" mt={10}>
            <Spinner size="xl" color="teal.600" />
          </Box>
        ) : jugadores.length === 0 ? (
          <Box textAlign="center" mt={10}>
            <Text color="gray.500" fontWeight="bold" fontSize="xl">
              No existen jugadores todavía.
            </Text>
          </Box>
        ) : (
          <Flex wrap="wrap" gap={8} justify="center" align="flex-start">
            {jugadores
              .filter((jugador) =>
                jugador.nombre.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((jugador) => (
                <Box
                  key={jugador.id}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  p={5}
                  maxW="290px"
                  w="100%"
                  mx="auto"
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: "lg",
                    bg: "gray.50",
                  }}
                  position="relative"
                  mb={8}
                  border="1px solid #e2e8f0"
                >
                  {/* Tarjeta de jugador con datos y botón de edición */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    position="relative"
                    zIndex={1}
                    p={0}
                    pt={2}
                  >
                    <IconButton
                      icon={<FaUserEdit />}
                      size="sm"
                      position="absolute"
                      top={2}
                      right={2}
                      aria-label="Editar jugador"
                      onClick={() => abrirModalEditar(jugador)}
                      bg="#014C4C"
                      color="white"
                      boxShadow="sm"
                      _hover={{ bg: "#013C3C" }}
                    />
                    <Avatar
                      icon={<FaUser />}
                      size="xl"
                      bg="#b2f5ea"
                      mb={2}
                      mx="auto"
                      border="2px solid #319795"
                      boxShadow="md"
                      src={
                        jugador.foto && jugador.foto !== "foto.jpg"
                          ? jugador.foto
                          : undefined
                      }
                      name={jugador.nombre}
                    />
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="#014C4C"
                      mb={1}
                      letterSpacing="wide"
                    >
                      {jugador.nombre}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Edad:{" "}
                      {jugador.fecha_nac
                        ? calcularEdad(jugador.fecha_nac) + " años"
                        : "—"}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="#319795"
                      fontWeight="semibold"
                      mb={1}
                    >
                      Dorsal: {jugador.dorsal}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      mb={3}
                      fontStyle="italic"
                    >
                      {jugador.posiciones && jugador.posiciones.length > 0
                        ? jugador.posiciones
                            .map((p) => p.nombre.replace(/_/g, " "))
                            .join(", ")
                        : "Sin posición"}
                    </Text>
                    <Button
                      bg="#319795"
                      color="white"
                      size="sm"
                      borderRadius="full"
                      fontWeight="bold"
                      px={6}
                      _hover={{
                        bg: "#285e61",
                        transform: "scale(1.04)",
                      }}
                      boxShadow="sm"
                      onClick={() => navigate(`/jugador/${jugador.id}/stats`)}
                    >
                      Ver Stats
                    </Button>
                  </Box>
                </Box>
              ))}
          </Flex>
        )}

        {/* Botón para abrir modal de creación */}
        <IconButton
          icon={<FaPlus />}
          bg="#014C4C"
          color="white"
          borderRadius="full"
          size="lg"
          position="fixed"
          bottom={6}
          right={6}
          aria-label="Añadir jugador"
          boxShadow="lg"
          _hover={{ bg: "#013C3C" }}
          onClick={() => {
            setEditandoJugadorId(null);
            setJugadorForm({
              nombre: "",
              fecha_nacimiento: "",
              dorsal: "",
              posicion: "",
              foto: null,
            });
            setIsModalOpen(true);
          }}
        />

        {/* Modal para crear o editar jugador */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editandoJugadorId ? "Editar Jugador" : "Crear Jugador"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <Input
                    name="nombre"
                    placeholder="Nombre del Jugador"
                    value={jugadorForm.nombre}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="fecha_nacimiento"
                    type="date"
                    placeholder="Fecha Nacimiento"
                    value={jugadorForm.fecha_nacimiento}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="dorsal"
                    type="number"
                    min={1}
                    max={99}
                    placeholder="Dorsal"
                    value={jugadorForm.dorsal}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Select
                    name="posicion"
                    placeholder="Selecciona una posición"
                    value={jugadorForm.posicion}
                    onChange={(e) =>
                      setJugadorForm((prev) => ({
                        ...prev,
                        posicion: e.target.value,
                      }))
                    }
                  >
                    {posiciones.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.nombre.replace(/_/g, " ")}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {/* Permitir subir foto al crear o editar */}
                {!editandoJugadorId && (
                  <FormControl>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Foto del jugador (opcional):
                    </Text>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                )}
                {/* Solo permitir subir foto en edición */}
                {editandoJugadorId && (
                  <FormControl>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Cambiar foto del jugador:
                    </Text>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoEditChange}
                    />
                  </FormControl>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="#014C4C"
                color="white"
                _hover={{ bg: "#013C3C" }}
                onClick={editandoJugadorId ? editarJugador : crearJugador}
              >
                {editandoJugadorId ? "Guardar Cambios" : "Crear Jugador"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AuthWrapper>
  );
};

export default Jugadores;
