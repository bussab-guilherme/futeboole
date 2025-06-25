"use client"

import { useState } from "react"
import "./Votacao.css"
import Page from "../containers/Page"
import Block from "../containers/Block"
import Button from "../containers/Button"

function Votacao() {
  // Dados de exemplo - em produção viriam da API
  const [jogadores, setJogadores] = useState([
    { id: 1, nome: "João Silva", posicao: "Atacante", nota: 0, votado: false },
    { id: 2, nome: "Maria Oliveira", posicao: "Meio-campo", nota: 0, votado: false },
    { id: 3, nome: "Pedro Santos", posicao: "Defesa", nota: 0, votado: false },
    { id: 4, nome: "Ana Costa", posicao: "Goleira", nota: 0, votado: false },
    { id: 5, nome: "Carlos Pereira", posicao: "Atacante", nota: 0, votado: false },
    { id: 6, nome: "Luiza Fernandes", posicao: "Meio-campo", nota: 0, votado: false },
    { id: 7, nome: "Rafael Souza", posicao: "Defesa", nota: 0, votado: false },
    { id: 8, nome: "Juliana Lima", posicao: "Atacante", nota: 0, votado: false },
  ])

  const [mensagem, setMensagem] = useState("")

  const alterarNota = (id, valor) => {
    setJogadores(
      jogadores.map((jogador) => {
        if (jogador.id === id) {
          // Garantir que a nota esteja entre 0 e 10
          const novaNota = Math.max(0, Math.min(10, jogador.nota + valor))
          return { ...jogador, nota: novaNota }
        }
        return jogador
      }),
    )
  }

  const confirmarVoto = (id) => {
    setJogadores(
      jogadores.map((jogador) => {
        if (jogador.id === id) {
          return { ...jogador, votado: true }
        }
        return jogador
      }),
    )
    setMensagem(`Voto para ${jogadores.find((j) => j.id === id).nome} registrado com sucesso!`)

    // Em produção, enviaria para o backend
    // Exemplo de como seria:
    // fetch('/api/votos', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ jogadorId: id, nota: jogadores.find(j => j.id === id).nota })
    // })

    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setMensagem("")
    }, 3000)
  }

  return (
    <Page>
      <h1>Votação</h1>
      <Block style={{ width: "100%", maxWidth: "800px" }}>
        <div className="votacao-container fade-in">
          {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

          <div className="votacao-instrucoes">
            <p>Avalie os jogadores com notas de 0 a 10 (incrementos de 0.5)</p>
          </div>

          <div className="jogadores-lista">
            {jogadores.map((jogador) => (
              <div key={jogador.id} className={`jogador-card ${jogador.votado ? "votado" : ""}`}>
                <div className="jogador-info">
                  <h3>{jogador.nome}</h3>
                  <p className="jogador-posicao">{jogador.posicao}</p>
                </div>

                <div className="votacao-controles">
                  <div className="nota-controle">
                    <button
                      className="nota-botao"
                      onClick={() => alterarNota(jogador.id, -0.5)}
                      disabled={jogador.votado}
                    >
                      -
                    </button>

                    <div className="nota-display">{jogador.nota.toFixed(1)}</div>

                    <button
                      className="nota-botao"
                      onClick={() => alterarNota(jogador.id, 0.5)}
                      disabled={jogador.votado}
                    >
                      +
                    </button>
                  </div>

                  <Button
                    onClick={() => confirmarVoto(jogador.id)}
                    className="confirmar-voto"
                    style={{
                      opacity: jogador.votado ? 0.5 : 1,
                      cursor: jogador.votado ? "default" : "pointer",
                    }}
                    disabled={jogador.votado}
                  >
                    {jogador.votado ? "Voto Confirmado" : "Confirmar Voto"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Block>
    </Page>
  )
}

export default Votacao
