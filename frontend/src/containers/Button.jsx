import React from 'react';
import './Button.css'; // importa o css

function Button({ children, onClick, style = {}, className = '' }) {
  return (
    <button
      className={`button ${className}`} // aplica a classe
      style={style} // ainda permite passar estilo manual se quiser
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
