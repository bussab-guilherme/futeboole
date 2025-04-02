import { useState } from 'react'
import './App.css'

function App() {

  const sendDataToBackend = async () => {
    const jsonData = {
      nusp: '14602251',
      username: 'Pedro Bussab',
      password: 'aaaaaa',
    };

    /*
      O back ta configurado para receber os json para criacao de usuarios no '/api/users'
      o conteudo usuario é NUSP, nome e senha.
    */
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Resposta do backend:', result);
      } else {
        console.error('Erro do backend:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend:', error);
    }
  };

  return (
    <div>
      <h1>Teste de Conexão entre Frontend e Backend</h1>
      <button onClick={sendDataToBackend}>Send Data</button>
    </div>
  );
}

export default App
