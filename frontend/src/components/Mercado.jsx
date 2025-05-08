"use client"

import { useState } from "react"
import "./Mercado.css"
import Page from "../containers/Page"
import SoccerField from "./SoccerField"
import UserList from "./UserList"

function Mercado() {
  const [selectedUser, setSelectedUser] = useState(null)

  // Dados de exemplo - em produção viriam da API
  const users = [
    { id: 1, username: "João", price: 10.5, playerScore: 8.7 },
    { id: 2, username: "Maria", price: 12.3, playerScore: 9.2 },
    { id: 3, username: "Pedro", price: 8.7, playerScore: 7.5 },
    { id: 4, username: "Ana", price: 11.0, playerScore: 8.9 },
    { id: 5, username: "Carlos", price: 9.8, playerScore: 8.1 },
    { id: 6, username: "Luiza", price: 13.5, playerScore: 9.7 },
    { id: 7, username: "Rafael", price: 7.9, playerScore: 6.8 },
    { id: 8, username: "Juliana", price: 10.2, playerScore: 8.5 },
  ]

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  return (
    <Page>
      <h1>Mercado</h1>
      <div className="mercado-container fade-in">
        <div className="mercado-layout">
          <div className="user-list-container">
            <h2>Jogadores Disponíveis</h2>
            <UserList users={users} onSelectUser={handleUserSelect} />
          </div>
          <div className="field-container">
            <SoccerField selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Mercado
