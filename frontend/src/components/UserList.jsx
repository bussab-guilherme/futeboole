"use client"

import "./UserList.css"

function UserList({ users, onSelectUser, selectedUser }) {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <span>Nome</span>
        <span>Preço</span>
        <span>Pontos</span>
      </div>
      <div className="user-list-items">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-list-item ${selectedUser && selectedUser.id === user.id ? "selected" : ""}`}
            onClick={() => onSelectUser(user)}
          >
            <span className="user-name">{user.username}</span>
            <span className="user-price">${user.price.toFixed(2)}</span>
            <span className="user-score">{user.playerScore.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserList
