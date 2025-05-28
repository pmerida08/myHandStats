import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Icon,
  List,
  ListItem,
  ListIcon,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaClock, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import wireframe from '../assets/pruebaWireframe-removebg-preview.png';
import wireframe2 from '../assets/705shots_so-removebg-preview.png';

const primaryColor = '#014C4C';
const primaryColorHover = '#013838';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const LandingPage = () => {
  return (
    <Box bg="white" minH="100vh" color="gray.800" scrollBehavior="smooth">
      {/* Header */}
      <Box as="header" bg="white" boxShadow="sm" py={4} position="sticky" top="0" zIndex="100">
        <Container maxW="6xl">
          <Flex align="center">
            <Heading size="md" color={primaryColor}>MyHandStats</Heading>
            <HStack as="nav" spacing={8} ml={10} display={{ base: 'none', md: 'flex' }}>
              <a href="#hero">Inicio</a>
              <a href="#features">Funcionalidades</a>
              <a href="#contact">Contacto</a>
            </HStack>
            <Spacer />
            <HStack spacing={4}>
              <Button
                as={Link}
                to="/login"
                variant="outline"
                color={primaryColor}
                borderColor={primaryColor}
                size="sm"
                _hover={{ bg: "#e6f1f1" }}
              >
                Iniciar sesión
              </Button>
              <Button
                as={Link}
                to="/registrar"
                bg={primaryColor}
                color="white"
                size="sm"
                _hover={{ bg: primaryColorHover }}
              >
                Regístrate
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero principal */}
      <MotionBox
        id="hero"
        py={20}
        bgGradient="linear(to-r, #e0f7f7, #ffffff)"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Stack spacing={6} maxW="lg" color={primaryColor}>
              <MotionHeading
                fontSize={{ base: '3xl', md: '5xl' }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Analiza el balonmano como nunca antes
              </MotionHeading>
              <Text fontSize="lg" color="gray.700">
                Estadísticas en tiempo real. Gestión profesional. Visualización brutal.
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="gray.600">
                 ¡Ahorra tiempo y mejora el rendimiento de tu equipo hoy mismo!
              </Text>
              <Stack direction="row" spacing={4}>
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Button
                    as={Link}
                    to="/registrar"
                    bg={primaryColor}
                    color="white"
                    size="lg"
                    _hover={{ bg: primaryColorHover }}
                  >
                    Regístrate gratis
                  </Button>
                </motion.div>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  color={primaryColor}
                  borderColor={primaryColor}
                  size="lg"
                  _hover={{ bg: "#e6f1f1" }}
                >
                  Iniciar sesión
                </Button>
              </Stack>
            </Stack>

            <Box ml={{ md: 10 }} mt={{ base: 10, md: 0 }} maxW="500px">
              <Image
                src={wireframe}
                alt="Vista previa MyHandStats"
                borderRadius="xl"
                width="100%"
                height="auto"
                objectFit="contain"
              />
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      {/* Curva decorativa */}
      <Box width="100%" overflow="hidden" lineHeight={0}>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '80px' }}>
          <path
            d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,149.3C672,139,768,117,864,101.3C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="white"
          />
        </svg>
      </Box>

      {/* Características */}
      <Container id="features" maxW="6xl" py={20}>
        <Heading textAlign="center" mb={10} color={primaryColor}>Características de MyHandStats</Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
          <Feature icon={FaClock} title="Partidos en tiempo real" />
          <Feature icon={FaUsers} title="Gestión de clubes" />
          <Feature icon={FaChartBar} title="Estadísticas visuales" />
          <Feature icon={FaCheckCircle} title="Fácil de usar" />
        </SimpleGrid>
      </Container>

      {/* Detalles */}
      <Box bg="gray.50" py={20}>
        <Container maxW="6xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Image
              src={wireframe2}
              alt="Mockup app"
              maxW="400px"
              borderRadius="xl"
              mr={{ md: 10 }}
              mb={{ base: 10, md: 0 }}
              boxShadow="md"
            />
            <Box>
              <Heading mb={4} color={primaryColor}>¿Qué puedes hacer con MyHandStats?</Heading>
              <List spacing={3}>
                <ListItem><ListIcon as={FaCheckCircle} color={primaryColor} />Crear y seguir partidos en tiempo real</ListItem>
                <ListItem><ListIcon as={FaCheckCircle} color={primaryColor} />Gestionar jugadores, equipos y roles</ListItem>
                <ListItem><ListIcon as={FaCheckCircle} color={primaryColor} />Consultar estadísticas detalladas</ListItem>
                <ListItem><ListIcon as={FaCheckCircle} color={primaryColor} />Integración con tu club</ListItem>
              </List>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Contacto */}
      <Box id="contact" bg="white" py={20}>
        <Container maxW="6xl">
          <Heading textAlign="center" mb={6} color={primaryColor}>Contacto</Heading>
          <Text textAlign="center" fontSize="lg" mb={4}>
            ¿Tienes dudas o sugerencias? Escríbenos a <strong>soporte@myhandstats.com</strong>
          </Text>
          <Flex justify="center" mt={6}>
            <Button colorScheme="teal" as="a" href="mailto:soporte@myhandstats.com">
              Enviar correo
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

const Feature = ({ icon, title }) => (
  <Flex direction="column" align="center" textAlign="center">
    <Icon as={icon} boxSize={10} color={primaryColor} mb={2} />
    <Text fontWeight="bold" fontSize="lg">{title}</Text>
  </Flex>
);

export default LandingPage;