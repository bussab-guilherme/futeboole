// MercadoRankingPage.jsx

"use client"
import Page from "../containers/Page"
import Button from "../containers/Button"
import Mercado from "../components/Mercado"
import Ranking from "../components/Ranking"
import Votacao from "../components/Votacao"
import AdminControl from "../components/AdminControl"; // 1. IMPORTAR o novo componente
import { useState, useEffect } from "react"
import "./MercadoRankingPage.css"

function MercadoRankingPage() {
  const [mostrar, setMostrar] = useState("mercado")
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // 2. NOVO ESTADO para o admin
  const [loading, setLoading] = useState(true); // Estado para o carregamento da página

  useEffect(() => {
    // 3. ATUALIZADO: Lógica para verificar o login e o status de admin
    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/users/me", { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          // Assumindo que o objeto do usuário tem uma propriedade 'role' ou 'isAdmin'
          // Ajuste 'userData.role === "admin"' conforme a sua API
          if (userData.username === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status do usuário:", error);
      } finally {
        setLoading(false); // Finaliza o carregamento em qualquer caso
      }
    };
    checkUserStatus();
  }, []);

  // Tela de carregamento enquanto verifica o status do usuário
  if (loading) {
    return (
        <Page>
            <div className="not-logged-message">Carregando...</div>
        </Page>
    );
  }

  // Tela se não estiver logado
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

  // Conteúdo principal da página para usuários logados
  return (
    // 4. ADICIONADO: Um wrapper para permitir o posicionamento absoluto do painel de admin
    <div style={{ position: 'relative', width: '100%' }}> 
      <Page>
        {isAdmin && <AdminControl />} {/* 5. RENDERIZAÇÃO CONDICIONAL do painel */}
        
        <div className="mercado-ranking-tabs">
          <Button onClick={() => setMostrar("mercado")} className={mostrar === "mercado" ? "active-tab" : ""}>
            Mercado
          </Button>
          <Button onClick={() => setMostrar("ranking")} className={mostrar === "ranking" ? "active-tab" : ""}>
            Ranking
          </Button>
          <Button onClick={() => setMostrar("votacao")} className={mostrar === "votacao" ? "active-tab" : ""}>
            Votação
          </Button>
        </div>

        <div className="mercado-ranking-content">
          {mostrar === "mercado" && <Mercado />}
          {mostrar === "ranking" && <Ranking />}
          {mostrar === "votacao" && <Votacao />}
        </div>
      </Page>
    </div>
  )
}

export default MercadoRankingPage