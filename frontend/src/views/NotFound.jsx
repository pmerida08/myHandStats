import { Box, Heading, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Image
        src="https://rdpazmfdbcundrogccsb.supabase.co/storage/v1/object/public/imagenes//logo.avif"
        alt="MyHandStats Logo"
        boxSize="100px"
        mx="auto"
        mb={2}
      />
      <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={4}>
        MyHandStats
      </Text>
      <Heading as="h2" size="xl" mb={4}>
        404 - Página no encontrada
      </Heading>
      <Text color="gray.500" mb={6}>
        La ruta que estás buscando no existe.
      </Text>
      <Button
        colorScheme="blue"
        onClick={() => navigate("/")}
        background="#014C4C"
      >
        Volver al inicio
      </Button>
    </Box>
  );
}