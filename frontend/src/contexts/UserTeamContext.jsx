"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const UserTeamContext = createContext();

export function UserTeamProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        try {
            // Este endpoint agora retorna o usuário completo, incluindo a equipe.
            const response = await fetch("/api/users/me", { credentials: 'include' });
            if (!response.ok) {
                // Se a sessão não for encontrada, limpa os dados e prepara para redirecionar.
                throw new Error('Sessão não encontrada ou inválida.');
            }
            
            const userData = await response.json();
            setCurrentUser(userData);
        } catch (err) {
            setError(err.message);
            setCurrentUser(null);
            // Se o fetch falhar (usuário não logado), o componente que usa o contexto irá redirecionar.
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/users/logout", { method: "POST", credentials: "include" });
        } catch (error) {
            console.error("Erro no logout do backend, mas continuando no frontend:", error);
        } finally {
            setCurrentUser(null);
            navigate('/login');
        }
    }, [navigate]);

    // LÓGICA PREENCHIDA PARA ADICIONAR JOGADOR
    const addPlayerToTeam = useCallback(async (player) => {
        if (!currentUser || currentUser.money < player.price) {
            throw new Error("Dinheiro insuficiente ou usuário não encontrado.");
        }

        const response = await fetch(`/api/users/addToTeam/${player.username}`, { method: 'PUT', credentials: 'include' });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Falha ao adicionar jogador." }));
            throw new Error(errorData.message || "Erro desconhecido do servidor.");
        }

        const responseData = await response.json();

        // Atualização otimista do estado
        setCurrentUser(prevUser => ({
            ...prevUser,
            money: responseData.newMoney,
            team: {
                ...prevUser.team,
                players: [...prevUser.team.players, { playerName: player.username, ...player }]
            }
        }));
    }, [currentUser]);

    // LÓGICA PREENCHIDA PARA REMOVER JOGADOR
    const removePlayerFromTeam = useCallback(async (player) => {
        if (!currentUser) throw new Error("Usuário não encontrado.");
        
        const response = await fetch(`/api/users/deleteFromTeam/${player.playerName}`, { method: 'PUT', credentials: 'include' });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Falha ao remover jogador." }));
            throw new Error(errorData.message || "Erro desconhecido do servidor.");
        }

        const responseData = await response.json();

        // Atualização otimista do estado
        setCurrentUser(prevUser => ({
            ...prevUser,
            money: responseData.newMoney,
            team: {
                ...prevUser.team,
                players: prevUser.team.players.filter(p => p.playerName !== player.playerName)
            }
        }));
    }, [currentUser]);

    const value = {
        currentUser,
        // Expondo money e myTeam diretamente para facilitar o uso
        money: currentUser?.money, 
        myTeam: currentUser?.team,
        loading,
        error,
        logout,
        addPlayerToTeam,      // Função completa
        removePlayerFromTeam, // Função completa
        refetchUser: fetchUserData,
    };

    return (
        <UserTeamContext.Provider value={value}>
            {children}
        </UserTeamContext.Provider>
    );
}

// O hook para consumir o contexto permanece o mesmo
export const useUserTeam = () => {
    const context = useContext(UserTeamContext);
    if (context === undefined) {
        throw new Error('useUserTeam must be used within a UserTeamProvider');
    }
    return context;
};