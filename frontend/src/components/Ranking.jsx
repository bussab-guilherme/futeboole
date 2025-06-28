import ListElement from "./ListElement"
import Block from "../containers/Block"
import "./Ranking.css"
import Page from "../containers/Page"
import { useEffect, useState } from "react"

function Ranking() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
  }, [])

  return (
    <Page>
      <h1>Ranking</h1>
      <Block style={{ maxHeight: "600px", overflowY: "auto", width: "100%", maxWidth: "800px" }}>
        <div className="ranking-container fade-in">
          <div className="ranking-header">
            <span>Posição</span>
            <span>Nome</span>
            <span>Pontos</span>
          </div>
          <div className="ranking-list">
            {users.map((user, index) => (
              <ListElement
                key={`${user.id || user.username}-${index}`}
                name={user.username}
                pontos={user.globalScore.toFixed(1)}
                position={index + 1}
              />
            ))}
          </div>
        </div>
      </Block>
    </Page>
  )
}

export default Ranking
