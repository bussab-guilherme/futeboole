import { MemoryRouter, Routes, Route } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"

describe("HomePage", () => {
  it("deve renderizar título e botões de login e registro", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText("Login")).toBeInTheDocument()
    expect(screen.getByText("Registrar")).toBeInTheDocument()
  })

  it("botão de login leva para página de login", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const loginButton = screen.getByText("Login")
    await userEvent.click(loginButton)

    // Verificar se estamos na página de login
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Confirmar/i })).toBeInTheDocument()
  })

  it("botão de registrar leva para página de registro", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const registerButton = screen.getByText("Registrar")
    await userEvent.click(registerButton)

    // Verificar se estamos na página de registro
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Confirmar/i })).toBeInTheDocument()
  })
})
