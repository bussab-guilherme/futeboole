"use client"

import "./HomePage.css"
import Footer from "../containers/Footer"
import Button from "../containers/Button"
import { useEffect, useState } from "react"

function HomePage() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Verifica se já tem sessão ativa
    fetch("/api/users/profile", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.ok ? res.text() : null)
      .then(username => {
        console.log("Username from session:", username)
        if (username) {
          window.location.href = "/mercado"  // redireciona se já logado
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return null
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo ao Nosso Fantasy Game!</h1>
      </header>
      
      <p className="home-intro-text">Escolha seus amigos, monte sua equipe e ganhe pontos! Seja o melhor!</p>

      <div className="home-actions-card">
        <Button onClick={() => (window.location.href = "/login")}>Login</Button>

        <p>Ainda não tem uma conta?</p>

        <Button onClick={() => (window.location.href = "/register")}>Registrar</Button>
      </div>

      <Footer />
    </div>
  )
}

export default HomePage