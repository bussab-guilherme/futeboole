"use client"

import { useState } from "react"
import "./SoccerField.css"

function SoccerField({ selectedUser }) {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [teamPlayers, setTeamPlayers] = useState({
    goalkeeper: null,
    defender1: null,
    defender2: null,
    midfielder1: null,
    midfielder2: null,
    forward: null,
  })

  const handlePositionClick = (position) => {
    setSelectedPosition(position)

    if (selectedUser) {
      setTeamPlayers({
        ...teamPlayers,
        [position]: selectedUser,
      })
    }
  }

  const renderPlayer = (position) => {
    const player = teamPlayers[position]
    return (
      <div
        className={`player-spot ${selectedPosition === position ? "selected" : ""} ${player ? "occupied" : ""}`}
        onClick={() => handlePositionClick(position)}
      >
        {player ? (
          <div className="player-info">
            <div className="player-avatar">{player.username.charAt(0)}</div>
            <div className="player-name">{player.username}</div>
          </div>
        ) : (
          <div className="empty-spot">+</div>
        )}
      </div>
    )
  }

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
        <div className="position forwards">{renderPlayer("forward")}</div>
      </div>

      {selectedUser && selectedPosition && (
        <div className="selection-info">
          Adicionando {selectedUser.username} como {selectedPosition}
        </div>
      )}
    </div>
  )
}

export default SoccerField
