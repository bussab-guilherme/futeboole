import React from 'react';
import './MercadoFechado.css';

function MercadoFechado() {
  return (
    <div className="mercado-fechado-container">
      <div className="icon">⚽</div>
      <h1>Mercado Fechado</h1>
      <p>Uma partida está em andamento no momento.</p>
      <p>Por favor, volte mais tarde para negociar jogadores.</p>
    </div>
  );
}

export default MercadoFechado;