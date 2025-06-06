import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Divider,
  useColorModeValue,
  HStack,
  IconButton,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaArrowLeft,
  FaTachometerAlt,
  FaFutbol,
  FaBuilding,
  FaChartBar,
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const sidebarWidth = isCollapsed ? "60px" : "260px";

  const bgCard = useColorModeValue("white", "gray.900");
  const shadowCard = useColorModeValue("xl", "dark-lg");
  const textPrimary = useColorModeValue("gray.800", "gray.100");
  const textSecondary = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("teal.50", "teal.800");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconBgActive = useColorModeValue("teal.100", "teal.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const IconMotion = motion(Icon);

  // Menú completo con acceso a todas las rutas
  const menuItems = useMemo(
    () => [
      {
        label: "Dashboard",
        icon: FaTachometerAlt,
        to: "/dashboard",
      },
      {
        label: "Jugadores",
        icon: FaUsers,
        to: "/jugadores",
      },
      {
        label: "Partidos",
        icon: FaFutbol,
        to: "/partidos",
      },
      {
        label: "Seleccionar Equipo",
        icon: FaHome,
        to: "/seleccionar-equipo",
      },
      {
        label: "Club",
        icon: FaBuilding,
        to: "/club",
      },
      {
        label: "Estadísticas avanzadas",
        icon: FaChartBar,
        to: "/estadisticas",
      },
      {
        label: "Perfil",
        icon: FaUserCircle,
        to: "/perfil",
      },
    ],
    []
  );

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/registrar") {
      setLoadingUser(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
      setLoadingUser(false);
      return;
    }

    fetch("https://myhandstats.onrender.com/usuario/perfil", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then((data) => {
        setUser({
          nombre: data.info.nombre,
          foto: data.info.foto,
        });
      })
      .catch((err) => {
        console.error("No se pudo cargar el perfil:", err);
        localStorage.removeItem("token");
        if (location.pathname !== "/") {
          navigate("/", { replace: true });
        }
      })
      .finally(() => setLoadingUser(false));
  }, [location.pathname, navigate]);

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      h="100vh"
      w={sidebarWidth}
      bg={bgCard}
      boxShadow={shadowCard}
      borderRight={sidebarWidth === "260px" ? "1px solid" : "none"}
      borderRightColor={borderColor}
      overflowY="auto"
      transition="width 0.2s"
      display={
        location.pathname === "/" || location.pathname === "/registrar"
          ? "none"
          : "block"
      }
      zIndex={1000}
    >
      {/* Botón expandir/colapsar */}
      <Flex justify={isCollapsed ? "center" : "flex-end"} p={2}>
        <IconButton
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          icon={isCollapsed ? <FaBars /> : <FaArrowLeft />}
          size="sm"
          fontSize="18px"
          color={useColorModeValue("gray.700", "gray.200")}
          variant="ghost"
          onClick={() => setIsCollapsed((prev) => !prev)}
          _hover={{ bg: hoverBg }}
        />
      </Flex>

      <VStack align="stretch" spacing={4} mt={2} px={isCollapsed ? 0 : 2}>
        {/* Avatar */}
        <Flex
          align="center"
          flexDirection="column"
          mb={2}
          px={isCollapsed ? 0 : 4}
        >
          {loadingUser ? (
            <Spinner size="lg" color={accentColor} />
          ) : (
            <>
              {user?.foto ? (
                <Avatar
                  size={isCollapsed ? "md" : "xl"}
                  src={user.foto}
                  name={user.nombre}
                />
              ) : (
                <Avatar
                  size={isCollapsed ? "md" : "xl"}
                  icon={<FaUserCircle />}
                  bg={accentColor}
                />
              )}
              {!isCollapsed && (
                <Text
                  mt={2}
                  fontSize="lg"
                  fontWeight="bold"
                  color={textPrimary}
                >
                  {user?.nombre || "Nombre"}
                </Text>
              )}
            </>
          )}
        </Flex>

        <Divider borderColor={borderColor} />

        {/* Menú principal */}
        <VStack align="stretch" spacing={1}>
          {menuItems.map((item) => (
            <Box key={item.label} px={isCollapsed ? 0 : 2}>
              <NavLink to={item.to} style={{ textDecoration: "none" }} end>
                {({ isActive }) => (
                  <HStack
                    w="100%"
                    spacing={isCollapsed ? 0 : 3}
                    px={isCollapsed ? 0 : 3}
                    py={2}
                    borderRadius="md"
                    bg={isActive ? activeBg : "transparent"}
                    _hover={{ bg: hoverBg }}
                    borderLeftWidth="4px"
                    borderLeftColor={isActive ? accentColor : "transparent"}
                    justify={isCollapsed ? "center" : "flex-start"}
                    cursor="pointer"
                  >
                    <Box
                      bg={isActive ? iconBgActive : iconBg}
                      p={2}
                      borderRadius="full"
                    >
                      <IconMotion
                        as={item.icon}
                        boxSize={5}
                        color={isActive ? accentColor : textSecondary}
                        whileHover={{ scale: isCollapsed ? 1 : 1.1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Box>
                    {!isCollapsed && (
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={textPrimary}
                      >
                        {item.label}
                      </Text>
                    )}
                  </HStack>
                )}
              </NavLink>
            </Box>
          ))}
        </VStack>

        {/* Cerrar sesión */}
        <Box mt={6} px={isCollapsed ? 0 : 2}>
          <Divider borderColor={borderColor} />
          <VStack align="stretch" spacing={2} mt={3}>
            <HStack
              w="100%"
              spacing={isCollapsed ? 0 : 3}
              px={isCollapsed ? 0 : 3}
              py={2}
              borderRadius="md"
              _hover={{ bg: hoverBg }}
              justify={isCollapsed ? "center" : "flex-start"}
              cursor="pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
            >
              <Box bg={iconBg} p={2} borderRadius="full">
                <IconMotion
                  as={FaSignOutAlt}
                  boxSize={5}
                  color={textSecondary}
                  whileHover={{ scale: isCollapsed ? 1 : 1.1 }}
                  transition={{ duration: 0.2 }}
                />
              </Box>
              {!isCollapsed && (
                <Text fontSize="md" fontWeight="medium" color={textPrimary}>
                  Cerrar sesión
                </Text>
              )}
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
