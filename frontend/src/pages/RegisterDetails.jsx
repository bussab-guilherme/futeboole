"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./RegisterDetails.css"

const RegisterDetails = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    teamName: "",
    isPlayer: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Handle input changes (sem alterações)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Handle form submission with a single registration function
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // --- Validação Simples ---
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem." })
      setLoading(false)
      return
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      // Cria o objeto 'player' somente se 'isPlayer' for true
      player: formData.isPlayer ? { playerName: formData.username } : null,
      // Cria o objeto 'team'
      team: { teamName: formData.teamName },
    }

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // Tenta extrair uma mensagem de erro do backend, se houver
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "O nome de usuário já pode existir. Tente outro.")
      }

      // Sucesso! Redireciona para a página de login
      // Você pode adicionar uma mensagem de sucesso aqui se desejar
      navigate("/login")

    } catch (error) {
      setErrors({
        submit: error.message || "Erro ao finalizar cadastro. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-details-container">
      <div className="register-details-card">
        <div className="register-details-header">
          <h1>Finalizar Cadastro</h1>
          <p>Complete suas informações para começar a usar o Futeboole</p>
        </div>

        <form onSubmit={handleRegister} className="register-details-form">
          {/* User and Password Section */}
          <div className="form-section">
            <h3>Definir Usuário e Senha</h3>

            <div className="form-group">
              <label htmlFor="username">Nome de Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "error" : ""}
                placeholder="Escolha seu nome de usuário"
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "error" : ""}
                placeholder="Digite sua senha"
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "error" : ""}
                placeholder="Confirme sua senha"
                required
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Player Role Section */}
          <div className="form-section">
            <h3>Participação em Partidas</h3>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isPlayer" checked={formData.isPlayer} onChange={handleInputChange} />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <strong>Quero participar como jogador ativo</strong>
                  <p>
                    Marque esta opção se você deseja participar ativamente das partidas e ser incluído nas escalações.
                  </p>
                </div>
              </label>
            </div>
          </div>
          
          {/* Team Name Section */}
          <div className="form-section">
            <h3>Crie seu Time</h3>
             <div className="form-group">
              <label htmlFor="teamName">Nome do Time</label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                className={errors.teamName ? "error" : ""}
                placeholder="ex.: Afogados FC"
                required
              />
              {errors.teamName && <span className="error-message">{errors.teamName}</span>}
            </div>
          </div>

          {/* Submit Section */}
          <div className="form-section">
            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Finalizando...
                </span>
              ) : (
                "Finalizar Cadastro"
              )}
            </button>
          </div>
        </form>

        <div className="register-details-footer">
          <p>
            Já tem uma conta?
            <button type="button" className="link-button" onClick={() => navigate("/login")}>
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterDetails