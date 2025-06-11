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
  VStack,
  Badge,
  Link
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaChartBar,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaCircle,
  FaBolt,
  FaPlay,
  FaMagic,
  FaTrophy
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
        bgGradient="linear(to-br, #e6f4f4, #ffffff)"
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
                fontSize={{ base: "4xl", md: "6xl" }}
                fontWeight="extrabold"
                lineHeight="shorter"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Analiza el{" "}
                <Text as="span" bgGradient="linear(to-r, #027373, #0aa394)" bgClip="text">
                  balonmano
                </Text>{" "}
                como nunca antes
              </MotionHeading>

              <Text fontSize="lg" color="gray.700">
                Estadísticas en tiempo real. Gestión profesional. Visualización brutal.
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="gray.800">
                ¡Ahorra tiempo y mejora el rendimiento de tu equipo hoy mismo!
              </Text>

              {/* Botones */}
              <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={2}>
                <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Button
                    as={RouterLink}
                    to="/registrar"
                    leftIcon={<Icon as={FaBolt} />}
                    size="lg"
                    bg={primaryColor}
                    color="white"
                    rounded="full"
                    shadow="md"
                    px={8}
                    _hover={{
                      bg: primaryColorHover,
                      transform: "translateY(-1px)",
                      boxShadow: "xl",
                    }}
                  >
                    Regístrate gratis
                  </Button>
                </motion.div>
                <Button
                  as={RouterLink}
                  to="/demo"
                  leftIcon={<Icon as={FaPlay} />}
                  size="lg"
                  variant="ghost"
                  bg="white"
                  color="gray.700"
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="full"
                  px={8}
                  _hover={{
                    bg: "gray.50",
                    boxShadow: "md",
                  }}
                >
                  Ver demo
                </Button>
              </Stack>

              {/* Stats */}
              <HStack spacing={8} pt={8}>
                <VStack spacing={1}>
                  <Heading size="lg" color="gray.900">
                    500+
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Equipos activos
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Heading size="lg" color="gray.900">
                    10K+
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Partidos registrados
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Heading size="lg" color="gray.900">
                    99%
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Satisfacción
                  </Text>
                </VStack>
              </HStack>
            </Stack>

            {/* Imagen Hero */}
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
                boxShadow="xl"
              />
            </MotionBox>
          </Flex>
        </Container>
      </MotionBox>


      {/* Características */}
      <Container id="features" maxW="6xl" py={20}>
        <Box textAlign="center" mb={16}>
          <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            Características que marcan la{" "}
            <Text as="span" bgGradient="linear(to-r, #027373, #0aa394)" bgClip="text">
              diferencia
            </Text>
          </Heading>
          <Text fontSize="lg" color="gray.600" mt={4}>
            Herramientas profesionales diseñadas para equipos que buscan la excelencia
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {[
            {
              icon: FaClock,
              title: "Tiempo Real",
              description: "Registra estadísticas durante el partido con nuestra interfaz intuitiva y rápida",
            },
            {
              icon: FaUsers,
              title: "Gestión Completa",
              description: "Administra clubes, equipos, jugadores y staff desde una sola plataforma",
            },
            {
              icon: FaChartBar,
              title: "Analytics Avanzados",
              description: "Visualizaciones interactivas y reportes detallados para análisis profundo",
            },
            {
              icon: FaCheckCircle,
              title: "Fácil de Usar",
              description: "Interfaz diseñada para entrenadores, sin complicaciones técnicas",
            },
          ].map((feature, index) => (
            <MotionBox
              key={index}
              p={6}
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              textAlign="left"
              transition="all 0.3s"
              whileHover={{ y: -5, boxShadow: "lg" }}
            >
              <Box
                bgGradient="linear(to-br, #027373, #0aa394)"
                w={12}
                h={12}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                color="white"
                mb={4}
              >
                <Icon as={feature.icon} boxSize={5} />
              </Box>
              <Heading size="md" mb={2} color="gray.900">
                {feature.title}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {feature.description}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      <MotionBox
        id="phases"
        py={{ base: 20, md: 10 }}
        px={{ base: 4, md: 8 }}
        textAlign="center"
        bg="white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
      <Heading
        as="h2"
        fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="gray.900"
      >
        Cómo funciona{" "}
        <Text as="span" bgGradient="linear(to-r, teal.500, blue.600)" bgClip="text">
          MyHandStats
        </Text>
      </Heading>

        <Text fontSize="lg" color="gray.600" maxW="3xl" mx="auto">
          Un proceso simple y efectivo para transformar tu gestión deportiva
        </Text>
      </MotionBox>

      <MotionBox
        py={20}
        bg="white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="7xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={16}
          >
            {/* Lado izquierdo: texto */}
            <Box flex={1}>
              <Badge
                px={4}
                py={2}
                borderRadius="full"
                bg={primaryColor}
                color="white"
                fontWeight="semibold"
                fontSize="sm"
                mb={4}
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaMagic} w={4} h={4} />
                Fase 1
              </Badge>

              <Heading
                as="h3"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                mb={4}
                color="gray.900"
              >
                Crea Tus Equipos
              </Heading>

              <Text fontSize="lg" color="gray.600" mb={6} maxW="xl">
                Configura tu estructura organizacional con equipos y entrenadores. Sin límites, sin complicaciones.
              </Text>

              <List spacing={4}>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">
                    Creación ilimitada de equipos por club
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">
                    Gestión completa de entrenadores
                  </Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">
                    Configuración personalizada por equipo
                  </Text>
                </ListItem>
              </List>
            </Box>

            {/* Lado derecho: imagen */}
            <Box flex={1}>
              <Image
                src={fase1}
                alt="Mockup Fase 1"
                borderRadius="xl"
                boxShadow="lg"
                width="100%"
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
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="7xl">
          <Flex
            direction={{ base: "column-reverse", md: "row" }}
            align="center"
            justify="space-between"
            gap={16}
          >
            <Box flex={1} mt={{ base: 10, md: 0 }}>
              <Image
                src={fase2}
                alt="Mockup Fase 2"
                borderRadius="xl"
                boxShadow="lg"
                width="100%"
              />
            </Box>
            <Box flex={1}>
              <Badge
                px={4}
                py={2}
                borderRadius="full"
                bg={primaryColor}
                color="white"
                fontWeight="semibold"
                fontSize="sm"
                mb={4}
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaMagic} w={4} h={4} />
                Fase 2
              </Badge>

              <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={4} color="gray.900">
                Gestiona Jugadores
              </Heading>

              <Text fontSize="lg" color="gray.600" mb={6} maxW="xl">
                Añade jugadores, personaliza sus perfiles y crea las convocatorias para cada partido.
              </Text>

              <List spacing={4}>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Perfiles detallados de jugadores</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Sistema de convocatorias inteligente</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Historial completo de participación</Text>
                </ListItem>
              </List>
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      {/* Fase3 */}
      <MotionBox
        py={20}
        bg="gray.50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="7xl">
          <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={16}>
            <Box flex={1}>
              <Badge
                px={4}
                py={2}
                borderRadius="full"
                bg={primaryColor}
                color="white"
                fontWeight="semibold"
                fontSize="sm"
                mb={4}
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaMagic} w={4} h={4} />
                Fase 3
              </Badge>

              <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={4} color="gray.900">
                Partidos en Vivo
              </Heading>

              <Text fontSize="lg" color="gray.600" mb={6} maxW="xl">
                Registra acciones en tiempo real con nuestra aplicación optimizada para dispositivos móviles.
              </Text>

              <List spacing={4}>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Interfaz optimizada para partidos en vivo</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Registro de acciones por fases de juego</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Sincronización automática de datos</Text>
                </ListItem>
              </List>
            </Box>
            <Box flex={1}>
              <Image
                src={wireframe2}
                alt="Mockup Fase 3"
                borderRadius="xl"
                boxShadow="lg"
                width="100%"
              />
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      {/* Fase 4 */}
      <MotionBox
        py={20}
        bg="white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <Container maxW="7xl">
          <Flex direction={{ base: "column-reverse", md: "row" }} align="center" justify="space-between" gap={16}>
            <Box flex={1} mt={{ base: 10, md: 0 }}>
              <Image
                src={fase4}
                alt="Mockup Fase 4"
                borderRadius="xl"
                boxShadow="lg"
                width="100%"
              />
            </Box>
            <Box flex={1}>
              <Badge
                px={4}
                py={2}
                borderRadius="full"
                bg={primaryColor}
                color="white"
                fontWeight="semibold"
                fontSize="sm"
                mb={4}
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaMagic} w={4} h={4} />
                Fase 4
              </Badge>

              <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={4} color="gray.900">
                Análisis Profundo
              </Heading>

              <Text fontSize="lg" color="gray.600" mb={6} maxW="xl">
                Accede a estadísticas detalladas y visualizaciones que te ayudarán a mejorar el rendimiento del equipo.
              </Text>

              <List spacing={4}>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Estadísticas individuales y de equipo</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Comparativas entre partidos</Text>
                </ListItem>
                <ListItem display="flex" alignItems="center" gap={3}>
                  <Icon as={FaCheckCircle} color={primaryColor} w={5} h={5} />
                  <Text color="gray.700" fontSize="md">Reportes exportables para análisis</Text>
                </ListItem>
              </List>
            </Box>
          </Flex>
        </Container>
      </MotionBox>

      <MotionBox
        py={{ base: 24, md: 32 }}
        textAlign="center"
        color="white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{
          background: "linear-gradient(120deg, #057a55, #10b981, #065f46)",
          backgroundSize: "600% 600%",
          animation: "moverFondo 12s ease infinite",
          "@keyframes moverFondo": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold" mb={4}>
          ¡Registra partidos en tiempo real!
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} maxW="3xl" mx="auto" mb={8}>
          ¿Eres parte del cuerpo técnico? Usa nuestra app en vivo para introducir acciones durante el
          partido, sin complicaciones y desde cualquier dispositivo.
        </Text>
        <Button
          as="a"
          href="https://myhandstatsmatch.netlify.app/"
          bg="white"
          color="#065f46"
          size="lg"
          fontWeight="bold"
          borderRadius="full"
          px={8}
          py={6}
          boxShadow="lg"
          _hover={{ bg: "gray.100" }}
          rightIcon={<Icon as={FaPlay} />}
        >
          Ir a la aplicación en vivo
        </Button>
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
          {/* Panel izquierdo: ¿Ya tienes cuenta? */}
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
            <FaUsers size={36} style={{ marginBottom: 16 }} />
            <Text fontWeight="bold" fontSize="xl" mb={2}>
              ¿Ya tienes cuenta?
            </Text>
            <Text mb={6}>
              Accede con tu cuenta y comienza a registrar tus estadísticas.
            </Text>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
          </Box>

          {/* Panel derecho: Registrar un Club */}
          <Box
            bg={primaryColor}
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
            <FaTrophy size={36} style={{ marginBottom: 16 }} />
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
                onClick={() => navigate("/registro-club")}
              >
                Registrar Club
              </Button>
              <Button
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                width="100%"
                onClick={() => navigate("/soporte")}
              >
                Hablar con Soporte
              </Button>
            </Stack>

            <Text fontSize="sm" color="white" opacity={0.8} mt={6}>
              También puedes escribirnos directamente a{" "}
              <Link
                href="mailto:soporte@myhandstats.com"
                textDecoration="underline"
                color="white"
              >
                soporte@myhandstats.com
              </Link>
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
