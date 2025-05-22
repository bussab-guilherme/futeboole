"use client"

import "./HomePage.css"
import Footer from "../containers/Footer"
import Button from "../containers/Button"

function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo ao Nosso Fantasy Game!</h1>
      </header>
      <div className="home-content">
        <p>Escolha seus amigos, monte sua equipe e ganhe pontos! Seja o melhor!</p>

        <Button onClick={() => (window.location.href = "/login")}>Login</Button>

        <p>Ainda não tem uma conta?</p>

        <Button onClick={() => (window.location.href = "/register")}>Registrar</Button>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
