import "./ListElement.css"

function ListElement({ name, pontos, position }) {
  return (
    <div className="list-element">
      <span className="position">{position}</span>
      <span className="name">{name}</span>
      <span className="points">{pontos}</span>
    </div>
  )
}

export default ListElement
