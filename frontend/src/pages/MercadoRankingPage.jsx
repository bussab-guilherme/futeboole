// frontend/src/pages/MercadoRankingPage.jsx
"use client"

import { useState, useEffect } from "react"
import { useUserTeam } from "../contexts/UserTeamContext"
import Page from "../containers/Page"
import Button from "../containers/Button"
import Mercado from "../components/Mercado"
import Ranking from "../components/Ranking"
import Votacao from "../components/Votacao"
import AdminControl from "../components/AdminControl"
import "./MercadoRankingPage.css"

function MercadoRankingPage() {
  const [activeTab, setActiveTab] = useState("mercado");
  
  // 1. O estado do mercado é gerenciado aqui, na página principal.
  const [isMarketOpen, setIsMarketOpen] = useState(true); 

  // 2. Todos os dados do usuário vêm do nosso contexto robusto.
  const { currentUser, loading: isUserLoading } = useUserTeam(); 
  const isAdmin = currentUser?.username === "admin";

  // 3. Este useEffect agora apenas atualiza o estado, sem recarregar a página.
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const response = await fetch('/api/market/status', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            setIsMarketOpen(data.isOpen);
        } else {
            // Se a API de status falhar, assumimos que o mercado está fechado.
            setIsMarketOpen(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status do mercado:", error);
        setIsMarketOpen(false);
      }
    };

    checkMarketStatus();
    const intervalId = setInterval(checkMarketStatus, 10000); // Continua verificando a cada 10s

    return () => clearInterval(intervalId);
  }, []); // Roda apenas uma vez para iniciar o "polling".

  // Tela de carregamento enquanto o contexto busca os dados do usuário.
  if (isUserLoading) {
    return (
        <Page>
            <div className="loading-message">Carregando...</div>
        </Page>
    );
  }

  // Se, após o carregamento, não houver usuário, redirecionamos.
  if (!currentUser) {
    // É melhor usar a navegação do React Router se possível, mas reload funciona.
    window.location.href = "/login";
    return null; // Retorna null para evitar renderizar qualquer coisa durante o redirecionamento
  }

  // Função para renderizar o conteúdo da aba ativa.
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'mercado':
        // 4. Passamos o estado do mercado como uma prop.
        return <Mercado isMarketOpen={isMarketOpen} />;
      case 'ranking':
        return <Ranking />;
      case 'votacao':
        // 5. A votação está aberta quando o mercado está FECHADO.
        return <Votacao isVotingOpen={!isMarketOpen} />;
      default:
        return <Mercado isMarketOpen={isMarketOpen} />;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}> 
      {/* O Header já é renderizado pelo App.jsx e se atualiza via contexto */}
      <Page>
        {isAdmin && <AdminControl />}
        
        <div className="mercado-ranking-tabs">
          <Button onClick={() => setActiveTab("mercado")} className={activeTab === "mercado" ? "active-tab" : ""}>
            Mercado
          </Button>
          <Button onClick={() => setActiveTab("ranking")} className={activeTab === "ranking" ? "active-tab" : ""}>
            Ranking
          </Button>
          <Button onClick={() => setActiveTab("votacao")} className={activeTab === "votacao" ? "active-tab" : ""}>
            Votação
          </Button>
        </div>

        <div className="mercado-ranking-content">
          {renderActiveTabContent()}
        </div>
      </Page>
    </div>
  )
}

export default MercadoRankingPage;