/**
 * LandingPage
 * 
 * Página de bienvenida y presentación de MyHandStats.
 * 
 * Características:
 * - Presenta el producto y sus funcionalidades principales.
 * - Navegación por secciones (Inicio, Funcionalidades, Contacto) con scroll suave y resaltado de sección activa.
 * - Hero principal con llamada a la acción para registro e inicio de sesión.
 * - Explicación visual de las fases de uso de la plataforma (crear equipos, gestionar jugadores, partidos, estadísticas).
 * - Sección de registro/contacto para clubes y usuarios.
 * - Uso de animaciones con Framer Motion y diseño responsivo con Chakra UI.
 * 
 * Componentes principales:
 * - Feature: Muestra una característica individual con icono y título.
 * - Secciones: Hero, Características, Detalles, Guía por fases, Registro de club/contacto.
 * 
 * Uso:
 * - Accesible para cualquier usuario (no requiere autenticación).
 * - Permite navegar a login y registro.
 */
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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaChartBar,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import wireframe from "../assets/pruebaWireframe2.png";
import wireframe2 from "../assets/pruebaWireframe3.png";
import fase1 from "../assets/fase1wireframe.png";
import fase2 from "../assets/fase2wireframe.png";
import fase4 from "../assets/fase4wireframe.png";
import prueba from "../assets/dashboardwireframe.png";




const primaryColor = "#014C4C";
const primaryColorHover = "#013838";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Feature = ({ icon, title }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={fadeInVariant}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5 }}
    >
      <Flex direction="column" align="center" textAlign="center">
        <Icon as={icon} boxSize={10} color={primaryColor} mb={2} />
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
      </Flex>
    </motion.div>
  );
};

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "features", label: "Funcionalidades" },
  { id: "contact", label: "Contacto" },
];

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100;
      let current = "hero";
      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollY) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box bg="white" minH="100vh" color="gray.800" scrollBehavior="smooth">
      <Box
        as="header"
        bg="white"
        boxShadow="sm"
        py={4}
        position="sticky"
        top="0"
        zIndex="100"
      >
        <Container maxW="6xl">
          <Flex align="center">
            <Heading size="md" color={primaryColor}>
              MyHandStats
            </Heading>
            <HStack
              as="nav"
              spacing={8}
              ml={10}
              display={{ base: "none", md: "flex" }}
            >
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  style={{
                    borderBottom:
                      activeSection === section.id
                        ? `2px solid ${primaryColor}`
                        : "2px solid transparent",
                    paddingBottom: "4px",
                    color:
                      activeSection === section.id ? primaryColor : "inherit",
                    fontWeight:
                      activeSection === section.id ? "normal" : "normal",
                    transition: "all 0.5s ease-in-out",
                  }}
                >
                  {section.label}
                </a>
              ))}
            </HStack>
            <Spacer />
            <HStack spacing={4}>
              <Button
                as={RouterLink}
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
                as={RouterLink}
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
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Stack spacing={6} maxW="lg" color={primaryColor}>
              <MotionHeading
                fontSize={{ base: "3xl", md: "5xl" }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Analiza el balonmano como nunca antes
              </MotionHeading>
              <Text fontSize="lg" color="gray.700">
                Estadísticas en tiempo real. Gestión profesional. Visualización
                brutal.
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="gray.600">
                ¡Ahorra tiempo y mejora el rendimiento de tu equipo hoy mismo!
              </Text>
              <Stack direction="row" spacing={4}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Button
                    as={RouterLink}
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
                  as={RouterLink}
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

            <MotionBox
              ml={{ md: 10 }}
              mt={{ base: 10, md: 0 }}
              maxW="500px"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Image
                src={wireframe}
                alt="Vista previa MyHandStats"
                borderRadius="xl"
                width="100%"
                height="auto"
                objectFit="contain"
              />
            </MotionBox>
          </Flex>
        </Container>
      </MotionBox>

      {/* Curva decorativa */}
      <Box width="100%" overflow="hidden" lineHeight={0}>
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "80px" }}
        >
          <path
            d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,149.3C672,139,768,117,864,101.3C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="white"
          />
        </svg>
      </Box>

      {/* Características */}
      <Container id="features" maxW="6xl" py={20}>
        <Heading textAlign="center" mb={10} color={primaryColor}>
          Características de MyHandStats
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
          <Feature icon={FaClock} title="Partidos en tiempo real" />
          <Feature icon={FaUsers} title="Gestión de clubes" />
          <Feature icon={FaChartBar} title="Estadísticas visuales" />
          <Feature icon={FaCheckCircle} title="Fácil de usar" />
        </SimpleGrid>
      </Container>

      {/* Detalles */}
      <MotionBox
        bg="gray.50"
        py={20}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <MotionFlex
            direction={{ base: "column", md: "row" }}
            align="center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src={prueba}
              alt="Mockup app"
              maxW="400px"
              borderRadius="xl"
              mr={{ md: 10 }}
              mb={{ base: 10, md: 0 }}
              boxShadow="md"
            />
            <Box>
              <MotionHeading
                mb={4}
                color={primaryColor}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                ¿Qué puedes hacer con MyHandStats?
              </MotionHeading>
              <List spacing={3}>
                <MotionText
                  as={ListItem}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.4 }}
                >
                  <ListIcon as={FaCheckCircle} color={primaryColor} />
                  Crear y seguir partidos en tiempo real
                </MotionText>
                <MotionText
                  as={ListItem}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <ListIcon as={FaCheckCircle} color={primaryColor} />
                  Gestionar jugadores, equipos y roles
                </MotionText>
                <MotionText
                  as={ListItem}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <ListIcon as={FaCheckCircle} color={primaryColor} />
                  Consultar estadísticas detalladas
                </MotionText>
                <MotionText
                  as={ListItem}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <ListIcon as={FaCheckCircle} color={primaryColor} />
                  Integración con tu club
                </MotionText>
              </List>
            </Box>
          </MotionFlex>
        </Container>
      </MotionBox>

      <MotionBox
        py={20}
        bg="gray.50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Box flex={1} pr={{ md: 10 }}>
              <Heading size="lg" mb={4} color={primaryColor}>
                Fase 1: Crea Tus Equipos
              </Heading>
              <Text mb={6}>
                Antes de que empieces a registrar tus estadísticas, necesitamos
                que el administrador cree los equipos y los entrenadores.
              </Text>
              <Text fontWeight="bold">Qué incluye:</Text>
              <List spacing={3} mt={3}>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Creación de
                  equipos por Club
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Sin máximo de
                  equipos
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Creación de
                  los entrenadores
                </ListItem>
              </List>
            </Box>
            <Box flex={1} mt={{ base: 10, md: 0 }}>
              <Image
                src={fase1}
                alt="Fase de Aprendizaje"
                borderRadius="lg"
                boxShadow="md"
              />
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      {/* Nueva Sección de Guía - Fase 2 */}
      <MotionBox
        py={20}
        bg="white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column-reverse", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Box flex={1} mt={{ base: 10, md: 0 }}>
              <Image
                src={fase2}
                alt="Fase de Recolección"
                borderRadius="lg"
                boxShadow="md"
              />
            </Box>
            <Box flex={1} pl={{ md: 10 }}>
              <Heading size="lg" mb={4} color={primaryColor}>
                Fase 2: Equipos
              </Heading>
              <Text mb={6}>
                Antes de crear los partidos, deberás de crear tus jugadores y
                tus listas de convocados.
              </Text>
              <Text fontWeight="bold">Qué incluye:</Text>
              <List spacing={3} mt={3}>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Creación de
                  jugadores
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} />{" "}
                  Personalización de tus jugadores
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Creación de
                  partidos
                </ListItem>
              </List>
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      <MotionBox
        py={20}
        bg="gray.50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Box flex={1} pr={{ md: 10 }}>
              <Heading size="lg" mb={4} color={primaryColor}>
                Fase 3: Crea Tus Partidos
              </Heading>
              <Text mb={6}>Empieza a crear tus partidos a tiempo real</Text>
              <Text fontWeight="bold">Qué incluye:</Text>
              <List spacing={3} mt={3}>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Creación de
                  partidos
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Diferentes
                  fases de juego
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCircle} color={primaryColor} /> Introducir
                  acciones teniendo en cuenta la fase de juego
                </ListItem>
              </List>
            </Box>
            <Box flex={1} mt={{ base: 10, md: 0 }}>
              <Image
                src={wireframe2}
                alt="Fase de Aprendizaje"
                borderRadius="lg"
                boxShadow="md"
              />
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      <MotionBox
        py={20}
        bg="white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column-reverse", md: "row" }}
            align="center"
            justify="space-between"
          >
            <Box flex={1} mt={{ base: 10, md: 0 }}>
              <Image
                src={fase4}
                alt="Fase de Recolección"
                borderRadius="lg"
                boxShadow="md"
              />
            </Box>
            <Box flex={1} pl={{ md: 10 }}>
              <Heading size="lg" mb={4} color={primaryColor}>
                Fase 4: Estadísticas
              </Heading>
              <Text mb={6}>
                Después de los partidos, podrás consultar estadísticas sobre
                ellas, para poder hacer un análisis profundo para que tu equipo
                progrese.
              </Text>
              <Text fontWeight="bold">Qué incluye:</Text>
              <List spacing={3} mt={3}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={primaryColor} /> Consulta
                  de estadísticas por partido
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={primaryColor} /> Estudio
                  de estadísticas por jugador
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color={primaryColor} />{" "}
                  Visualización individual por partido
                </ListItem>
              </List>
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      <MotionBox
        id="registro"
        bg="white"
        py={20}
        px={{ base: 3, md: 12 }}
        textAlign="center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="6xl">
          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            color="#014C4C"
            mb={2}
          >
            Registro de Club
          </Heading>
          <Text fontSize="md" color="gray.600" mb={12} maxW="2xl" mx="auto">
            Ponte en contacto con nosotros para registrar tu club en MyHandStats
            y accede a todas las funcionalidades diseñadas para equipos reales.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
            <Box
              bg="gray.50"
              color="#014C4C"
              p={8}
              borderRadius="lg"
              boxShadow="md"
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Text fontWeight="bold" fontSize="xl" mb={2}>
                ¿Ya tienes cuenta?
              </Text>
              <Text mb={6}>
                Accede con tu cuenta y comienza a registrar tus estadísticas.
              </Text>
              <Button colorScheme="teal" variant="outline">
                Iniciar sesión
              </Button>
            </Box>

            <Box
              bg="#014C4C"
              color="white"
              p={8}
              borderRadius="lg"
              boxShadow="lg"
              textAlign="center"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Text fontWeight="bold" fontSize="xl" mb={2}>
                Registrar un Club
              </Text>
              <Text mb={6}>
                Para federaciones, clubes o entrenadores que gestionan varios
                equipos y necesitan estadísticas completas.
              </Text>

              <Stack direction="column" spacing={4} width="100%" maxW="sm">
                <Button
                  bg="white"
                  color="#014C4C"
                  _hover={{ bg: "#f0f0f0" }}
                  width="100%"
                >
                  Registrar Club
                </Button>
                <Button
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                  width="100%"
                >
                  Hablar con Soporte
                </Button>
              </Stack>

              <Text fontSize="sm" color="white" opacity={0.8} mt={6}>
                También puedes escribirnos directamente a{" "}
                <strong>soporte@myhandstats.com</strong>
              </Text>
            </Box>
          </SimpleGrid>

          <Text fontSize="sm" color="gray.500" mt={10}>
            Confía en nosotros. ¿Te unes?
          </Text>
        </Container>
      </MotionBox>
    </Box>
  );
};

export default LandingPage;

