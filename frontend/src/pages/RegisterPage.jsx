"use client"
import Page from "../containers/Page"
import Block from "../containers/Block"
import Button from "../containers/Button"
import Footer from "../containers/Footer"
import Header from "../containers/PageHeader"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function RegisterPage() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verifica se já tem sessão ativa
    fetch("/api/users/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.text() : null))
      .then((username) => {
        if (username) {
          window.location.href = "/mercado" // redireciona se já logado
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return null
  }

  const handleNewUser = () => {
    navigate("/register-details")
  }

  const handleExistingUser = () => {
    navigate("/login")
  }

  return (
    <Page>
      <Header title="Bem-vindo ao FuteBoole!" />
      <Block>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <img
            src="/futeboole/frontend/src/assets/logo_futeboole.png"
            alt="FuteBoole Logo"
            style={{ maxWidth: "200px", marginBottom: "30px" }}
          />

          <h2 style={{ marginBottom: "20px", color: "#333" }}>Pronto para entrar no jogo?</h2>

          <p style={{ marginBottom: "30px", fontSize: "16px", lineHeight: "1.5" }}>
            O FuteBoole é sua plataforma de fantasy football onde você pode criar seu time dos sonhos, competir com
            amigos e mostrar seus conhecimentos sobre futebol.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "300px", margin: "0 auto" }}>
            <Button onClick={handleNewUser} style={{ backgroundColor: "#4CAF50", color: "white", padding: "15px" }}>
              Sou novo aqui - Criar conta
            </Button>

            <Button
              onClick={handleExistingUser}
              style={{ backgroundColor: "#2196F3", color: "white", padding: "15px" }}
            >
              Já tenho conta - Fazer login
            </Button>
          </div>

          <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px", color: "#333" }}>Por que escolher o FuteBoole?</h3>
            <ul style={{ textAlign: "left", maxWidth: "400px", margin: "0 auto" }}>
              <li style={{ marginBottom: "8px" }}>🏆 Compete com jogadores do mundo todo</li>
              <li style={{ marginBottom: "8px" }}>⚽ Escale seu time com jogadores reais</li>
              <li style={{ marginBottom: "8px" }}>📊 Acompanhe estatísticas detalhadas</li>
              <li style={{ marginBottom: "8px" }}>🎯 Participe de ligas e torneios</li>
              <li style={{ marginBottom: "8px" }}>💰 Sistema de mercado dinâmico</li>
            </ul>
          </div>
        </div>
      </Block>
      <Footer />
    </Page>
  )
}

export default RegisterPage
