// LayoutPrivado.jsx
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
