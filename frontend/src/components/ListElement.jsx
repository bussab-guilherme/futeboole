import "./ListElement.css"

function ListElement({ name, position, pontos, acertos }) {
  return (
    <div className="list-element">
      <span className="position">{position}</span>
      <span className="name">{name}</span>
      <span className="points">{pontos}</span>
      <span className="hits">{acertos}</span>
    </div>
  )
}

export default ListElement
