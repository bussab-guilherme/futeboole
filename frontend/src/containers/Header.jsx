"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import logoFuteboole from "../assets/logo_futeboole.png"
import UserProfile from "../components/UserProfile"
import { useUserTeam } from "../contexts/UserTeamContext"

function Header() {
  const [showProfile, setShowProfile] = useState(false)
  const { currentUser, loading, logout } = useUserTeam(); 



  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#38b6ff",
    color: "white",
    borderBottom: "2px solid white",
  }

  const logoStyle = {
    height: "125px",
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

  if (loading) return null

  return (
    <header style={headerStyle}>
      <Link to="/">
        <img src={logoFuteboole || "/placeholder.svg"} alt="Logo" style={logoStyle} />
      </Link>

      {currentUser && ( // 3. Usa o currentUser do contexto
        <div style={{ position: "relative" }}>
          <button style={profileButtonStyle} onClick={toggleProfile}>
            {currentUser.username.charAt(0).toUpperCase()}
          </button>

          {showProfile && (
            <UserProfile
              user={currentUser}
              onClose={() => setShowProfile(false)}
              // O logout agora vem do contexto
              onLogout={() => {
                logout();
                setShowProfile(false);
              }}
            />
          )}
        </div>
      )}
    </header>
  );
}

export default Header

