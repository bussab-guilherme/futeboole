import React from 'react';
import './VotacaoFechada.css'; // Usaremos um CSS similar ao do mercado fechado

function VotacaoFechada() {
  return (
    <div className="votacao-fechada-container">
      <div className="icon">⏱️</div>
      <h1>Votação Ainda Não Abriu</h1>
      <p>A votação para os jogadores só fica disponível após o término da partida.</p>
      <p>Por favor, aguarde a finalização do jogo e volte em breve!</p>
    </div>
  );
}

export default VotacaoFechada;