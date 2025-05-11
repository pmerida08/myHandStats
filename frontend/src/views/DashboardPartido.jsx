import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Icon, Text, Button, Grid, SimpleGrid, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { FaBars, FaPause } from 'react-icons/fa';

const DashboardPartido = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  const [partidoIniciado, setPartidoIniciado] = useState(false);
  const [modalTipo, setModalTipo] = useState(null);

  const [zonaDisparo, setZonaDisparo] = useState(null);
  const [zonaLanzador, setZonaLanzador] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);

  useEffect(() => {
    setEquipos([
      { id: 1, nombre: "Cadete A" },
      { id: 2, nombre: "Juvenil B" },
    ]);
  }, []);

  useEffect(() => {
    let interval = null;
    if (activo) {
      interval = setInterval(() => {
        setSegundos((prev) => (prev < 1800 ? prev + 1 : 1800));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activo]);

  const formatoTiempo = () => {
    const min = Math.floor(segundos / 60).toString().padStart(2, '0');
    const sec = (segundos % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleComenzar = () => {
    if (!equipoSeleccionado) return alert("Selecciona un equipo");
    setPartidoIniciado(true);
  };

  const handleGuardarGol = () => {
    if (!zonaDisparo || (modalTipo === "gol" && !zonaLanzador)) {
      alert("Faltan datos");
      return;
    }
    setGolesLocal((prev) => prev + 1);
    onClose();
    setZonaDisparo(null);
    setZonaLanzador(null);
    setModalTipo(null);
  };

  if (!partidoIniciado) {
    return (
      <Box p={8} minH="100vh" bg="white" textAlign="center">
        <Text fontSize="xl" mb={4} fontWeight="bold">Selecciona el equipo para iniciar el partido</Text>
        <Select
          placeholder="Selecciona un equipo"
          value={equipoSeleccionado}
          onChange={(e) => setEquipoSeleccionado(e.target.value)}
          maxW="300px"
          mx="auto"
          mb={4}
        >
          {equipos.map((equipo) => (
            <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
          ))}
        </Select>
        <Button bg="#014C4C" color="white" onClick={handleComenzar} _hover={{ bg: '#016666' }}>
          Comenzar Partido
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4} minH="100vh" bg="white">
      <Flex align="center" justify="space-between" mb={6}>
        <Icon as={FaBars} boxSize={5} />
        <Flex align="center" gap={3}>
          <Text fontSize="2xl" color="blue.600" fontWeight="bold">{golesLocal}</Text>
          <Text fontSize="2xl" color="red.500" fontWeight="bold">:</Text>
          <Text fontSize="2xl" color="red.500" fontWeight="bold">{golesVisitante}</Text>
          <Flex
            align="center"
            justify="center"
            boxSize={8}
            bg="#014C4C"
            borderRadius="full"
            color="white"
            cursor="pointer"
            onClick={() => setActivo((prev) => !prev)}
          >
            <Icon as={FaPause} fontSize="xs" />
          </Flex>
          <Flex direction="column" align="center">
            <Text fontSize="sm">1º Parte</Text>
            <Text fontSize="xl" fontWeight="bold">{formatoTiempo()}</Text>
          </Flex>
        </Flex>
        <Button variant="outline" size="sm">Acabar Parte</Button>
      </Flex>

      <Flex flexWrap="wrap" gap={6}>
        <Box minW="200px">
          <Text fontWeight="bold" mb={2}>Timeouts</Text>
          <Flex gap={2} mb={4}>
            {[1, 2, 3].map((num) => (
              <Button key={num} borderRadius="full" bg="#014C4C" color="white" size="sm">{num}</Button>
            ))}
          </Flex>
          <Text fontWeight="bold" mb={1}>Portero</Text>
          <Button colorScheme="teal" size="sm" mb={4}>1 Pepe</Button>
          <Text fontWeight="bold" mb={1}>En Pista</Text>
          <SimpleGrid columns={3} spacing={2} mb={4}>
            {Array(6).fill(0).map((_, i) => (
              <Button key={i} size="sm" bg="#014C4C" color="white">3 Pablo</Button>
            ))}
          </SimpleGrid>
          <Text fontWeight="bold" mb={1}>Banquillo</Text>
          <SimpleGrid columns={3} spacing={2}>
            {Array(7).fill(0).map((_, i) => (
              <Button key={i} size="sm" bg="#014C4C" color="white">3 Pablo</Button>
            ))}
          </SimpleGrid>
        </Box>

        <Box flex="1">
          <Text fontWeight="bold" mb={2}>Fase del Juego</Text>
          <Flex wrap="wrap" gap={2} mb={4}>
            {['Ataque Posicional', 'Defensa Posicional', 'Contraataque', 'Repliegue'].map((fase) => (
              <Button key={fase} size="sm" variant="outline">{fase}</Button>
            ))}
          </Flex>
          <Text fontWeight="bold" mb={2}>Acciones</Text>
          <SimpleGrid columns={[2, 3, 4]} spacing={3} mb={6}>
            {[{ label: 'Gol', tipo: 'gol' }, { label: 'Gol 7M', tipo: 'gol7m' },
              'Parada', 'Parada 7M', 'Tiro Puerta', 'Tiro Fuera', 'Falta', 'Falta 7M',
              'Gol en Contra', 'Pérdida', 'Amarilla', 'Roja', 'Azul', '2 Minutos', 'Recupe.'
            ].map((accion) =>
              typeof accion === 'string' ? (
                <Button key={accion} size="sm" variant="outline">{accion}</Button>
              ) : (
                <Button
                  key={accion.label}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setModalTipo(accion.tipo);
                    onOpen();
                  }}
                >
                  {accion.label}
                </Button>
              )
            )}
          </SimpleGrid>
          <Flex justify="flex-end">
            <Button bg="#014C4C" color="white" _hover={{ bg: '#016666' }}>
              Finalizar Partido
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" bg="#014C4C" color="white">
            Posición del Lanzamiento
          </ModalHeader>
          <ModalBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={6} textAlign="center">
              {Array.from({ length: 9 }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setZonaDisparo(i + 1)}
                  variant={zonaDisparo === i + 1 ? "solid" : "outline"}
                  colorScheme="teal"
                >
                  {i + 1}
                </Button>
              ))}
            </Grid>
            {modalTipo === "gol" && (
              <>
                <Text textAlign="center" fontWeight="bold" mb={2}>Posición del Lanzador</Text>
                <Grid templateColumns="repeat(5, 1fr)" gap={2} mb={2}>
                  {["Ala Izquierda", "Izquierda 6M", "Centro 6M", "Derecha 6M", "Ala Derecha"].map((pos) => (
                    <Button
                      key={pos}
                      onClick={() => setZonaLanzador(pos)}
                      variant={zonaLanzador === pos ? "solid" : "outline"}
                      colorScheme="teal"
                      size="sm"
                    >
                      {pos}
                    </Button>
                  ))}
                </Grid>
                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                  {["Izquierda 9M", "Centro 9M", "Derecha 9M", "Medio Campo", "Campo a Campo"].map((pos) => (
                    <Button
                      key={pos}
                      onClick={() => setZonaLanzador(pos)}
                      variant={zonaLanzador === pos ? "solid" : "outline"}
                      colorScheme="teal"
                      size="sm"
                    >
                      {pos}
                    </Button>
                  ))}
                </Grid>
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button colorScheme="teal" onClick={handleGuardarGol}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DashboardPartido;
