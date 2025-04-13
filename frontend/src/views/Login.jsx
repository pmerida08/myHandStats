import { Link } from 'react-router-dom'
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
} from '@chakra-ui/react'

  import { useState } from 'react'
  
  // Imágenes de perfil falsas (puedes usar tus propias imágenes o avatares)
  const avatars = [
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://randomuser.me/api/portraits/women/75.jpg',
    'https://randomuser.me/api/portraits/men/45.jpg',
    'https://randomuser.me/api/portraits/men/55.jpg',
    'https://randomuser.me/api/portraits/lego/1.jpg',
  ]
  
  const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  
    const handleLogin = (e) => {
      e.preventDefault()
      // fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((err) => console.error(err))
      console.log({ email, password })
    }
  
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
     // Aun no hay imagen backgroundImage="url('/.svg')"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
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
                    _placeholder={{ color: 'gray.500' }}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="******"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.100"
                    _placeholder={{ color: 'gray.500' }}
                  />
                </FormControl>
                <Button type="submit" colorScheme="red" bg="#F43F5E" color="white">
                  Submit
                </Button>
              </Stack>
            </form>
  
            <Box mt={10}>
              <Text fontWeight="bold" fontSize="lg">
                Únete <Text as="span" color="#F43F5E">a</Text> MyHandStats
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
              <Text fontSize="sm">
                ¿Aún no tienes cuenta?{" "}
                <Button
                  as={Link}
                  to="/registrar"
                  variant="link"
                  color="#F43F5E"
                  fontWeight="bold"
                  size="md"
                >
                  Regístrate
                </Button>
              </Text>
            </Box>
          </Box>
        </Container>
      </Box>
    )
  }
  
  export default Login
  