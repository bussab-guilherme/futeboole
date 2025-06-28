// Mercado.jsx
"use client"

import { useState, useEffect } from "react"
import "./Mercado.css"
import Page from "../containers/Page"
import SoccerField from "./SoccerField"
import UserList from "./UserList"

function Mercado() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [marketPlayers, setMarketPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [money, setMoney] = useState(null); // MODIFICADO: Iniciar com null é mais seguro

  // Estado do time posicionado no campo (agora vive aqui no pai)
  const [teamLayout, setTeamLayout] = useState({
    goalkeeper: null, defender1: null, defender2: null, midfielder1: null, midfielder2: null,
  });

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketResponse, teamResponse] = await Promise.all([
          fetch("/api/market/allPlayersPrice", { credentials: 'include' }),
          fetch("/api/users/me", { credentials: 'include' })
        ]);

        if (!marketResponse.ok) throw new Error(`Erro ao buscar mercado: ${await marketResponse.text()}`);
        if (!teamResponse.ok) throw new Error(`Erro ao buscar time: ${await teamResponse.text()}`);
        
        const marketData = await marketResponse.json();
        const userData = await teamResponse.json();
        
        const transformedMarket = marketData.map(pair => ({ id: pair.first, username: pair.first, price: pair.second, playerScore: 'N/A' }));

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
    // MODIFICADO: Adicionado checagem de marketPlayers para evitar race condition
    if (myTeam && myTeam.players && marketPlayers.length > 0) {
      const positions = ['goalkeeper', 'defender1', 'defender2', 'midfielder1', 'midfielder2'];
      const newTeamLayout = {};
      positions.forEach(pos => newTeamLayout[pos] = null);

      myTeam.players.forEach((player, index) => {
        if (index < positions.length) {
          // Adiciona o preço ao jogador no layout para uso futuro (ex: venda)
          const marketInfo = marketPlayers.find(mp => mp.username === player.playerName);
          newTeamLayout[positions[index]] = {
              ...player,
              price: marketInfo?.price || 0 // Pega o preço do mercado
          };
        }
      });
      setTeamLayout(newTeamLayout);
    }
  }, [myTeam, marketPlayers]); // MODIFICADO: Depender de marketPlayers também


  // LÓGICA DE MANIPULAÇÃO DO TIME (AGORA CENTRALIZADA)

  const deletePlayer = async (position, player) => {
    const originalLayout = { ...teamLayout };
    const originalMoney = money; // Guarda o dinheiro para rollback

    setTeamLayout(prev => ({ ...prev, [position]: null })); // Atualização otimista
    
    try {
      const response = await fetch(`/api/users/deleteFromTeam/${player.playerName}`, { method: 'PUT', credentials: 'include' });
      if (!response.ok) throw new Error(await response.text());
      const responseData = await response.json();

      // MODIFICADO: Usar a chave correta 'newMoney' da API
      setMoney(responseData.newMoney); 

      setMyTeam(prev => ({...prev, players: prev.players.filter(p => p.playerName !== player.playerName)}));
    } catch (error) {
      setTeamLayout(originalLayout); // Rollback do time
      setMoney(originalMoney);      // Rollback do dinheiro
      alert(`Erro ao remover jogador: ${error.message}`);
    }
  };

  const addPlayer = async (position, player) => {
    const originalLayout = { ...teamLayout };
    const originalMoney = money; // Guarda o dinheiro para rollback

    const newPlayerForLayout = {
      ...player,
      playerName: player.username,
    };
    setTeamLayout(prev => ({ ...prev, [position]: newPlayerForLayout }));

    try {
      const response = await fetch(`/api/users/addToTeam/${player.username}`, { method: 'PUT', credentials: 'include' });
      if (!response.ok) throw new Error(await response.text());
      const responseData = await response.json();
      
      // MODIFICADO: Usar a chave correta 'newMoney' da API
      setMoney(responseData.newMoney); 
      
      // Atualizar myTeam DEPOIS de confirmar a compra
      setMyTeam(prev => ({...prev, players: [...prev.players, { ...player, playerName: player.username }]}));
    } catch (error) {
      setTeamLayout(originalLayout); // Rollback
      setMoney(originalMoney); // Rollback do dinheiro
      alert(`Erro ao adicionar jogador: ${error.message}`);
    }
  };

  const handleConfirmAddPlayer = () => {
    if (!selectedUser) return;
    if (money < selectedUser.price) {
        alert("Dinheiro insuficiente!");
        return;
    }

    const emptyPosition = Object.keys(teamLayout).find(pos => teamLayout[pos] === null);

    if (emptyPosition) {
      addPlayer(emptyPosition, selectedUser);
      setSelectedUser(null);
    } else {
      alert("Seu time está cheio!");
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
    if (error) return <div className="mercado-status error">{error}</div>;

    const isPlayerInTeam = myTeam?.players.some(p => p.playerName === selectedUser?.username);

    return (
      <div className="mercado-layout-grid">
        <div className="user-list-container">
          <h2>Jogadores Disponíveis</h2>
          <UserList money={money} users={marketPlayers} onSelectUser={handleUserSelect} selectedUser={selectedUser} myTeam={myTeam} />
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
  );
}

export default Mercado;