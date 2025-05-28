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
import { useNavigate, Link } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const avatars = [
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/women/75.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
  'https://randomuser.me/api/portraits/lego/1.jpg',
]

const clientId = '580062200389-hblem47late6qfggkg4iv8gnba20ih91.apps.googleusercontent.com'

const Registrar = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const navigate = useNavigate()

  const handleRegistrar = async (e) => {
    e.preventDefault()

    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    try {
      const res = await fetch('https://myhandstats.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password, rol: "", clubs_id: "" }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.detail || 'Error al registrarse')
        return
      }

      alert('Usuario registrado con éxito')
      navigate('/')
    } catch (error) {
      console.error(error)
      alert('Error de conexión con el servidor')
    }
  }

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential
      const res = await fetch('https://myhandstats.onrender.com/register/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: googleToken }),
      })

      if (!res.ok) throw new Error('Error en registro con Google')

      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      navigate('/seleccionar-equipo')
    } catch (error) {
      alert(error.message || 'Error al registrarse con Google')
    }
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.sm" zIndex={1}>
          <Box
            bg="white"
            rounded="xl"
            boxShadow="xl"
            p={{ base: 6, md: 10 }}
            textAlign="center"
          >
            <Heading mb={2} fontSize="2xl" color="#014C4C">
              Crea tu cuenta
            </Heading>
            <Text fontSize="sm" mb={6} color="gray.600">
              ¡Forma parte de MyHandStats y registra tus estadísticas de juego!
            </Text>

            <form onSubmit={handleRegistrar}>
              <Stack spacing={4} mb={4}>
                <FormControl>
                  <Input
                    placeholder="Nombre completo"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    bg="gray.100"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="tucorreo@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="gray.100"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="******"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.100"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="******"
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    bg="gray.100"
                  />
                </FormControl>
                <Button type="submit" colorScheme="red" bg="#014C4C" color="white">
                  Registrarse
                </Button>
              </Stack>
            </form>

            <Box mt={4}>
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => alert('Error al registrarse con Google')}
                width="100%"
                locale="es"
                text="signup_with"
                shape="pill"
                theme="outline"
                size="large"
              />
            </Box>

            <Box mt={6}>
              <Text fontWeight="bold" fontSize="lg">
                Únete <Text as="span" color="#014C4C">a</Text> MyHandStats
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

            <Text mt={4} fontSize="sm">
              ¿Ya tienes cuenta?{' '}
              <Button
                as={Link}
                to="/"
                variant="link"
                color="#014C4C"
                fontWeight="bold"
                size="md"
              >
                Inicia sesión
              </Button>
            </Text>
          </Box>
        </Container>
      </Box>
    </GoogleOAuthProvider>
  )
}

export default Registrar
