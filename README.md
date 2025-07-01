# ⚽ Futebooleana

## Sobre o Projeto

Este projeto é um jogo de fantasy football interativo, desenvolvido como parte da disciplina **MAC0350 - Introdução ao Desenvolvimento de Sistemas de Software**, ministrada pelo professor **Paulo Meirelles** na **Universidade de São Paulo (USP)**.

O Futeboole simula uma liga de futebol entre amigos, onde cada participante (usuário) pode montar seu próprio time, escalar jogadores (que também são usuários), avaliar a performance deles após as partidas e competir em um ranking geral. O sistema inclui um mercado de jogadores com preços dinâmicos e um painel de administração para gerenciar as rodadas do jogo.

## ✨ Funcionalidades Principais

* **Autenticação de Usuários**: Sistema completo de registro e login.
* **Mercado de Jogadores**: Compre e venda jogadores para montar seu time, respeitando seu orçamento.
* **Gestão de Time**: Escale seus jogadores em um campo de futebol interativo.
* **Sistema de Votação**: Após as partidas, avalie a performance dos outros jogadores.
* **Ranking Dinâmico**: Acompanhe sua pontuação e a de outros times em um ranking geral.
* **Relatórios de Partida**: Visualize as pontuações finais dos jogadores após o fim de uma rodada.
* **Painel de Admin**: Ferramentas exclusivas para o administrador iniciar e finalizar rodadas, atualizando pontuações e preços.

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: `frontend` e `backend`.

| Área      | Tecnologia                                                                                                  |
| :-------- | :---------------------------------------------------------------------------------------------------------- |
| **Backend** | **Kotlin** com **Ktor** para a API REST, **Exposed** para acesso ao banco de dados e **Gradle** para build. |
| **Frontend**| **React.js** (com Hooks e Context API) e **Vite** como ferramenta de build.                               |
| **Banco de Dados** | **PostgreSQL**, orquestrado com **Docker Compose**.                                                         |
| **Testes** | **JUnit** para os testes do backend.                                              |

## 🚀 Como Executar o Projeto

Para rodar o projeto localmente, você precisará ter o **Java (JDK 17 ou superior)**, **Node.js** e o **Docker** instalados.

### 1. Iniciar o Banco de Dados

O banco de dados PostgreSQL é gerenciado pelo Docker. Para iniciá-lo, navegue até a pasta `backend` e execute:

```bash
docker-compose up -d
```

Isso iniciará o container do Postgres em segundo plano.

### 2. Iniciar o Backend

Na mesma pasta `backend`, execute o seguinte comando para iniciar o servidor Ktor. Ele estará disponível em `http://localhost:8080`.

**No Linux/macOS:**
```bash
./gradlew run
```

**No Windows:**
```bash
gradlew.bat run
```

### 3. Iniciar o Frontend

Em um **novo terminal**, navegue até a pasta `frontend`, instale as dependências e inicie o servidor de desenvolvimento. Ele estará disponível em `http://localhost:5173`.

```bash
# Navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### ✨ Script Simplificado (Tudo-em-um)

O `package.json` do frontend já contém um script para facilitar o processo. Estando na pasta `frontend`, você pode rodar o backend e o frontend simultaneamente com um único comando:

**No Linux/macOS:**
```bash
npm run dev:linux
```

**No Windows:**
```bash
npm run dev:win
```

## 📂 Estrutura do Projeto

```
/
├── backend/        # Contém todo o código-fonte do servidor em Kotlin/Ktor
│   ├── build/
│   ├── gradle/
│   ├── src/
│   ├── build.gradle.kts
│   └── docker-compose.yml
│
└── frontend/       # Contém todo o código-fonte da interface em React
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── contexts/
    │   ├── containers/
    │   └── pages/
    ├── package.json
    └── vite.config.js
```
