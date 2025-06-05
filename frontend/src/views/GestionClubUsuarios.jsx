import {
  Box,
  Text,
  SimpleGrid,
  IconButton,
  Avatar,
  Button,
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
  Select,
  Center,
  Heading,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus, FaUser, FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const UsuariosClubAdmin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    rol: "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [clubId, setClubId] = useState(null);
  const [token, setToken] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [club, setClub] = useState({ nombre: "", logo: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
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

  useEffect(() => {
    if (token) {
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
    }
  }, [token]);

  const cargarUsuarios = () => {
    setLoading(true);
    fetch("https://myhandstats.onrender.com/club/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err))
      .finally(() => setLoading(false));
  };

  const crearUsuario = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.rol) {
      toast({
        title: "Todos los campos son obligatorios.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const usuarioAEnviar = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol
    };

    console.log("Enviando usuario:", usuarioAEnviar);

    fetch("https://myhandstats.onrender.com/club/crear-por-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(usuarioAEnviar),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear usuario");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Usuario creado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsModalOpen(false);
        setNuevoUsuario({
          nombre: "",
          email: "",
          rol: "",
        });
        cargarUsuarios();
      })
      .catch((err) => {
        console.error("Error al crear usuario:", err);
        toast({
          title: "Error al crear usuario",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const editarUsuario = () => {
    // Solo permite cambiar el rol
    const usuarioEditado = {
      rol: nuevoUsuario.rol,
    };

    fetch(`https://myhandstats.onrender.com/club/usuario/${usuarioSeleccionado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(usuarioEditado),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar usuario");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Rol actualizado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsModalOpen(false);
        setNuevoUsuario({
          nombre: "",
          email: "",
          rol: "",
        });
        setModoEdicion(false);
        setUsuarioSeleccionado(null);
        cargarUsuarios();
      })
      .catch((err) => {
        console.error("Error al editar usuario:", err);
        toast({
          title: "Error al editar usuario",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const abrirModalEdicion = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario);
    setNuevoUsuario({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (token) cargarUsuarios();
  }, [token]);

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
        <Image
          src="/myHandstatsLogo.png"
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
          texto="Gestión de Usuarios del Club"
        />
        <Sidebar isOpen={isOpen} onClose={onClose} />
        {/* Elimina el Flex con el Heading, ya que el Header lo muestra */}
        {/* 
        <Flex align="center" justify="space-between" mb={8}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Heading size="lg" color="#014C4C">
            Gestión de Usuarios del Club
          </Heading>
          <Box w="6" />
        </Flex>
        */}
        {loading ? (
          <Box textAlign="center" mt={10}>
            <Spinner size="xl" color="teal.600" />
          </Box>
        ) : (
          <Flex
            wrap="wrap"
            gap={4}
            justify="center"
            align="flex-start"
          >
            {usuarios
              .filter((usuario) => usuario.rol !== "admin")
              .map((usuario) => (
                <Box
                  key={usuario.id}
                  bg="white"
                  opacity={0.93}
                  borderRadius="xl"
                  boxShadow="0 4px 16px 0 rgba(31, 38, 135, 0.10)"
                  p={0}
                  maxW="260px"
                  w="100%"
                  mx="auto"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl",
                    bg: "#f0fdfa",
                    opacity: 1,
                  }}
                  position="relative"
                  mb={2}
                  border="1.5px solid #b2f5ea"
                  overflow="hidden"
                >
                  {/* Círculo decorativo sutil */}
                  <Box
                    position="absolute"
                    top={-10}
                    right={-10}
                    bg="#319795"
                    opacity={0.08}
                    borderRadius="full"
                    boxSize="60px"
                    zIndex={0}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    position="relative"
                    zIndex={1}
                    p={5}
                    pt={7}
                  >
                    <Avatar icon={<FaUser />} size="lg" bg="#a8dadc" mb={3} border="2px solid #38b2ac" boxShadow="md" />
                    <Text fontWeight="bold" fontSize="lg" color="#014C4C" mb={1} letterSpacing="wide">
                      {usuario.nombre}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Email: {usuario.email}
                    </Text>
                    <Text fontSize="sm" color="#319795" fontWeight="semibold" mb={2}>
                      Rol: {usuario.rol}
                    </Text>
                    <Button
                      size="sm"
                      bgGradient="linear(to-r, #319795, #38b2ac)"
                      color="white"
                      borderRadius="full"
                      fontWeight="bold"
                      px={5}
                      mt={2}
                      _hover={{
                        bgGradient: "linear(to-r, #285e61, #319795)",
                        transform: "scale(1.05)",
                      }}
                      boxShadow="sm"
                      onClick={() => abrirModalEdicion(usuario)}
                    >
                      Editar
                    </Button>
                  </Box>
                </Box>
              ))}
          </Flex>
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
          aria-label="Añadir usuario"
          boxShadow="lg"
          _hover={{ bg: "#013C3C" }}
          onClick={() => {
            setModoEdicion(false);
            setNuevoUsuario({
              nombre: "",
              email: "",
              rol: "",
            });
            setIsModalOpen(true);
          }}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isDisabled={modoEdicion}>
                  <Input
                    name="nombre"
                    placeholder="Nombre del usuario"
                    value={nuevoUsuario.nombre}
                    onChange={handleInputChange}
                    isReadOnly={modoEdicion}
                  />
                </FormControl>
                <FormControl isDisabled={modoEdicion}>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={nuevoUsuario.email}
                    onChange={handleInputChange}
                    isReadOnly={modoEdicion}
                  />
                </FormControl>
                <FormControl>
                  <Select
                    name="rol"
                    placeholder="Selecciona un rol"
                    value={nuevoUsuario.rol}
                    onChange={handleInputChange}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="entrenador">Entrenador</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={modoEdicion ? editarUsuario : crearUsuario}>
                {modoEdicion ? "Guardar cambios" : "Crear"}
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

export default UsuariosClubAdmin;
