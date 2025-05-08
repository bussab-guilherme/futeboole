"use client"
import Page from "../containers/Page"
import Button from "../containers/Button"
import Mercado from "../components/Mercado"
import Ranking from "../components/Ranking"
import { useState, useEffect } from "react"
import "./MercadoRankingPage.css"

function MercadoRankingPage() {
  const [mostrar, setMostrar] = useState("mercado") // "mercado" ou "ranking"
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Verificar se o usuário está logado (em produção, verificaria com o backend)
  useEffect(() => {
    // Simulação de verificação de login
    // Em produção, verificaria com o backend ou localStorage
    setIsLoggedIn(true)
  }, [])

  if (!isLoggedIn) {
    return (
      <Page>
        <div className="not-logged-message">
          <h2>Você precisa estar logado para acessar esta página</h2>
          <Button onClick={() => (window.location.href = "/login")}>Fazer Login</Button>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <div className="mercado-ranking-tabs">
        <Button onClick={() => setMostrar("mercado")} className={mostrar === "mercado" ? "active-tab" : ""}>
          Mercado
        </Button>
        <Button onClick={() => setMostrar("ranking")} className={mostrar === "ranking" ? "active-tab" : ""}>
          Ranking
        </Button>
      </div>

      <div className="mercado-ranking-content">
        {mostrar === "mercado" && <Mercado />}
        {mostrar === "ranking" && <Ranking />}
      </div>
    </Page>
  )
}

export default MercadoRankingPage
