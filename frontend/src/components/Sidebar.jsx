import React from 'react';
import {
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader,
  DrawerBody, Flex, Icon, Text
} from '@chakra-ui/react';
import {
  FaTachometerAlt, FaUser, FaFutbol, FaPlusCircle, FaChartBar, FaBuilding
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Obtener el token y decodificar el rol
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.rol === 'admin';
    }
  } catch {
    isAdmin = false;
  }

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg="#014C4C" color="white">
        <DrawerHeader borderBottomWidth="1px">MENU</DrawerHeader>
        <DrawerBody>
          <Flex direction="column" gap={4} mt={4}>
            <MenuItem icon={FaTachometerAlt} label="Dashboard" onClick={() => handleNavigate('/dashboard')} />
            <MenuItem icon={FaUser} label="Jugadores" onClick={() => handleNavigate('/jugadores')} />
            <MenuItem icon={FaFutbol} label="Partidos" onClick={() => handleNavigate('/partidos')} />
            <MenuItem icon={FaUser} label="Seleccionar Equipo" onClick={() => handleNavigate('/seleccionar-equipo')} />
            {isAdmin && (
              <MenuItem icon={FaBuilding} label="Club" onClick={() => handleNavigate('/club')} />
            )}
            <MenuItem icon={FaChartBar} label="Estadísticas avanzadas" onClick={() => handleNavigate('/estadisticas')} />
            <MenuItem icon={FaUser} label="Perfil" onClick={() => handleNavigate('/perfil')} />
            <MenuItem icon={FaPlusCircle} label="Cerrar sesión" onClick={() => {
              localStorage.removeItem('token');
              onClose();
              navigate('/login');
            }} />
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <Flex
    align="center"
    gap={3}
    px={3}
    py={2}
    borderRadius="md"
    _hover={{ bg: '#016666' }}
    cursor="pointer"
    onClick={onClick}
  >
    <Icon as={icon} />
    <Text fontWeight="medium">{label}</Text>
  </Flex>
);

export default Sidebar;
