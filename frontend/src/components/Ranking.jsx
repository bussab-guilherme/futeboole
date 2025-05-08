import ListElement from "./ListElement"
import Block from "../containers/Block"
import "./Ranking.css"
import Page from "../containers/Page"

function Ranking() {
  // Dados de exemplo - em produção viriam da API
  const users = [
    { id: 1, name: "João", pontos: 120, acertos: 18 },
    { id: 2, name: "Maria", pontos: 115, acertos: 16 },
    { id: 3, name: "Pedro", pontos: 98, acertos: 14 },
    { id: 4, name: "Ana", pontos: 95, acertos: 13 },
    { id: 5, name: "Carlos", pontos: 92, acertos: 12 },
    { id: 6, name: "Luiza", pontos: 88, acertos: 11 },
    { id: 7, name: "Rafael", pontos: 85, acertos: 10 },
    { id: 8, name: "Juliana", pontos: 82, acertos: 9 },
    { id: 9, name: "Bruno", pontos: 78, acertos: 8 },
    { id: 10, name: "Fernanda", pontos: 75, acertos: 7 },
  ]

  // Ordenar usuários por pontos (do maior para o menor)
  const sortedUsers = [...users].sort((a, b) => b.pontos - a.pontos)

  return (
    <Page>
      <h1>Ranking</h1>
      <Block style={{ maxHeight: "600px", overflowY: "auto", width: "100%", maxWidth: "800px" }}>
        <div className="ranking-container fade-in">
          <div className="ranking-header">
            <span>Posição</span>
            <span>Nome</span>
            <span>Pontos</span>
            <span>Acertos</span>
          </div>
          <div className="ranking-list">
            {sortedUsers.map((user, index) => (
              <ListElement
                key={`${user.id}-${index}`}
                name={user.name}
                pontos={user.pontos}
                acertos={user.acertos}
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
