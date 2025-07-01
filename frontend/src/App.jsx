import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import MercadoRankingPage from "./pages/MercadoRankingPage"
import Header from "./containers/Header"
import RegisterPage from "./pages/RegisterPage"
import RegisterDetails from "./pages/RegisterDetails"
import Report from "./components/Report"
import { UserTeamProvider } from "./contexts/UserTeamContext"


function App() {
  return (
    <Router>
      <UserTeamProvider>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mercado" element={<MercadoRankingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-details" element={<RegisterDetails />} />
        <Route path="/report" element={<Report />} />
      </Routes>
      </UserTeamProvider>
    </Router>
  )
}

export default App
