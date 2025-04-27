import React from 'react';
import Page from '../containers/Page';
import Block from '../containers/Block';
import Button from '../containers/Button';
import Footer from '../containers/Footer';
import Header from '../containers/PageHeader';
import { useState } from 'react';




function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const sendLogin = async () => {
    console.log("Username: ", username);
    console.log("Password: ", password);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password, playerScore: 0, teamScore: 0, numVotes: 0, team: []}),
      });
      if (response.ok) {
        window.location.href = "/mercado";
      }
    } catch (error) {
      if (error.response.status === 404) {
        alert("Usuário não encontrado");
      } else if (error.response.status === 401) {
        alert("Usuário e senha não batem");
      } else {
        alert("Erro ao fazer login");
      }
    }
  };


  return (
    <Page>
      <Header title="Login" />
      <Block>
        <p>Bem-vindo de volta! Faça login para continuar.</p>
        <p>Se você não tem uma conta, <a href="/register">clique aqui</a> para se registrar.</p>
        <label htmlFor="User">Usuário:  </label>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <label htmlFor="Password">Senha:  </label>  
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Button link="/home" onClick={sendLogin}>Confirmar</Button>
      </Block>
      <Footer />
    </Page>
  );
}

export default LoginPage;