import {
  Box,
  Text,
  SimpleGrid,
  IconButton,
  Button,
  useBreakpointValue,
  Spinner,
  useDisclosure,
  Flex,
  Icon,
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
  Center,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus, FaBars, FaEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";

const EquiposClubAdmin = () => {
  const gridCols = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(false); // false = crear, true = editar
  const [equipoActual, setEquipoActual] = useState({
    id: null,
    nombre: "",
    categoria: "",
    descripcion: "",
  });

  const navigate = useNavigate();

  // Cargar token y clubId
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
        if (decodedToken.rol !== "admin") {
          navigate("/dashboard");
        } else {
          setToken(storedToken);
          setClubId(decodedToken.clubs_id);
        }
      } catch (error) {
        console.error("Error al decodificar el token", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setIsTokenLoading(false);
  }, [navigate]);

  const cargarEquipos = () => {
    setLoading(true);
    fetch("https://myhandstats.onrender.com/club/equipos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar equipos");
        return res.json();
      })
      .then((data) => setEquipos(data))
      .catch((err) => {
        console.error("Error al cargar equipos:", err);
        toast({
          title: "Error al cargar equipos",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) cargarEquipos();
  }, [token]);

  // Abrir modal para crear nuevo equipo
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setEquipoActual({ id: null, nombre: "", categoria: "", descripcion: "" });
    setIsModalOpen(true);
  };

  // Abrir modal para editar equipo
  const abrirModalEditar = (equipo) => {
    setModoEdicion(true);
    setEquipoActual({
      id: equipo.id,
      nombre: equipo.nombre,
      categoria: equipo.categoria,
      descripcion: equipo.descripcion,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipoActual((prev) => ({ ...prev, [name]: value }));
  };

  const guardarEquipo = () => {
    // Validar campos básicos
    if (
      !equipoActual.nombre.trim() ||
      !equipoActual.categoria.trim() ||
      !equipoActual.descripcion.trim()
    ) {
      toast({
        title: "Por favor completa todos los campos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const url = modoEdicion
      ? `https://myhandstats.onrender.com/club/equipo/${equipoActual.id}`
      : "https://myhandstats.onrender.com/club/nuevo_equipo";

    const method = modoEdicion ? "PUT" : "POST";

    const equipoAEnviar = {
      nombre: equipoActual.nombre,
      categoria: equipoActual.categoria,
      descripcion: equipoActual.descripcion,
      clubs_id: clubId,
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(equipoAEnviar),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar equipo");
        return res.json();
      })
      .then(() => {
        toast({
          title: modoEdicion
            ? "Equipo actualizado exitosamente"
            : "Equipo creado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsModalOpen(false);
        cargarEquipos();
      })
      .catch((err) => {
        console.error("Error al guardar equipo:", err);
        toast({
          title: "Error al guardar equipo",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  if (isTokenLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!token) return null;

  return (
    <AuthWrapper requiredRole={"admin"}>
      <Box p={4} position="relative">
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Flex align="center" justify="space-between" mb={8}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Heading size="lg" color="#014C4C">
            Gestión de Equipos del Club
          </Heading>
          <Box w="6" />
        </Flex>

        {loading ? (
          <Box textAlign="center" mt={10}>
            <Spinner size="xl" color="teal.600" />
          </Box>
        ) : (
          <SimpleGrid columns={gridCols} spacing={6}>
            {equipos.map((equipo) => (
              <Box
                key={equipo.id}
                bg="#e0f7f7"
                borderRadius="2xl"
                boxShadow="lg"
                p={6}
                textAlign="center"
                maxW="320px"
                w="100%"
                mx="auto"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  bg: "#d3f0f0",
                }}
              >
                <Text
                  fontWeight="bold"
                  fontSize="xl"
                  color="#014C4C"
                  mb={2}
                  noOfLines={1}
                >
                  {equipo.nombre}
                </Text>
                <Text fontSize="md" color="gray.700" mb={2} noOfLines={1}>
                  Categoría: {equipo.categoria}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4} noOfLines={2}>
                  {equipo.descripcion}
                </Text>

                <Button
                  size="sm"
                  leftIcon={<FaEdit />}
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => abrirModalEditar(equipo)}
                >
                  Editar
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}

        <IconButton
          icon={<FaPlus />}
          bg="#014C4C"
          color="white"
          borderRadius="full"
          size="lg"
          position="fixed"
          bottom={6}
          right={6}
          aria-label="Añadir equipo"
          boxShadow="lg"
          _hover={{ bg: "#013C3C" }}
          onClick={abrirModalCrear}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {modoEdicion ? "Editar Equipo" : "Crear Nuevo Equipo"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <Input
                    name="nombre"
                    placeholder="Nombre del equipo"
                    value={equipoActual.nombre}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="categoria"
                    placeholder="Categoría"
                    value={equipoActual.categoria}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="descripcion"
                    placeholder="Descripción"
                    value={equipoActual.descripcion}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={guardarEquipo}>
                {modoEdicion ? "Guardar Cambios" : "Crear Equipo"}
              </Button>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AuthWrapper>
  );
};

export default EquiposClubAdmin;
