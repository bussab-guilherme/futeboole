import Button from "../containers/Button";
import "./Votacao.css";

function PlayerCard({ player, onScoreChange, onConfirmVote, isSubmitting }) {
  const hasVoted = player.voted;

  return (
    <div className={`jogador-card ${hasVoted ? "votado" : ""}`}>
      <div className="jogador-info">
        <h3>{player.playerName}</h3>
      </div>

      <div className="votacao-controles">
        <div className="nota-controle">
          <button
            className="nota-botao"
            onClick={() => onScoreChange(player.playerName, -0.5)}
            disabled={hasVoted || isSubmitting}
          >
            -
          </button>

          <div className="nota-display">{player.score.toFixed(1)}</div>

          <button
            className="nota-botao"
            onClick={() => onScoreChange(player.playerName, 0.5)}
            disabled={hasVoted || isSubmitting}
          >
            +
          </button>
        </div>

        <Button
          onClick={() => onConfirmVote(player.playerName, player.score)}
          className="confirmar-voto"
          disabled={hasVoted || isSubmitting}
        >
          {isSubmitting ? "Enviando..." : hasVoted ? "Voto Confirmado" : "Confirmar Voto"}
        </Button>
      </div>
    </div>
  );
}

export default PlayerCard;