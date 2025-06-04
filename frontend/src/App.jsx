import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Registrar from "./views/Registrar";
import VistaAdmin from "./views/VistaAdmin";
import DashboardPrincipal from "./views/DashboardPrincipal";
import DashboardPartido from "./views/DashboardPartido.jsx";
import Jugadores from "./views/Jugadores.jsx";
import Partidos from "./views/Partidos.jsx";
import ResumenPartido from "./views/ResumenPartido.jsx";  
import SeleccionarEquipo from "./views/SeleccionarEquipo.jsx";
import LandingPage from "./views/LandingPage.jsx";
import GestionClub from "./views/GestionClub.jsx";
import GestionClubUsuarios from "./views/GestionClubUsuarios.jsx";
import GestionEquiposClub from "./views/GestionEquiposClub.jsx";
import GestionInfoClub from "./views/GestionInfoClub.jsx";
import EditarPerfil  from "./views/Perfil.jsx";
import StatsJugador from "./views/StatsJugador.jsx";
import GestionClubEntrenadores from "./views/GestionClubEntrenadores.jsx";
import NotFound from "./views/NotFound.jsx";
import CrearUsuarioForm from "./views/CrearUsuarioFrom.jsx";

import './index.css';
import StatsAvanzadas from "./views/StatsAvanzadas.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
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
        <Route path="/perfil" element={<EditarPerfil />} />
        <Route path="/club/entrenadores" element={<GestionClubEntrenadores />} />
        <Route path="/establecer-contraseña" element={<CrearUsuarioForm />}/>
        
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
