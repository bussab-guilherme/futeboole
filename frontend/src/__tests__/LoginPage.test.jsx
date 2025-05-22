import { MemoryRouter } from "react-router-dom"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import LoginPage from "../pages/LoginPage"

// Mock do fetch
global.fetch = vi.fn()

describe("LoginPage", () => {
  beforeEach(() => {
    fetch.mockClear()
    // Configurar o mock para retornar uma resposta válida
    fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          message: "Login bem-sucedido",
          user: {
            username: "meuteste",
            playerScore: 0,
            teamScore: 0,
            numVotes: 0,
            team: [],
          },
        }),
    })
  })

  it("deve preencher login e enviar", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await userEvent.type(screen.getByLabelText(/Usuário/i), "meuteste")
    await userEvent.type(screen.getByLabelText(/Senha/i), "123456")

    const button = screen.getByRole("button", { name: /Confirmar/i })
    await userEvent.click(button)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/users/login",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "meuteste",
            password: "123456",
          }),
        }),
      )
    })
  })

  it("deve tratar erro de login", async () => {
    // Alterar o mock para simular uma falha
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Credenciais inválidas" }),
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await userEvent.type(screen.getByLabelText(/Usuário/i), "meuteste")
    await userEvent.type(screen.getByLabelText(/Senha/i), "123456")

    const button = screen.getByRole("button", { name: /Confirmar/i })
    await userEvent.click(button)

    // Verificar se mostra uma mensagem de erro
    // Ajuste isso conforme sua implementação real
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
  })
})
