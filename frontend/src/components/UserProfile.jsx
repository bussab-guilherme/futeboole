"use client"

import "./UserProfile.css"

function UserProfile({ user, onClose }) {
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
              <span className="stat-value">{user.playerScore.toFixed(1)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Pontuação do Time:</span>
              <span className="stat-value">{user.teamScore.toFixed(1)}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Votos Realizados:</span>
              <span className="stat-value">{user.numVotes}</span>
            </div>
          </div>

          <div className="user-team">
            <h5>Meu Time:</h5>
            {user.team.length > 0 ? (
              <ul>
                {user.team.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum jogador no time</p>
            )}
          </div>
        </div>
      </div>

      <div className="user-profile-footer">
        <button className="logout-button">Sair</button>
      </div>
    </div>
  )
}

export default UserProfile
