import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Button,
  Flex,
  Icon,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const SeleccionEquipo = () => {
  const [club, setClub] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const toast = useToast();

  const token = localStorage.getItem("token");

  // Cargar datos del club y equipos
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://myhandstats.onrender.com/club", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el club");
        return res.json();
      })
      .then((data) => {
        setClub(data.info ? data.info[0] : data); // Ajusta según tu API
      })
      .catch((err) => {
        console.error(
          "No se encontró el club en localStorage o error en la API",
          err
        );
        navigate("/dashboard");
      });

    fetch("https://myhandstats.onrender.com/club/equipos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los equipos");
        return res.json();
      })
      .then((data) => {
        console.log('Datos recibidos de equipos:', data); 
        if (Array.isArray(data)) {
          setEquipos(data);
        } else {
          setEquipos([]);
        }
      })
      .catch((err) => {
        console.error("Error al obtener equipos:", err);
        setEquipos([]);
      })
      .finally(() => setLoading(false));

    // Comprobar si es admin
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setEsAdmin(decoded.rol === "admin");
    } catch (error) {
      setEsAdmin(false);
      console.error("Error al decodificar el token", error);
      navigate("/login");
    }
  }, [token, navigate]);

  const [nuevoEquipo, setNuevoEquipo] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
  });

  const handleSeleccion = (equipo) => {
    localStorage.setItem("id_equipo", equipo.id);
    navigate("/dashboard");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEquipo((prev) => ({ ...prev, [name]: value }));
  };

  const guardarEquipo = () => {
    if (
      !nuevoEquipo.nombre.trim() ||
      !nuevoEquipo.categoria.trim() ||
      !nuevoEquipo.descripcion.trim()
    ) {
      toast({
        title: "Por favor completa todos los campos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetch("https://myhandstats.onrender.com/club/nuevo_equipo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoEquipo),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear el equipo");
        return res.json();
      })
      .then((data) => {
        toast({
          title: "Equipo creado exitosamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setEquipos((prev) => [...prev, data]);
        onModalClose();
        setNuevoEquipo({ nombre: "", categoria: "", descripcion: "" });
      })
      .catch((err) => {
        console.error("Error al crear equipo:", err);
        toast({
          title: "Error al crear equipo",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const EquipoCard = ({ equipo }) => (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
      transition="0.2s"
      bg="white"
    >
      <Image
        src={equipo.logo || club.logo}
        alt={equipo.nombre}
        borderRadius="full"
        boxSize="100px"
        mb={4}
        objectFit="cover"
      />
      <Text fontSize="xl" fontWeight="bold" color="#014C4C" mb={4}>
        {equipo.nombre}
      </Text>
      <Text fontSize="l" fontWeight="bold" color="#014C4C" mb={4}>
        {club.nombre}
      </Text>

      {equipo.descripcion && equipo.categoria && (
        <Text color="gray.600" mb={4}>
          {equipo.categoria} - {equipo.descripcion}
        </Text>
      )}

      <Button colorScheme="teal" onClick={() => handleSeleccion(equipo)}>
        Seleccionar
      </Button>
    </Box>
  );

  const CrearEquipoCard = () => (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      cursor="pointer"
      _hover={{ boxShadow: "lg", transform: "translateY(-2px)", bg: "gray.50" }}
      transition="0.2s"
      bg="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      onClick={onModalOpen}
      textAlign="center"
    >
      <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={2}>
        + Crear nuevo equipo
      </Text>
      <Text color="gray.500">Haz clic para añadir tu primer equipo</Text>
    </Box>
  );

  return (
    <Box p={6} minH="100vh" bg="white">
      {/* Sidebar desplegable */}
      <Sidebar isOpen={isOpen} onClose={onClose} />

        <Flex justify="space-between" align="center" mb={6}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Heading size="lg" color="#014C4C">
            Selecciona tu equipo
          </Heading>
          <Box w="6" />
        </Flex>

      {/* Contenido principal */}
      {loading ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" color="teal.600" />
        </Box>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {equipos.map((equipo) => (
            <Box
              key={equipo.id}
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
              transition="0.2s"
            >
              <Text fontSize="xl" fontWeight="bold" color="#014C4C" mb={1}>
                {equipo.nombre}
              </Text>
              <Text fontSize="md" color="gray.600" mb={1}>
                <Box as="span" fontWeight="bold" color="#014C4C">
                  Categoría:
                </Box>{' '}
                {equipo.categoria || 'No especificada'}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={3}>
                <Box as="span" fontWeight="bold" color="#014C4C">
                  Descripción:
                </Box>{' '}
                {equipo.descripcion || 'Sin descripción'}
              </Text>

              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => handleSeleccion(equipo)}
              >
                Seleccionar
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default SeleccionEquipo;
