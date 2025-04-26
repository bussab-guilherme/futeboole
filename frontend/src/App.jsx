import { useState } from 'react'
import './App.css'

function App() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const sendUserData = async () => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password, playerScore: 0, teamScore: 0, numVotes: 0, team: []}),
      });
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
      
      } else {
          const errorMessage = await response.text();
          setMessage(`Error: ${response.status}, ${errorMessage}`);
      }
    } catch (error) {
      setMessage("Error sending data");
    }
  };

  const sendLogin = async () => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password, playerScore: 0, teamScore: 0, numVotes: 0, team: []}),
      });
      if (response.ok) {
        const data = await response.text();
        setMessage(data);
      
      } else {
          const errorMessage = await response.text();
          setMessage(`Error: ${response.status}, ${errorMessage}`);
      }
    } catch (error) {
      setMessage("Error sending data");
    }
  };

  const getProfile = async () => {
    const response = await fetch("/api/users/profile", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.text();
      setMessage(data);
    
    } else {
        const errorMessage = await response.text();
        setMessage(`Error: ${response.status}, ${errorMessage}`);
    }
  }
  
  const sendLogout = async () => {
    const response = await fetch("/api/users/logout", {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.text();
      setMessage(data);
    
    } else {
        const errorMessage = await response.text();
        setMessage(`Error: ${response.status}, ${errorMessage}`);
    }
  }

  return (
    <div>
      <h1>Send User Data to Backend</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={username}
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
      <button onClick={sendLogin}>Login</button>
      <button onClick={sendLogout}>Logout</button>
      <button onClick={getProfile}>Profile</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App
