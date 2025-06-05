import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";

// Vistas públicas
import Login from "./views/Login";
import Registrar from "./views/Registrar";
import LandingPage from "./views/LandingPage";
import CrearUsuarioForm from "./views/CrearUsuarioForm";

// Vistas privadas
import VistaAdmin from "./views/VistaAdmin";
import DashboardPrincipal from "./views/DashboardPrincipal";
import DashboardPartido from "./views/DashboardPartido";
import Jugadores from "./views/Jugadores";
import Partidos from "./views/Partidos";
import StatsAvanzadas from "./views/StatsAvanzadas";
import ResumenPartido from "./views/ResumenPartido";
import SeleccionarEquipo from "./views/SeleccionarEquipo";
import StatsJugador from "./views/StatsJugador";
import GestionClub from "./views/GestionClub";
import GestionClubUsuarios from "./views/GestionClubUsuarios";
import GestionEquiposClub from "./views/GestionEquiposClub";
import GestionInfoClub from "./views/GestionInfoClub";
import GestionClubEntrenadores from "./views/GestionClubEntrenadores";
import EditarPerfil from "./views/Perfil";
import NotFound from "./views/NotFound";

const Rutas = () => {
  const location = useLocation();
  const esRutaPublica = ['/', '/login', '/registrar', '/establecer-contraseña'].includes(location.pathname);

  return (
    <>
      {esRutaPublica ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/establecer-contraseña" element={<CrearUsuarioForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Box display="flex" minH="100vh">
          <Sidebar />
          <Box
            flex="1"
            ml={{ base: 0, md: '60px' }}
            pl={{ base: 0, md: '20px' }}
            px={{ base: 2, md: 6 }}
          >
            <Routes>
              <Route path="/admin" element={<VistaAdmin />} />
              <Route path="/dashboard" element={<DashboardPrincipal />} />
              <Route path="/nuevo-partido" element={<DashboardPartido />} />
              <Route path="/jugadores" element={<Jugadores />} />
              <Route path="/partidos" element={<Partidos />} />
              <Route path="/estadisticas" element={<StatsAvanzadas />} />
              <Route path="/seleccionar-equipo" element={<SeleccionarEquipo />} />
              <Route path="/resumen-partido/:partido_id" element={<ResumenPartido />} />
              <Route path="/jugador/:jugador_id/stats" element={<StatsJugador />} />
              <Route path="/club" element={<GestionClub />} />
              <Route path="/club/usuarios" element={<GestionClubUsuarios />} />
              <Route path="/club/equipos" element={<GestionEquiposClub />} />
              <Route path="/club/info" element={<GestionInfoClub />} />
              <Route path="/club/entrenadores" element={<GestionClubEntrenadores />} />
              <Route path="/perfil" element={<EditarPerfil />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      )}
    </>
  );
};

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Rutas />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
