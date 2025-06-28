import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import MercadoRankingPage from "./pages/MercadoRankingPage"
import Header from "./containers/Header"
import RegisterPage from "./pages/RegisterPage"
import RegisterDetails from "./pages/RegisterDetails"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mercado" element={<MercadoRankingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-details" element={<RegisterDetails />} />
      </Routes>
    </Router>
  )
}

export default App
