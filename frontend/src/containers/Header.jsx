"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import logoFuteboole from "../assets/logo_futeboole.png"
import UserProfile from "../components/UserProfile"

function Header() {
  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState(null)      // ← estado de usuário
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  fetch("/api/users/profile", {
    method: "GET",
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) return null
      return res.text() // retorna o username como string
    })
    .then(name => {
      console.log("Nome retornado por /profile:", name)
      if (!name) {
        setUser(null)
        return
      }

      // Agora faz o fetch completo do usuário
      return fetch(`/api/users/byUsername/${encodeURIComponent(name)}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
    })
    .then(res => {
      if (!res || !res.ok) throw new Error("Usuário não encontrado")
      return res.json() // resposta completa do usuário em JSON
    })
    .then(userData => {
      // Remove campo de senha se estiver vindo do backend (por segurança)
      const { password, ...safeUserData } = userData

      setUser(safeUserData)
    })
    .catch(err => {
      console.error("Erro ao buscar dados do usuário:", err)
      setUser(null)
    })
    .finally(() => setLoading(false))
}, [])



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

      {user && (
        <div style={{ position: "relative" }}>
          <button style={profileButtonStyle} onClick={toggleProfile}>
            {user.username.charAt(0).toUpperCase()}
          </button>

          {showProfile && (
            <UserProfile
              user={user}
              onClose={() => setShowProfile(false)}
              onLogout={() => {
                // chama logout no backend, limpa estado e fecha popup
                fetch("/api/users/logout", {
                  method: "POST",
                  credentials: "include"
                }).then(() => {
                  setUser(null)
                  setShowProfile(false)
                })
              }}
            />
          )}
        </div>
      )}
    </header>
  )
}

export default Header

