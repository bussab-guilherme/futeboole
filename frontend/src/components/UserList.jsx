"use client"

import "./UserList.css"

function UserList({ money, users, onSelectUser, selectedUser, myTeam }) {
  // Criamos um Set com os nomes dos jogadores do time para busca rápida (O(1))
  const playersInMyTeam = new Set(myTeam?.players.map(p => p.playerName));

  // Supondo que myTeam tenha uma propriedade 'budget' com o dinheiro disponível
  const budget = money ?? 0;

  return (
    <div className="user-list">
      <div className="user-list-header">
        <span>Nome</span>
        <span>Preço</span>
        <span>Status</span>
      </div>
      <div className="user-list-items">
        {users.map((user) => {
          const isSelected = selectedUser && selectedUser.id === user.id;
          const isInTeam = playersInMyTeam.has(user.username);
          const canAfford = user.price <= budget;

          // Define a classe do item com base no seu estado
          const itemClass = `
            user-list-item 
            ${isSelected ? "selected" : ""}
            ${isInTeam ? "in-team" : ""}
            ${!isInTeam && !canAfford ? "unavailable" : ""}
          `;

          // Não permite clicar em um jogador que já está no time ou não pode pagar
          const handleSelect = () => {
            if (!isInTeam && canAfford) {
              onSelectUser(user);
            }
          };

          return (
            <div
              key={user.id}
              className={itemClass.trim()}
              onClick={handleSelect}
            >
              <span className="user-name">{user.username}</span>
              <span className="user-price">${user.price.toFixed(2)}</span>
              <span className="user-status">
                {isInTeam && <span className="status-in-team">No seu time</span>}
                {!isInTeam && canAfford && (
                  <span className="status-available">Disponível</span>
                )}
                {!isInTeam && !canAfford && (
                  <span className="status-unavailable">Indisponível</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default UserList