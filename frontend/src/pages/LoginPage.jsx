"use client"
import "./LoginPage.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // A lógica de verificação de sessão permanece a mesma
    fetch("/api/users/profile", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.username) {
          navigate("/mercado")
        }
      })
      .catch(() => {
        // Erro na verificação, pode ignorar
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password, player: null, team: null }),
      })
      if (response.ok) {
        window.location.href = "/mercado" 
      } else {
        setMessage("Usuário ou senha incorretos")
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor. Tente novamente.")
    }
  }

  if (loading) {
    // Mantém o fundo escuro enquanto carrega
    return <div className="login-container"></div>;
  }

  return (
    <div className="login-container">
      
      <div className="page-title-container">
        <h1>Bem-vindo de volta!</h1>
        <p>Faça login para continuar na sua conta.</p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {message && <p className="error-message">{message}</p>}

          <button type="submit" className="login-button">
            Confirmar
          </button>
        </form>

        <div className="login-footer">
          <p>
            Não tem uma conta?
            <button type="button" className="link-button" onClick={() => navigate("/register")}>
              Registre-se aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage