import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Text,
  Heading,
  Image,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CambiarContraseñaForm = () => {
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el token de la URL
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  console.log("Token extraído de la URL:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaContraseña || !confirmarContraseña) {
      toast({
        title: "Campos obligatorios",
        description: "Debes completar ambos campos.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    if (nuevaContraseña !== confirmarContraseña) {
      toast({
        title: "Las contraseñas no coinciden",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post("http://localhost:8000/auth/establecer-contrasena/", {
        token,
        nueva_contraseña: nuevaContraseña,
      });

      toast({
        title: "Contraseña cambiada",
        description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error al cambiar la contraseña",
        description: error.response?.data?.detail || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center minH="100vh" bg="#e6f7fa">
      <Box
        w="100%"
        maxW="400px"
        p={6}
        borderRadius="lg"
        boxShadow="md"
        bg="white"
        border="1px solid #b2f5ea"
      >
        <Center mb={4}>
          <Image
            src="/myHandstatsLogo.png"
            alt="Logo MyHandStats"
            boxSize="80px"
            objectFit="contain"
          />
        </Center>
        <Heading as="h2" size="md" textAlign="center" color="#014C4C" mb={2}>
          Establecer nueva contraseña
        </Heading>
        <Text textAlign="center" color="gray.600" mb={4} fontSize="sm">
          Introduce y confirma tu nueva contraseña para activar tu cuenta.
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="#014C4C" fontSize="sm">
                Nueva contraseña
              </FormLabel>
              <Input
                type="password"
                value={nuevaContraseña}
                onChange={(e) => setNuevaContraseña(e.target.value)}
                placeholder="Nueva contraseña"
                bg="gray.50"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="#014C4C" fontSize="sm">
                Repite la contraseña
              </FormLabel>
              <Input
                type="password"
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
                placeholder="Repite la contraseña"
                bg="gray.50"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="100%"
              fontWeight="bold"
              borderRadius="md"
            >
              Cambiar contraseña
            </Button>
          </VStack>
        </form>
        <Box mt={6} p={2} bg="#e6f7fa" borderRadius="md" textAlign="center">
          <Text color="#014C4C" fontSize="xs">
            Solo puedes cambiar la contraseña desde este enlace. Después serás
            redirigido al login.
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default CambiarContraseñaForm;
