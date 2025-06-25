"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import logoFuteboole from "../assets/logo_futeboole.png"
import UserProfile from "../components/UserProfile"

function Header() {
  const [showProfile, setShowProfile] = useState(false)

  // Dados de exemplo do usuário logado - em produção viriam da API/localStorage
  const currentUser = {
    username: "Usuario123",
    playerScore: 85.5,
    teamScore: 120.3,
    numVotes: 12,
    team: ["João", "Maria", "Pedro"],
  }

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 25px",
    backgroundColor: "#38b6ff",
    color: "white",
    borderBottom: "2px solid white",
  }

  const logoStyle = {
    height: "200px",
    width: "auto",
  }

  const profileButtonStyle = {
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  }

  const toggleProfile = () => {
    setShowProfile(!showProfile)
  }

  return (
    <header style={headerStyle}>
      <Link to="/">
        <img src={logoFuteboole || "/placeholder.svg"} alt="Logo" style={logoStyle} />
      </Link>
      <div style={{ position: "relative" }}>
        <button style={profileButtonStyle} onClick={toggleProfile}>
          {currentUser.username.charAt(0).toUpperCase()}
        </button>

        {showProfile && <UserProfile user={currentUser} onClose={() => setShowProfile(false)} />}
      </div>
    </header>
  )
}

export default Header
