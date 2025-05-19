import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Registrar from "./views/Registrar";
import VistaAdmin from "./views/VistaAdmin";
import DashboardPrincipal from "./views/DashboardPrincipal";
import DashboardPartido from "./views/DashboardPartido.jsx";
import Jugadores from "./views/Jugadores.jsx";
import Partidos from "./views/Partidos.jsx";
import ResumenPartido from "./views/ResumenPartido.jsx";  
import './index.css';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/admin" element={<VistaAdmin />} />
        <Route path="/dashboard" element={<DashboardPrincipal />} />
        <Route path="/nuevo-partido" element={<DashboardPartido />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/resumen-partido/:equipo_id/:partido_id" element={<ResumenPartido />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
