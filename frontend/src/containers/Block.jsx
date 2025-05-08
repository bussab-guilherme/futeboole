const blockStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
}

function Block({ children, style }) {
  return <div style={{ ...blockStyle, ...style }}>{children}</div>
}

export default Block
