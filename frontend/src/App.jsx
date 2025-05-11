import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Registrar from "./views/Registrar";
import VistaAdmin from "./views/VistaAdmin";
import DashboardPrincipal from "./views/DashboardPrincipal";
import DashboardPartido from "./views/DashboardPartido.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/admin" element={<VistaAdmin />} />
        <Route path="/dashboard" element={<DashboardPrincipal />} />
        <Route path="/nuevo-partido" element={<DashboardPartido />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
