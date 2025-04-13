import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from "./views/Registrar"
import Login from "./views/Login"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
