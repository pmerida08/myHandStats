import {
  Box,
  Text,
  SimpleGrid,
  IconButton,
  Avatar,
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
  Select,
  Center,
  Heading,
  useToast
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus, FaUser, FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";

const UsuariosClubAdmin = () => {
  const gridCols = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "",
  });

  const [clubId, setClubId] = useState(null);
  const [token, setToken] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

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
          setClubId(decodedToken.clubs_id);  // <-- Obtener clubs_id
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
    if (nuevoUsuario.contraseña !== nuevoUsuario.confirmarContraseña) {
      toast({
        title: "Las contraseñas no coinciden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const usuarioAEnviar = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      password: nuevoUsuario.contraseña,
      rol: nuevoUsuario.rol,
      clubs_id: clubId, 
    };

    

    fetch("https://myhandstats.onrender.com/club/usuario/register", {
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
          contraseña: "",
          confirmarContraseña: "",
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
    <AuthWrapper requiredRole={null}>
      <Box p={4} position="relative">
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Flex align="center" justify="space-between" mb={8}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Heading size="lg" color="#014C4C">
            Gestión de Usuarios del Club
          </Heading>
          <Box w="6" />
        </Flex>

        {loading ? (
          <Box textAlign="center" mt={10}>
            <Spinner size="xl" color="teal.600" />
          </Box>
        ) : (
          <SimpleGrid columns={gridCols} spacing={6}>
            {usuarios.map((usuario) => (
              <Box
                key={usuario.id}
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
                <Avatar icon={<FaUser />} size="2xl" bg="#a8dadc" mb={4} />
                <Text fontWeight="bold" fontSize="lg" color="#014C4C" mb={1}>
                  {usuario.nombre}
                </Text>
                <Text fontSize="sm" color="gray.600" mb={1}>
                  Email: {usuario.email}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Rol: {usuario.rol}
                </Text>
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
          aria-label="Añadir usuario"
          boxShadow="lg"
          _hover={{ bg: "#013C3C" }}
          onClick={() => setIsModalOpen(true)}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Crear Nuevo Usuario</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <Input
                    name="nombre"
                    placeholder="Nombre del usuario"
                    value={nuevoUsuario.nombre}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={nuevoUsuario.email}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="contraseña"
                    type="password"
                    placeholder="Contraseña"
                    value={nuevoUsuario.contraseña}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="confirmarContraseña"
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={nuevoUsuario.confirmarContraseña}
                    onChange={handleInputChange}
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
              <Button colorScheme="teal" mr={3} onClick={crearUsuario}>
                Crear
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
