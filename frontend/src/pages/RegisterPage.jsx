"use client"
import Page from "../containers/Page"
import Block from "../containers/Block"
import Button from "../containers/Button"
import Footer from "../containers/Footer"
import Header from "../containers/PageHeader"
import { useState, useEffect } from "react"

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Verifica se já tem sessão ativa
    fetch("/api/users/profile", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.ok ? res.text() : null)
      .then(username => {
        if (username) {
          window.location.href = "/mercado"  // redireciona se já logado
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return null
  }

  const sendUserData = async () => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, player: null, team: null }),
      })
      if (response.ok) {
        window.location.href = "/login"
      } else {
        setMessage("Usuário já existe")
      }
    } catch (error) {
      if (error) setMessage("Error sending data")
    }
  }
  return (
    <Page>
      <Header title="Registre-se" />
      <Block>
        <p>Seja bem-vindo ao FuteBoole! Registre-se para continuar.</p>
        <label htmlFor="User">Usuário: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="Password">Senha: </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={sendUserData}>Confirmar</Button>
        {message && <p style={{ color: "red" }}>{message}</p>}
      </Block>
      <Footer />
    </Page>
  )
}

export default RegisterPage
