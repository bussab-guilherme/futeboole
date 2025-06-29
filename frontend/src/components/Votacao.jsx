"use client";

import { useState, useEffect, useCallback } from "react";
import "./Votacao.css";
import Page from "../containers/Page";
import Block from "../containers/Block";
import PlayerCard from "./PlayerCard";
import Notification from "./Notification"; // Importe o componente de notificação

// Função auxiliar para processar JSON de forma segura
async function safeResponseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    // Se não for JSON, retorna o texto (útil para erros) ou null se vazio
    return text || null;
  }
}

function Votacao() {
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [playersResponse, votesResponse] = await Promise.all([
        fetch("/api/market/allPlayersPrice", { credentials: "include" }),
        fetch("/api/users/votes", { credentials: "include" })
      ]);

      if (!playersResponse.ok) throw new Error("Erro ao buscar a lista de jogadores.");
      if (!votesResponse.ok) throw new Error("Erro ao buscar seus votos anteriores.");
      
      const allPlayers = await safeResponseJson(playersResponse) || [];
      const userVotes = await safeResponseJson(votesResponse) || [];

      const mergedPlayers = allPlayers.map(player => {
        const existingVote = userVotes.find(vote => vote.player === player.first);
        return {
          playerName: player.first,
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setPlayers(prev => prev.map(p => p.playerName === playerName ? { ...p, isSubmitting: true } : p));

    try {
      // MUDANÇA 1: O método agora é 'PUT'
      // MUDANÇA 2: A URL agora inclui o nome e a nota do jogador
      const response = await fetch(`/api/users/giveScoreToPlayer/${playerName}/${score}`, {
        method: 'PUT', // <- MUDADO DE 'POST' PARA 'PUT'
        credentials: 'include',
        // MUDANÇA 3: O 'headers' e o 'body' foram removidos, pois o backend não os utiliza.
      });

      if (!response.ok) {
        // A função safeResponseJson ainda é útil para ler a mensagem de erro do backend
        const errorText = await safeResponseJson(response); 
        // A resposta de erro do Ktor é texto puro, não um objeto JSON com .message
        throw new Error(errorText || "Falha ao registrar o voto.");
      }

      // Se o backend retornar OK (200), não há corpo para processar, então não chame .json() aqui.
      
      setPlayers(prev => prev.map(p => p.playerName === playerName ? { ...p, voted: true, isSubmitting: false } : p));
      setMessage({ text: `Voto para ${playerName} registrado com sucesso!`, type: "success" });

    } catch (error) {
      console.error("Erro ao confirmar voto:", error);
      setMessage({ text: error.message, type: "error" });
      setPlayers(prev => prev.map(p => p.playerName === playerName ? { ...p, isSubmitting: false } : p));
    } finally {
      setTimeout(() => setMessage({ text: "", type: "" }), 3500);
    }
  };

  if (isLoading) {
    return <Page><Block><h1>Carregando...</h1></Block></Page>;
  }

  return (
    <Page>
      <Notification message={message.text} type={message.type} />
      <h1>Votação</h1>
      <Block style={{ width: "100%", maxWidth: "800px" }}>
        <div className="votacao-container fade-in">
          <div className="votacao-instrucoes">
            <p>Avalie os jogadores com notas de 0 a 10.</p>
          </div>
          <div className="jogadores-lista">
            {players.map((player) => (
              <PlayerCard
                key={player.playerName} // Chave deve ser única, playerName é uma boa candidata
                player={player}
                onScoreChange={handleScoreChange}
                onConfirmVote={handleConfirmVote}
                isSubmitting={player.isSubmitting}
              />
            ))}
          </div>
        </div>
      </Block>
    </Page>
  );
}

export default Votacao;