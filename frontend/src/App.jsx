import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data, setData] = useState(0)

  const getDataFromBackend = async () => {
    try {
      const response = await fetch('/api/generateData');
      const result = await response.text();
      setData(result);
    } catch (error) {
      console.error('Erro ao obter dados do backend:', error);
    }
  };

  return (
    <div>
      <h1>Teste de Conexão entre Frontend e Backend</h1>
      <button onClick={getDataFromBackend}>Gerar Dados</button>
      <p>Resultado: {data}</p>
    </div>
  );
}

export default App
