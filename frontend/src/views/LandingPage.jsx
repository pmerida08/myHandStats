import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="6xl" py={20}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
        >
          <Stack spacing={6} maxW="lg">
            <Heading
              fontSize={{ base: '3xl', md: '5xl' }}
              lineHeight="short"
              color="gray.800"
            >
              MyHandStats
            </Heading>
            <Text fontSize="lg" color="gray.600">
              La plataforma definitiva para registrar, visualizar y analizar estadísticas de balonmano. Diseñada para jugadores, entrenadores y clubes.
            </Text>
            <Stack direction="row" spacing={4}>
              <Button
                as={Link}
                to="/registrar"
                colorScheme="red"
                bg="#F43F5E"
                color="white"
                size="lg"
              >
                Regístrate
              </Button>
              <Button
                as={Link}
                to="/login"
                variant="outline"
                colorScheme="gray"
                size="lg"
              >
                Iniciar sesión
              </Button>
            </Stack>
          </Stack>
          <Box mt={{ base: 10, md: 0 }} ml={{ md: 10 }}>
            <Image
              src="https://cdn.pixabay.com/photo/2016/11/14/04/43/handball-1821923_1280.jpg"
              alt="Estadísticas de balonmano"
              borderRadius="xl"
              maxW="500px"
              boxShadow="lg"
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default LandingPage
