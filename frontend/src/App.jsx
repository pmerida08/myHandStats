import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Login from "./views/Login";
import Registrar from "./views/Registrar";
import CrearUsuarioForm from "./views/CrearUsuarioForm";
import LandingPage from "./views/LandingPage";
import NotFound from "./views/NotFound";

import Layout from "./components/Layout";
import VistaAdmin from "./views/VistaAdmin";
import DashboardPrincipal from "./views/DashboardPrincipal";
<<<<<<< HEAD
import DashboardPartido from "./views/DashboardPartido.jsx";
import Jugadores from "./views/Jugadores.jsx";
import Partidos from "./views/Partidos.jsx";
import ResumenPartido from "./views/ResumenPartido.jsx";  
import SeleccionarEquipo from "./views/SeleccionarEquipo.jsx";
import StatsAvanzadas from "./views/StatsAvanzadas.jsx";  
import LandingPage from "./views/LandingPage.jsx";
import GestionClub from "./views/GestionClub.jsx";
import GestionClubUsuarios from "./views/GestionClubUsuarios.jsx";
import GestionEquiposClub from "./views/GestionEquiposClub.jsx";
import GestionInfoClub from "./views/GestionInfoClub.jsx";
import EditarPerfil  from "./views/Perfil.jsx";
import StatsJugador from "./views/StatsJugador.jsx";
import GestionClubEntrenadores from "./views/GestionClubEntrenadores.jsx";
import NotFound from "./views/NotFound.jsx";
=======
import DashboardPartido from "./views/DashboardPartido";
import Jugadores from "./views/Jugadores";
import Partidos from "./views/Partidos";
import ResumenPartido from "./views/ResumenPartido";
import SeleccionarEquipo from "./views/SeleccionarEquipo";
import GestionClub from "./views/GestionClub";
import GestionClubUsuarios from "./views/GestionClubUsuarios";
import GestionEquiposClub from "./views/GestionEquiposClub";
import GestionInfoClub from "./views/GestionInfoClub";
import EditarPerfil from "./views/Perfil";
import StatsJugador from "./views/StatsJugador";
import GestionClubEntrenadores from "./views/GestionClubEntrenadores";
import StatsAvanzadas from "./views/StatsAvanzadas";
>>>>>>> 734274492743b5171e50dd4b543e113e7cc1db06

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/establecer-contraseña" element={<CrearUsuarioForm />} />

          {/* Rutas privadas */}
          <Route element={<Layout />}>
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
