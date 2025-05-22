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
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'


const avatars = [
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/women/75.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
  'https://randomuser.me/api/portraits/lego/1.jpg',
]

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

  const handleGoogleRegister = async (response) => {
    try {
      const googleToken = response.credential
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

  useEffect(() => {
    const clientId = '580062200389-hblem47late6qfggkg4iv8gnba20ih91.apps.googleusercontent.com'

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleRegister,
      })

      window.google.accounts.id.renderButton(
        document.getElementById('google-register-button'),
        { theme: 'outline', size: 'large' }
      )
    }
  }, [])

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
      <Container maxW="container.sm" zIndex={1}>
        <Box
          bg="white"
          rounded="xl"
          boxShadow="xl"
          p={{ base: 6, md: 10 }}
          textAlign="center"
        >
          <Heading mb={2} fontSize="2xl" color="#F43F5E">
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
              <Button type="submit" colorScheme="red" bg="#F43F5E" color="white">
                Registrarse
              </Button>
            </Stack>
          </form>

          <Box id="google-register-button" mt={4}></Box>

          <Box mt={6}>
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
          </Box>

          <Text mt={4} fontSize="sm">
            ¿Ya tienes cuenta?{' '}
            <Button
              as={Link}
              to="/"
              variant="link"
              color="#F43F5E"
              fontWeight="bold"
              size="md"
            >
              Inicia sesión
            </Button>
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Registrar
