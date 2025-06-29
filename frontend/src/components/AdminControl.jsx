// src/components/AdminControl.jsx

"use client";

import { useState } from "react";
import Button from "../containers/Button";
import "./AdminControl.css"; // Vamos criar este arquivo para a estilização

function AdminControl() {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    // Limpa a notificação após 5 segundos
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
  };

  // Função para criar uma nova partida
  const handleCreateRound = async () => {
    if (!window.confirm("Tem certeza que deseja criar uma nova partida? Isso irá resetar os scores dos jogadores e os votos.")) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/round/create", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Falha na resposta do servidor");
      }
      
      showNotification("Nova partida criada com sucesso!", "success");
    } catch (error) {
      showNotification(`Erro ao criar partida: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Função para finalizar a partida atual
  const handleEndRound = async () => {
    if (!window.confirm("Tem certeza que deseja finalizar a partida? Os preços e scores serão atualizados.")) {
        return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/round/over", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Falha na resposta do servidor");
      }

      showNotification("Partida finalizada e preços atualizados!", "success");
    } catch (error) {
      showNotification(`Erro ao finalizar partida: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-control-panel">
      <h3>Painel do Administrador</h3>
      <div className="admin-control-buttons">
        <Button onClick={handleCreateRound} disabled={loading}>
          {loading ? "Processando..." : "Criar Partida"}
        </Button>
        <Button onClick={handleEndRound} disabled={loading}>
          {loading ? "Processando..." : "Finalizar Partida"}
        </Button>
      </div>
      {notification.message && (
        <div className={`admin-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default AdminControl;