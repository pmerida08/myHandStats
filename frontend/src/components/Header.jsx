/**
 * Header
 * 
 * Componente de cabecera para la aplicación.
 * Muestra el nombre del club, el logo y el título de la sección actual.
 * Incluye el botón para abrir el Sidebar de navegación.
 * 
 * Props:
 * - texto: string. Título o texto a mostrar en el centro del header.
 * - club: objeto. Información del club (nombre y logo).
 */
import { useState } from "react";
import { Flex, Text, Avatar } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

const Header = ({ texto, club }) => {
    // Estado para controlar la apertura del Sidebar
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    /**
     * Cierra el Sidebar
     */
    const handleSidebarClose = () => setSidebarOpen(false);

    return (
        <>
            <Flex align="center" justify="space-between" mb={8}>
                {/* Botón y Sidebar de navegación */}
                <Flex align="center" gap={3}>
                    <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
                </Flex>
                {/* Título centrado */}
                <Flex align="center" gap={3} position="absolute" left="50%" transform="translateX(-50%)">
                    <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={0}>
                        {texto}
                    </Text>
                </Flex>
                {/* Avatar del club */}
                <Flex align="center" gap={2}>
                    <Avatar
                        name={club.nombre}
                        src={club.logo}
                        mt={-2}
                        boxSize="50px"
                        marginTop={0.5}
                        style={{ filter: "drop-shadow(0 10px 10px rgba(0, 0, 0, 0.25))" }}
                    />
                </Flex>
            </Flex>
            {/* <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} /> */}
        </>
    );
};

export default Header;