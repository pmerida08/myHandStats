/**
 * Layout
 * 
 * Componente de layout principal para las páginas privadas de la aplicación.
 * Estructura la vista con un Sidebar lateral fijo y un área principal para el contenido.
 * 
 * - Sidebar: Navegación lateral persistente.
 * - Outlet: Renderiza el contenido de la ruta hija actual.
 * 
 * El área principal tiene un padding izquierdo para no solaparse con el Sidebar.
 */

import { Box } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box display="flex" minH="100vh">
      <Sidebar />
      <Box
        flex="1"
        pl="60px"      
        pt={4}
        bg="white"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
