"use client"
import Page from "../containers/Page"
import Block from "../containers/Block"
import Button from "../containers/Button"
import Footer from "../containers/Footer"
import Header from "../containers/PageHeader"
import logoFuteboole from '../assets/logo_futeboole.png';
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
      <Header style={{marginBottom: "1px"}}title="Bem-vindo ao FuteBooleana!" />
        <div style={{ textAlign: "center", padding: "1px" }}>
          <img
            src={logoFuteboole}
            alt="FuteBoole Logo"
            style={{ maxWidth: "125px", marginBottom: "30px", backgroundColor: "#38b6ff", borderRadius: "15px" }}
          />

          <h2 style={{ marginBottom: "20px", color: "white" }}>Pronto para entrar no jogo?</h2>

          <p style={{ marginBottom: "30px", fontSize: "16px", lineHeight: "1.5" }}>
            O FuteBooleana é sua plataforma de fantasy football onde você pode criar seu time dos sonhos, competir com
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
        </div>
      
      <Footer />
    </Page>
  )
}

export default RegisterPage
