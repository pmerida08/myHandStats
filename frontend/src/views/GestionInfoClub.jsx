/**
 * ClubInfo
 *
 * Vista de administración para editar la información general del club.
 * Permite:
 * - Visualizar los datos actuales del club (nombre, descripción, teléfono, suscripción, logo).
 * - Editar los datos del club y subir un nuevo logo.
 *
 * Características:
 * - Solo accesible para usuarios con rol "admin".
 * - Muestra el header y sidebar personalizados.
 * - Incluye feedback visual con toasts y spinner de carga.
 * - Modal para editar la información del club.
 */
import {
  Box,
  Text,
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
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import AuthWrapper from "../components/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";

// Configuración de Supabase para subir imágenes/logos
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ClubInfo = () => {
  const [clubInfo, setClubInfo] = useState(null); // Datos actuales del club
  const [loading, setLoading] = useState(true); // Estado de carga de datos
  const [formData, setFormData] = useState({}); // Datos del formulario de edición
  const [selectedFile, setSelectedFile] = useState(null); // Archivo de logo seleccionado
  const [userName, setUserName] = useState(""); // Nombre del usuario para el header
  const [club, setClub] = useState({ nombre: "", logo: "" }); // Info club para el header
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de edición
  const [token, setToken] = useState(null); // Token JWT
  const [isTokenLoading, setIsTokenLoading] = useState(true); // Estado de carga del token
  const navigate = useNavigate();

  /**
   * useEffect inicial:
   * - Verifica el token y lo guarda en el estado.
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
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

  /**
   * useEffect para cargar la información del club.
   */
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

  /**
   * useEffect para cargar datos del usuario y club para el header.
   */
  useEffect(() => {
    if (!token) return;
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
  }, [token]);

  /**
   * Maneja los cambios en los inputs del formulario de edición.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Sube el logo seleccionado a Supabase Storage y retorna la URL pública.
   * @param {File} file - Archivo de imagen a subir
   * @returns {Promise<string>} URL pública del logo subido
   */
  const subirLogo = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `club_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from("imagenes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error al subir el logo:", error.message);
      throw new Error("Error al subir el logo");
    }

    const { data: urlData } = supabase.storage
      .from("imagenes")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  /**
   * Guarda los cambios realizados en la información del club.
   * Si se seleccionó un nuevo logo, lo sube y actualiza la URL.
   */
  const guardarCambios = async () => {
    try {
      let updatedData = { ...formData };

      if (selectedFile) {
        const logoUrl = await subirLogo(selectedFile);
        updatedData.logo = logoUrl;
      }

      console.log("Datos a actualizar:", updatedData);

      const response = await fetch("https://myhandstats.onrender.com/club/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al actualizar club");

      toast({
        title: "Información actualizada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setClubInfo(updatedData);
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      toast({
        title: "Error al actualizar",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Spinner de carga mientras se verifica el acceso
  if (isTokenLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <AuthWrapper requiredRole={"admin"}>
      <Box p={6} bg="#f0f4f5" minH="100vh" opacity={0.97} position="relative">
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
          texto="Información del Club"
        />
        <Sidebar isOpen={isOpen} onClose={onClose} />

        {loading ? (
          <Center mt={10}>
            <Spinner size="xl" color="teal.600" />
          </Center>
        ) : clubInfo ? (
          <Flex
            direction="column"
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            maxW="600px"
            mx="auto"
            opacity={0.95}
          >
            <HStack spacing={6} mb={4}>
              <Avatar
                size="2xl"
                src={clubInfo.logo}
                name={clubInfo.nombre}
                border="3px solid #319795"
                boxShadow="md"
              />
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {clubInfo.nombre}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {clubInfo.descripcion || "Sin descripción"}
                </Text>
              </VStack>
            </HStack>

            <VStack spacing={2} align="start" fontSize="md" color="gray.700">
              <Text>
                <strong>Teléfono:</strong>{" "}
                {clubInfo.tel_contacto || "No disponible"}
              </Text>
              <Text>
                <strong>Suscripción:</strong>{" "}
                {clubInfo.suscripcion_at || "No definida"}
              </Text>
              <Text>
                <strong>Fecha de suscripción:</strong>{" "}
                {clubInfo.fecha_suscrip || "No registrada"}
              </Text>
            </VStack>

            <Button
              mt={6}
              leftIcon={<FaEdit />}
              colorScheme="teal"
              size="md"
              alignSelf="flex-end"
              onClick={() => setIsModalOpen(true)}
            >
              Editar Información
            </Button>
          </Flex>
        ) : (
          <Center>
            <Text color="red.500">No se encontró información del club.</Text>
          </Center>
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
            <ModalHeader color="teal.700">
              Editar Información del Club
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
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
                <FormControl>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Subir nuevo logo (opcional):
                  </Text>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={guardarCambios}>
                Guardar
              </Button>
              <Button
                variant="ghost"
                ml={3}
                onClick={() => setIsModalOpen(false)}
              >
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
