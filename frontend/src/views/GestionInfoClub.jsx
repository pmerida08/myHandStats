import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Avatar,
  Button,
  Spinner,
  Center,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  Textarea,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaBars, FaEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";

const ClubInfo = () => {
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        // Decoding token for validation, but not using the decoded value
        JSON.parse(atob(storedToken.split(".")[1]));
        setToken(storedToken);
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setIsTokenLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("https://myhandstats.onrender.com/club/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setClubInfo(data);
        setFormData(data);
      })
      .catch((err) => {
        toast({
          title: "Error al cargar información del club",
          status: "error",
          description: err.message,
          isClosable: true,
        });
      })
      .finally(() => setLoading(false));
  }, [token, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = () => {
    fetch("https://myhandstats.onrender.com/club/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar club");
        return res.json();
      })
      .then(() => {
        toast({
          title: "Información actualizada correctamente",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setClubInfo(formData);
        setIsModalOpen(false);
      })
      .catch((err) => {
        toast({
          title: "Error al actualizar",
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

  return (
    <AuthWrapper requiredRole={null}>
      <Box p={4} position="relative">
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Flex align="center" justify="space-between" mb={8}>
          <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
          <Heading size="lg" color="#014C4C">
            Información del Club
          </Heading>
          <Box w="6" />
        </Flex>

        {loading ? (
          <Center mt={10}>
            <Spinner size="xl" color="teal.600" />
          </Center>
        ) : clubInfo ? (
          <VStack align="start" spacing={4} p={4} bg="#e0f7f7" borderRadius="xl">
            <HStack spacing={6}>
              <Avatar size="xl" src={clubInfo.logo} />
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">
                  {clubInfo.nombre}
                </Text>
                <Text color="gray.600">{clubInfo.descripcion}</Text>
              </VStack>
            </HStack>
            <Text>
              <strong>Teléfono:</strong> {clubInfo.tel_contacto}
            </Text>
            <Text>
              <strong>Suscripción:</strong> {clubInfo.suscripcion_at}
            </Text>
            <Text>
              <strong>Fecha suscripción:</strong> {clubInfo.fecha_suscrip}
            </Text>
            <Button
              size="sm"
              leftIcon={<FaEdit />}
              colorScheme="teal"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              Editar Información
            </Button>
          </VStack>
        ) : (
          <Text>No se encontró información del club.</Text>
        )}

        {/* Modal de edición */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Información del Club</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <Input
                    name="nombre"
                    placeholder="Nombre del club"
                    value={formData.nombre || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="logo"
                    placeholder="URL del logo"
                    value={formData.logo || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="tel_contacto"
                    placeholder="Teléfono de contacto"
                    value={formData.tel_contacto || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="suscripcion_at"
                    placeholder="Tipo de suscripción"
                    value={formData.suscripcion_at || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    name="fecha_suscrip"
                    type="date"
                    value={formData.fecha_suscrip || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={guardarCambios}>
                Guardar
              </Button>
              <Button onClick={() => setIsModalOpen(false)} ml={3}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AuthWrapper>
  );
};

export default ClubInfo;
