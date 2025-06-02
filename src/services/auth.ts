interface AuthRequest {
  email: string
  senha: string
}

interface AuthResponse {
  token: string
}

interface ErrorResponse {
  message: string
}

interface RegisterRequest {
  nome: string
  email: string
  senha: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
  const response = await fetch(API_URL + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error((data as ErrorResponse).message || 'Erro ao realizar login')
  }

  const authResponse = data as AuthResponse
  localStorage.setItem('token', authResponse.token)
  return authResponse
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const logout = (): void => {
  localStorage.removeItem('token')
}

export const register = async (data: RegisterRequest): Promise<void> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao realizar cadastro')
  }
}
