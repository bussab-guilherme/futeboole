import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MercadoRankingPage from './pages/MercadoRankingPage';
import Header from './containers/Header';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [nusp, setNusp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const sendUserData = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nusp, name, password, score: 0 }),
      });
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
      } else {
        setMessage(`Error: ${response.status}`);
      }
    } catch (error) {
      setMessage("Error sending data");
    }
  };

  return (
    <div>
      <h1>Send User Data to Backend</h1>
      <div>
        <input
          type="text"
          placeholder="NUSP"
          value={nusp}
          onChange={(e) => setNusp(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={sendUserData}>Send Data</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
