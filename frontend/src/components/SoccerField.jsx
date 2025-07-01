// SoccerField.jsx
"use client"

import "./SoccerField.css"

// O componente agora só precisa saber o layout do time e como deletar um jogador
function SoccerField({ teamLayout, onPlayerDelete }) {

  const handlePositionClick = (position) => {
    const playerInPosition = teamLayout[position];

    // A única interação é deletar um jogador que já está posicionado
    if (playerInPosition) {
      onPlayerDelete(position, playerInPosition);
    }
  };

  const renderPlayer = (position) => {
    const player = teamLayout[position];
    return (
      <div
        className={`player-spot ${player ? "occupied" : ""}`}
        onClick={() => handlePositionClick(position)}
      >
        {player ? (
          <div className="player-info">
            <div className="player-avatar">{player.playerName.charAt(0).toUpperCase()}</div>
            <div className="player-name">{player.playerName}</div>
          </div>
        ) : (
          <div className="empty-spot">+</div>
        )}
      </div>
    );
  };

  return (
    <div className="soccer-field">
      <div className="field-markings">
        <div className="center-circle"></div>
        <div className="penalty-area-top"></div>
        <div className="penalty-area-bottom"></div>
        <div className="goal-top"></div>
        <div className="goal-bottom"></div>
        <div className="center-line"></div>
      </div>
      <div className="player-positions">
        <div className="position goalkeeper">{renderPlayer("goalkeeper")}</div>
        <div className="position defenders">
          {renderPlayer("defender1")}
          {renderPlayer("defender2")}
        </div>
        <div className="position midfielders">
          {renderPlayer("midfielder1")}
          {renderPlayer("midfielder2")}
        </div>
      </div>
    </div>
  )
}

export default SoccerField;