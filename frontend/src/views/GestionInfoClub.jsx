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
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rdpazmfdbcundrogccsb.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcGF6bWZkYmN1bmRyb2djY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTA4MjksImV4cCI6MjA2MjA4NjgyOX0.sSfVgFsJvoFYnl-jc-wJabyYUisgwgDv1jwU9rpzsw4";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ClubInfo = () => {
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
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

  if (isTokenLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

//   async function testList() {
//   const { data, error } = await supabase.storage.from('imagenes').list();
//   if (error) {
//     console.error("Error listando archivos:", error);
//   } else {
//     console.log("Archivos en bucket:", data);
//   }
// }
// testList();

return (
  <AuthWrapper requiredRole={null}>
    <Box p={6} bg="#f0f4f5" minH="100vh">
      <Sidebar isOpen={isOpen} onClose={onClose} />

      <Flex align="center" justify="space-between" mb={8}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Heading size="lg" color="teal.700">
          Información del Club
        </Heading>
        <Box w="6" />
      </Flex>

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
              <strong>Teléfono:</strong> {clubInfo.tel_contacto || "No disponible"}
            </Text>
            <Text>
              <strong>Suscripción:</strong> {clubInfo.suscripcion_at || "No definida"}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="teal.700">Editar Información del Club</ModalHeader>
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
            <Button variant="ghost" ml={3} onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  </AuthWrapper>
);
}
export default ClubInfo;