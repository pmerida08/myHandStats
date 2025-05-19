import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NECESARIO para navegar
import avatar1 from "../assets/avatars/avatar_1.png";
import avatar2 from "../assets/avatars/avatar_2.png";
import avatar3 from "../assets/avatars/avatar_3.png";
import avatar4 from "../assets/avatars/avatar_4.png";

// Avatares falsos
const avatars = [avatar1, avatar2, avatar3, avatar4];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Inicializar

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://myhandstats.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error de backend:", errorText);
        throw new Error("Credenciales incorrectas");
      }

      const data = await res.json();
      sessionStorage.setItem("token", data.access_token); // ✅ Guardar token
      navigate("/dashboard"); // ✅ Redirección
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      alert("Email o contraseña incorrectos.");
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        backgroundImage="url('/Group 4.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="400px"
        backgroundPosition="top left"
        zIndex={0}
      />

      <Container maxW="container.sm" zIndex={1}>
        <Box
          bg="white"
          rounded="xl"
          boxShadow="xl"
          p={{ base: 6, md: 10 }}
          textAlign="center"
        >
          <Heading mb={2} fontSize="2xl" color="#F43F5E">
            Inicia Sesión
          </Heading>
          <Text fontSize="sm" mb={6} color="gray.600">
            ¿Cuántos goles has marcado? ¿Cuántos pases has fallado?
            <br />
            ¿Cuánta posesión ha tenido tu equipo? Esto y mucho más.
          </Text>

          <form onSubmit={handleLogin}>
            <Stack spacing={4} mb={4}>
              <FormControl>
                <Input
                  placeholder="tucorreo@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="gray.100"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="******"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="gray.100"
                  _placeholder={{ color: "gray.500" }}
                />
              </FormControl>
              <Button type="submit" bg="#F43F5E" color="white">
                Submit
              </Button>
            </Stack>
          </form>

          <Box mt={10}>
            <Text fontWeight="bold" fontSize="lg">
              Únete{" "}
              <Text as="span" color="#F43F5E">
                a
              </Text>{" "}
              MyHandStats
            </Text>
            <Stack direction="row" justify="center" mt={3} spacing={-2}>
              {avatars.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  boxSize="40px"
                  borderRadius="full"
                  border="3px solid white"
                  zIndex={avatars.length - index}
                />
              ))}
              <Box
                boxSize="40px"
                borderRadius="full"
                bg="black"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="sm"
                border="3px solid white"
              >
                Tú
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
