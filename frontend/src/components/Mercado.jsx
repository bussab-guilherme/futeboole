// frontend/src/components/Mercado.jsx
"use client"

import { useState, useEffect } from "react"
import "./Mercado.css"
import Page from "../containers/Page"
import SoccerField from "./SoccerField"
import { useUserTeam } from "../contexts/UserTeamContext";
import UserList from "./UserList"
import Notification from "./Notification"
import MercadoFechado from "./MercadoFechado"

// A prop isMarketOpen virá da PaginaMercadoRanking
function Mercado({ isMarketOpen }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [marketPlayers, setMarketPlayers] = useState([]);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // 1. Obtemos TUDO que precisamos do nosso contexto.
  // Chega de 'refetchUser', agora usamos as funções otimizadas!
  const { 
    myTeam, 
    money, 
    loading: userLoading, 
    error: contextError, 
    addPlayerToTeam, 
    removePlayerFromTeam 
  } = useUserTeam();

  // O estado do layout do campo continua local, pois é apenas visual.
  const [teamLayout, setTeamLayout] = useState({
    goalkeeper: null, defender1: null, defender2: null, midfielder1: null, midfielder2: null,
  });

  // Efeito para buscar os dados do mercado (jogadores e preços)
  useEffect(() => {
    // Se a página pai já disse que o mercado está fechado, nem tentamos buscar.
    if (!isMarketOpen) {
      setMarketPlayers([]); // Limpa a lista de jogadores do mercado
      return;
    }

    const fetchMarketData = async () => {
      try {
        const response = await fetch("/api/market/allPlayersPrice", { credentials: 'include' });
        if (!response.ok) {
          throw new Error("Não foi possível carregar os dados do mercado.");
        }
        const marketData = await response.json();
        const transformedMarket = marketData.map(pair => ({
          id: pair.first, username: pair.first, price: pair.second, playerScore: 'N/A'
        }));
        setMarketPlayers(transformedMarket);
      } catch (error) {
        setNotification({ text: error.message, type: 'error' });
        setTimeout(() => setNotification({ text: '', type: '' }), 3500);
      }
    };

    fetchMarketData();
  }, [isMarketOpen]); // Depende do estado que vem da página pai

  // Efeito para sincronizar o campo de futebol com os dados do time do contexto
  useEffect(() => {
    if (myTeam && myTeam.players) {
      const positions = ['goalkeeper', 'defender1', 'defender2', 'midfielder1', 'midfielder2'];
      const newTeamLayout = {};
      positions.forEach(pos => newTeamLayout[pos] = null); // Limpa o layout

      myTeam.players.forEach((player, index) => {
        if (index < positions.length) {
          const marketInfo = marketPlayers.find(mp => mp.username === player.playerName);
          newTeamLayout[positions[index]] = { ...player, price: marketInfo?.price || 0 };
        }
      });
      setTeamLayout(newTeamLayout);
    } else {
        // Garante que o campo esteja vazio se não houver time
        setTeamLayout({goalkeeper: null, defender1: null, defender2: null, midfielder1: null, midfielder2: null})
    }
  }, [myTeam, marketPlayers]); // Re-renderiza o campo sempre que o time do contexto mudar

  // **Lógica de remoção de jogador simplificada**
  const handlePlayerDelete = async (position, player) => {
    try {
      await removePlayerFromTeam(player);
      // A atualização do `teamLayout` agora é feita pelo useEffect acima,
      // que reage à mudança no `myTeam` do contexto. Não precisamos mais do setTeamLayout aqui.
      setNotification({ text: "Jogador removido!", type: "success" });
    } catch (error) {
      setNotification({ text: `Erro: ${error.message}`, type: "error" });
    } finally {
        setTimeout(() => setNotification({ text: '', type: '' }), 2500);
    }
  };

  // **Lógica de adição de jogador simplificada**
  const handleConfirmAddPlayer = async () => {
    if (!selectedUser) return;
    
    try {
      // As validações de dinheiro e time cheio agora estão dentro da função do contexto!
      await addPlayerToTeam(selectedUser);
      // A atualização do `teamLayout` também virá do useEffect.
      setNotification({ text: "Jogador adicionado!", type: "success" });
      setSelectedUser(null);
    } catch (error) {
       setNotification({ text: `Erro: ${error.message}`, type: 'error' });
    } finally {
        setTimeout(() => setNotification({ text: '', type: '' }), 2500);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(prev => (prev && prev.id === user.id ? null : user));
  };

  if (userLoading) return <div className="mercado-status">Carregando dados do usuário...</div>;
  if (!isMarketOpen) return <MercadoFechado />;
  if (contextError) return <div className="mercado-status error-message">Erro: {contextError}</div>;

  const isPlayerInTeam = myTeam?.players.some(p => p.playerName === selectedUser?.username);

  return (
    <>
      <Notification message={notification.text} type={notification.type} />
      <Page>
        <div className="mercado-header">
          {myTeam && <h2 className="team-name-display">{myTeam.teamName}</h2>}
          {typeof money === 'number' && (
            <div className={`money-display ${money === 0 ? 'money-red' : money < 5 ? 'money-yellow' : ''}`}>
              Dinheiro: R$ {money.toFixed(2)}
            </div>
          )}
        </div>
        <div className="mercado-container fade-in">
           <div className="mercado-layout-grid">
            <div className="user-list-container">
              <h2>Jogadores Disponíveis</h2>
              <UserList
                money={money}
                users={marketPlayers}
                onSelectUser={handleUserSelect}
                selectedUser={selectedUser}
                myTeam={myTeam}
              />
            </div>

            <div className="mercado-actions">
              <button className="confirm-button" onClick={handleConfirmAddPlayer} disabled={!selectedUser || isPlayerInTeam}>
                Adicionar Jogador
              </button>
            </div>

            <div className="field-container">
              <SoccerField teamLayout={teamLayout} onPlayerDelete={handlePlayerDelete} />
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}

export default Mercado;