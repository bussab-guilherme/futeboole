// Mercado.jsx
"use client"

import { useState, useEffect } from "react"
import "./Mercado.css"
import Page from "../containers/Page"
import SoccerField from "./SoccerField"
import UserList from "./UserList"
import Notification from "./Notification"
import MercadoFechado from "./MercadoFechado" // NOVO: Importa o componente

function Mercado() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [marketPlayers, setMarketPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [money, setMoney] = useState(null);
  const [notification, setNotification] = useState({ text: '', type: '' });
  const [isMarketClosed, setIsMarketClosed] = useState(false); // NOVO: Estado para controlar o mercado

  // Estado do time posicionado no campo
  const [teamLayout, setTeamLayout] = useState({
    goalkeeper: null,
    defender1: null,
    defender2: null,
    midfielder1: null,
    midfielder2: null,
  });

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      setIsMarketClosed(false);
      setError(null);
      setLoading(true);

      try {
        const [marketResponse, teamResponse] = await Promise.all([
          fetch("/api/market/allPlayersPrice", { credentials: 'include' }),
          fetch("/api/users/me", { credentials: 'include' })
        ]);

        if (!marketResponse.ok) {
          if (marketResponse.status === 400) {
            const errorText = await marketResponse.text();
            if (errorText.toLowerCase().includes("market not open")) {
              setIsMarketClosed(true);
              return;
            }
          }
          throw new Error(`Erro ao buscar mercado: ${await marketResponse.text()}`);
        }

        if (!teamResponse.ok) throw new Error(`Erro ao buscar time: ${await teamResponse.text()}`);

        const marketData = await marketResponse.json();
        const userData = await teamResponse.json();

        const transformedMarket = marketData.map(pair => ({
          id: pair.first,
          username: pair.first,
          price: pair.second,
          playerScore: 'N/A'
        }));

        setMarketPlayers(transformedMarket);
        setMyTeam(userData.team);
        setMoney(userData.money);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Efeito para popular o campo quando os dados do time chegam
  useEffect(() => {
    if (myTeam && myTeam.players && marketPlayers.length > 0) {
      const positions = ['goalkeeper', 'defender1', 'defender2', 'midfielder1', 'midfielder2'];
      const newTeamLayout = {};
      positions.forEach(pos => newTeamLayout[pos] = null);

      myTeam.players.forEach((player, index) => {
        if (index < positions.length) {
          const marketInfo = marketPlayers.find(mp => mp.username === player.playerName);
          newTeamLayout[positions[index]] = {
            ...player,
            price: marketInfo?.price || 0
          };
        }
      });
      setTeamLayout(newTeamLayout);
    }
  }, [myTeam, marketPlayers]);

  const deletePlayer = async (position, player) => {
    const originalLayout = { ...teamLayout };
    const originalMoney = money;

    setTeamLayout(prev => ({ ...prev, [position]: null }));

    try {
      const response = await fetch(`/api/users/deleteFromTeam/${player.playerName}`, { method: 'PUT', credentials: 'include' });
      if (!response.ok) throw new Error(await response.text());
      const responseData = await response.json();
      setMoney(responseData.newMoney);
      setMyTeam(prev => ({
        ...prev,
        players: prev.players.filter(p => p.playerName !== player.playerName)
      }));
    } catch (error) {
      setTeamLayout(originalLayout);
      setMoney(originalMoney);
      setError(`Erro ao remover jogador: ${error.message}`);
    }
  };

  const addPlayer = async (position, player) => {
    const originalLayout = { ...teamLayout };
    const originalMoney = money;

    const newPlayerForLayout = {
      ...player,
      playerName: player.username,
    };

    setTeamLayout(prev => ({ ...prev, [position]: newPlayerForLayout }));

    try {
      const response = await fetch(`/api/users/addToTeam/${player.username}`, { method: 'PUT', credentials: 'include' });
      if (!response.ok) throw new Error(await response.text());
      const responseData = await response.json();
      setMoney(responseData.newMoney);
      setMyTeam(prev => ({
        ...prev,
        players: [...prev.players, { ...player, playerName: player.username }]
      }));
    } catch (error) {
      setTeamLayout(originalLayout);
      setMoney(originalMoney);
      setError(`Erro ao adicionar jogador: ${error.message}`);
    }
  };

  const handleConfirmAddPlayer = () => {
    if (!selectedUser) return;
    if (money < selectedUser.price) {
      setNotification({ text: "Dinheiro insuficiente!", type: "error" });
      setTimeout(() => setNotification({ text: '', type: '' }), 3500);
      return;
    }

    const emptyPosition = Object.keys(teamLayout).find(pos => teamLayout[pos] === null);

    if (emptyPosition) {
      addPlayer(emptyPosition, selectedUser);
      setSelectedUser(null);
    } else {
      setNotification({ text: "Seu time está cheio!", type: "error" });
      setTimeout(() => setNotification({ text: '', type: '' }), 3500);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="mercado-status">Carregando...</div>;
    if (isMarketClosed) return <MercadoFechado />;
    if (error) return <div className="mercado-status error-message">Erro ao carregar os dados: {error}</div>;

    const isPlayerInTeam = myTeam?.players.some(p => p.playerName === selectedUser?.username);

    return (
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
          <button
            className="confirm-button"
            onClick={handleConfirmAddPlayer}
            disabled={!selectedUser || isPlayerInTeam}
          >
            Adicionar Jogador
          </button>
        </div>

        <div className="field-container">
          <SoccerField teamLayout={teamLayout} onPlayerDelete={deletePlayer} />
        </div>
      </div>
    );
  };

  return (
    <>
      <Notification message={notification.text} type={notification.type} />
      <Page>
        <div className="mercado-header">
          {myTeam && <h2 className="team-name-display">{myTeam.teamName}</h2>}
          {typeof money === 'number' && (
            <div
              className={`money-display${
                money === 0
                  ? ' money-red'
                  : money < 5
                  ? ' money-yellow'
                  : ''
              }`}
            >
              Dinheiro: R$ {money.toFixed(2)}
            </div>
          )}
        </div>
        <div className="mercado-container fade-in">
          {renderContent()}
        </div>
      </Page>
    </>
  );
}

export default Mercado;
