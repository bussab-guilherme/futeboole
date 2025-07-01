// Votacao.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import "./Votacao.css";
import Page from "../containers/Page";
import Block from "../containers/Block";
import PlayerCard from "./PlayerCard";
import Notification from "./Notification";
import VotacaoFechada from "./VotacaoFechada";

// Função auxiliar para processar JSON de forma segura
async function safeResponseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    return text || null;
  }
}

function Votacao({ isVotingOpen }) {
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    // Não precisamos mais resetar o estado aqui, evitando loops.
    setIsLoading(true);

    try {
      const [playersResponse, votesResponse] = await Promise.all([
        fetch("/api/users/players", { credentials: "include" }),
        fetch("/api/users/votes", { credentials: "include" })
      ]);


      if (!playersResponse.ok) {
        throw new Error("Erro ao buscar a lista de jogadores.");
      }

      if (!votesResponse.ok) throw new Error("Erro ao buscar seus votos anteriores.");

      // Este código só será executado se o mercado estiver aberto, mas o deixamos aqui por completude.
      const allPlayers = await safeResponseJson(playersResponse) || [];
      const userVotes = await safeResponseJson(votesResponse) || [];

      const mergedPlayers = allPlayers.map(player => {
        const existingVote = userVotes.find(vote => vote.player === player.first);
        return {
          playerName: player.playerName,
          score: existingVote ? existingVote.score : 5.0,
          voted: !!existingVote,
          isSubmitting: false,
        };
      });

      setPlayers(mergedPlayers);
    } catch (error) {
      console.error("Erro ao carregar dados da votação:", error);
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
    // CORREÇÃO DO BUG: Removida a dependência [isVotingClosed] que causava o loop infinito.
    // A função de busca de dados só precisa rodar uma vez quando o componente é montado.
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // (O resto do seu componente permanece o mesmo)
  // handleScoreChange, handleConfirmVote...
  const handleScoreChange = (playerName, value) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player => {
        if (player.playerName === playerName) {
          const newScore = Math.max(0, Math.min(10, player.score + value));
          return { ...player, score: newScore };
        }
        return player;
      })
    );
  };

  const handleConfirmVote = async (playerName, score) => {
    setPlayers(prev =>
      prev.map(p =>
        p.playerName === playerName ? { ...p, isSubmitting: true } : p
      )
    );

    try {
      const response = await fetch(`/api/users/giveScoreToPlayer/${playerName}/${score}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await safeResponseJson(response);
        throw new Error(errorText || "Falha ao registrar o voto.");
      }

      setPlayers(prev =>
        prev.map(p =>
          p.playerName === playerName ? { ...p, voted: true, isSubmitting: false } : p
        )
      );
      setMessage({ text: `Voto para ${playerName} registrado com sucesso!`, type: "success" });
    } catch (error) {
      console.error("Erro ao confirmar voto:", error);
      setMessage({ text: error.message, type: "error" });
      setPlayers(prev =>
        prev.map(p =>
          p.playerName === playerName ? { ...p, isSubmitting: false } : p
        )
      );
    } finally {
      setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    }
  };


  if (isLoading) {
    return null; // ou um componente de Spinner/Loading
  }

  // LÓGICA DE RENDERIZAÇÃO CORRIGIDA E CLARA:
  // Se a votação estiver fechada, mostre o componente VotacaoFechada.
  // Caso contrário, mostre a interface de votação.
  if (!isVotingOpen) {
    return <VotacaoFechada />;
  }

  return (
    <Page>
      <Notification message={message.text} type={message.type} />
      <h1>Votação</h1>
      
      {/* Mensagem de erro caso a busca de votos falhe, mesmo com a votação aberta */}
      {message.type === 'error' && !players.length && (
        <Block>
          <p className="error-message">{message.text}</p>
        </Block>
      )}

      {/* Condição ajustada para o caso de não haver jogadores (ex: API de jogadores não disponível na votação) */}
      {players.length > 0 ? (
        <Block style={{ width: "100%", maxWidth: "800px" }}>
          <div className="votacao-container fade-in">
            <div className="votacao-instrucoes">
              <p>Avalie os jogadores com notas de 0 a 10.</p>
            </div>
            <div className="jogadores-lista">
              {players.map((player) => (
                <PlayerCard
                  key={player.playerName}
                  player={player}
                  onScoreChange={handleScoreChange}
                  onConfirmVote={handleConfirmVote}
                  isSubmitting={player.isSubmitting}
                />
              ))}
            </div>
          </div>
        </Block>
      ) : (
         // Se a votação está aberta mas não há jogadores, podemos mostrar um aviso
         !message.text && (
            <Block>
              <p>A votação está aberta, mas não foi possível carregar a lista de jogadores para avaliação.</p>
            </Block>
         )
      )}
    </Page>
  );
}

export default Votacao;