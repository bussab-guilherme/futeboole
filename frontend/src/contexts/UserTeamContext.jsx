"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Importante para redirecionar após logout

const UserTeamContext = createContext();

export function UserTeamProvider({ children }) {
    // MODIFICADO: Agora temos um estado para o usuário inteiro
    const [currentUser, setCurrentUser] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/users/me", { credentials: 'include' });
            if (!response.ok) throw new Error('Sessão não encontrada ou inválida.');
            
            const userData = await response.json();
            setCurrentUser(userData);
        } catch (err) {
            setError(err.message);
            setCurrentUser(null);
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
            setCurrentUser(null); // Limpa o usuário do estado global
            navigate('/login'); // Redireciona para a página de login
        }
    }, [navigate]);

    // As funções buy/sell player continuariam aqui, mas omitidas para brevidade...
    // Elas agora atualizariam o currentUser.money e currentUser.team
    const buyPlayer = useCallback(async (player) => { /* ... */ }, []);
    const sellPlayer = useCallback(async (player) => { /* ... */ }, []);

    // O valor fornecido agora inclui o usuário e a função de logout
    const value = {
        currentUser,
        // Para facilitar, podemos expor money e myTeam diretamente
        money: currentUser?.money, 
        myTeam: currentUser?.team,
        loading,
        error,
        logout,
        refetchUser: fetchUserData, // Função para forçar a atualização dos dados
        buyPlayer,
        sellPlayer,
    };

    return (
        <UserTeamContext.Provider value={value}>
            {children}
        </UserTeamContext.Provider>
    );
}

// O hook continua o mesmo
export const useUserTeam = () => {
    return useContext(UserTeamContext);
};