"use client"

import "./UserProfile.css"

function UserProfile({ user, onClose }) {
  const handleLogout = async () => {
  try {
    const response = await fetch("/api/users/logout", {
      method: "POST",
      credentials: "include"
    })

    if (response.ok) {
      
      window.location.href = "/login"
    } else {
      console.error("Erro ao sair")
    }
  } catch (error) {
    console.error("Erro na requisição de logout:", error)
  }
  }
  
  
  return (
    <div className="user-profile-popup">
      <div className="user-profile-header">
        <h3>Perfil do Usuário</h3>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="user-profile-content">
        <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>

        <div className="user-details">
          <h4>{user.username}</h4>

          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Pontuação Pessoal:</span>
              <span className="stat-value">{user.player.playerScore.toFixed(1)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Nome do Time:</span>
              <span className="stat-value">{user.team.teamName}</span>
            </div>
          </div>

          <div className="user-team">
            <h5>Meu Time:</h5>
            {user.team.players.length > 0 ? (
              <ul>
                {user.team.players.map((player) => (
                  <li key={player.playerName}>
                    {player.playerName}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum jogador no time</p>
            )}
          </div>
        </div>
      </div>

      <div className="user-profile-footer">
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  )
}

export default UserProfile
