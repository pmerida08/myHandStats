import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Registrar from "./views/Registrar"
import Login from "./views/Login"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
