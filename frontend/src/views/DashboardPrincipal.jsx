import React from 'react';
import {
  Box, Text, Flex, Icon, Button, Grid, Divider, useDisclosure
} from '@chakra-ui/react';
import { FaBars, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; 

const DashboardPrincipal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box p={4} minH="100vh" bg="white">
      {/* Sidebar desplegable */}
      <Sidebar isOpen={isOpen} onClose={onClose} />

      {/* Header con título y hamburguesa */}
      <Flex align="center" justify="space-between" mb={8}>
        <Icon as={FaBars} boxSize={6} onClick={onOpen} cursor="pointer" />
        <Text fontSize="2xl" fontWeight="bold" color="#014C4C">Dashboard</Text>
        <Box w="6" />
      </Flex>

      {/* Grid principal */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {/* Goles últimos partidos */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Goles últimos partidos</Text>
            <Button size="sm" variant="outline">View Report</Button>
          </Flex>
          <Flex align="center" gap={2} color="green.500" fontSize="sm" mb={2}>
            <Icon as={FaArrowUp} />
            <Text>0% vs last week</Text>
          </Flex>
          <Text fontSize="sm">Aún no hay registros</Text>
          <Divider my={4} />
          <Flex gap={4}>
            <Box h={2} w={2} borderRadius="full" bg="#014C4C" />
            <Text fontSize="xs">Goles a favor</Text>
            <Box h={2} w={2} borderRadius="full" bg="gray.300" />
            <Text fontSize="xs">Goles en contra</Text>
          </Flex>
        </Box>

        {/* Fases del Juego */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Fases del Juego últimos partidos</Text>
            <Button size="sm" variant="ghost" isDisabled>View Report</Button>
          </Flex>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Lanzamientos 7m */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold">Lanzamientos 7m</Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Los máximos lanzadores de 7 metros del equipo
          </Text>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Goleadores */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Text fontWeight="bold">Goleadores</Text>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Los máximos goleadores del equipo
          </Text>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>

        {/* Orden */}
        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Order</Text>
            <Button size="sm" variant="outline">View Report</Button>
          </Flex>
          <Flex align="center" gap={2} color="red.500" fontSize="sm" mb={2}>
            <Icon as={FaArrowDown} />
            <Text>0%</Text>
          </Flex>
          <Text fontSize="sm">Aún no hay registros</Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardPrincipal;
