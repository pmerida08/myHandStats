import React, { useState } from "react";
import { Flex, Icon, Text, Avatar } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Header = ({ equipo, club, userName, onOpen }) => {
    // Obtener foto del usuario desde el token
    let foto = "";
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            foto = payload.foto || "";
        } catch {
            foto = "";
        }
    }

    // Estado para controlar la apertura del Sidebar
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarOpen = () => setSidebarOpen(true);
    const handleSidebarClose = () => setSidebarOpen(false);

    return (
        <>
            <Flex align="center" justify="space-between" mb={8}>
                <Flex align="center" gap={3}>
                    <Icon
                        as={FaBars}
                        boxSize={6}
                        onClick={handleSidebarOpen}
                        cursor="pointer"
                    />
                    {/* Logo de la aplicación al lado del icono de hamburguesa */}
                </Flex>
                <Flex align="center" gap={3} position="absolute" left="50%" transform="translateX(-50%)">
                    <Text fontSize="2xl" fontWeight="bold" color="#014C4C" mb={0}>
                        {equipo.nombre}
                    </Text>
                    <Avatar name={club.nombre} src={club.logo} />
                </Flex>
                <Flex align="center" gap={2}>
                    <Text fontSize="m" fontWeight="medium" color="#014C4C">
                        {userName}
                    </Text>
                    {foto ? (
                        <Avatar size="sm" src={foto} name={userName} />
                    ) : (
                        <Avatar size="sm" name={userName} />
                    )}
                </Flex>
            </Flex>
            <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
        </>
    );
};

export default Header;