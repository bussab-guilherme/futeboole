// frontend/src/components/Report.jsx
"use client"

import { useState, useEffect } from "react";
import { useUserTeam } from "../contexts/UserTeamContext";
import "./Report.css";

function Report({ isReportOpen }) {
  const [playerScores, setPlayerScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useUserTeam();

  useEffect(() => {
    // Só busca os dados se a aba de relatório estiver aberta
    if (isReportOpen) {
      const fetchPlayerScores = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch("/api/users/players", { credentials: 'include' });
          if (!response.ok) {
            throw new Error("Não foi possível carregar o relatório de pontuações.");
          }
          const data = await response.json();
          
          setPlayerScores(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPlayerScores();
    }
  }, [isReportOpen]);

  if (!isReportOpen) {
    return (
      <div className="report-closed-container">
        <div className="icon">🔒</div>
        <h1>Relatório Indisponível</h1>
        <p>O relatório final da partida só pode ser acessado após o fim da rodada.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-message">Carregando relatório...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="report-container fade-in">
      <div className="report-header">
        <h2>Relatório Final da Partida</h2>
        <p>Confira seu desempenho e a pontuação de todos os jogadores.</p>
      </div>

      {currentUser && (
        <div className="report-user-stats">
          <div className="stat-card">
            <span className="stat-label">Seu Dinheiro Atual</span>
            <span className="stat-value money">R$ {currentUser.money.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Sua Pontuação Pessoal</span>
            <span className="stat-value score">{currentUser.globalScore.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="report-player-list">
        <div className="list-header">
          <span>Jogador</span>
          <span>Pontuação Final</span>
        </div>
        <div className="list-body">
          {playerScores.map((player) => (
            <div className="list-row" key={player.playerName}>
              <span className="player-name_1">{player.playerName}</span>
              <span className="player-score">{player.playerScore.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;