import { getToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface ErrorResponse {
  message: string
}

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

const handleErrorResponse = async (response: Response, defaultMessage: string): Promise<never> => {
  try {
    const data = await response.json()
    throw new Error((data as ErrorResponse).message || defaultMessage)
  } catch (e) {
    if (e instanceof Error) throw e
    throw new Error(defaultMessage)
  }
}

export interface Fornecedor {
  id?: number
  nome: string
  cnpj: string
  email: string
  telefone: string
}

export interface Produto {
  id?: number
  codigo: string
  descricao: string
  tipoProdutoId: number
  fornecedorId: number
  valorFornecedor: number
  quantidadeEstoque: number
  ativo: boolean
  tipoProduto?: TipoProduto
  fornecedor?: Fornecedor
}

export interface ProdutoEstoqueDTO {
  id: number
  codigo: string
  descricao: string
  tipoProduto: string
  quantidadeSaida: number
  quantidadeDisponivel: number
}

export interface TipoProduto {
  id?: number
  nome: string
  descricao: string
}

export interface Usuario {
  id?: number
  nome: string
  email: string
  senha?: string
  papel: string
}

export interface MovimentoEstoque {
  id?: number
  produtoId: number
  tipoMovimentacao: 'ENTRADA' | 'SAIDA'
  quantidadeMovimentada: number
  valorVenda: number
  dataMovimentacao: string
  produto?: Produto
}

export interface ProdutoLucro {
  id: number
  codigo: string
  descricao: string
  quantidadeTotalSaida: number
  valorFornecedor: number
  valorVenda: number
  lucroUnitario: number
  lucroTotal: number
}

// Serviço de Fornecedores
export const fornecedorService = {
  listar: async (): Promise<Fornecedor[]> => {
    const response = await fetch(`${API_URL}/api/fornecedores`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar fornecedores')
    return response.json()
  },

  salvar: async (fornecedor: Fornecedor): Promise<Fornecedor> => {
    const response = await fetch(
      `${API_URL}/api/fornecedores${fornecedor.id ? `/${fornecedor.id}` : ''}`,
      {
        method: fornecedor.id ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(fornecedor),
      },
    )
    if (!response.ok) await handleErrorResponse(response, 'Erro ao salvar fornecedor')
    return response.json()
  },

  excluir: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/fornecedores/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao excluir fornecedor')
  },
}

// Serviço de Produtos
export const produtoService = {
  listar: async (): Promise<Produto[]> => {
    const response = await fetch(`${API_URL}/api/produtos`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar produtos')
    return response.json()
  },

  listarPorTipoComEstoque: async (tipoId: number): Promise<ProdutoEstoqueDTO[]> => {
    const response = await fetch(`${API_URL}/api/produtos/tipo/${tipoId}/estoque`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar produtos por tipo')
    return response.json()
  },

  listarLucros: async (): Promise<ProdutoLucro[]> => {
    const response = await fetch(`${API_URL}/api/produtos/lucro`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar lucros dos produtos')
    return response.json()
  },

  salvar: async (produto: Produto): Promise<Produto> => {
    const response = await fetch(`${API_URL}/api/produtos${produto.id ? `/${produto.id}` : ''}`, {
      method: produto.id ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(produto),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao salvar produto')
    return response.json()
  },

  excluir: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/produtos/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao excluir produto')
  },
}

// Serviço de Tipos de Produto
export const tipoProdutoService = {
  listar: async (): Promise<TipoProduto[]> => {
    const response = await fetch(`${API_URL}/api/tipos-produto`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar tipos de produto')
    return response.json()
  },

  salvar: async (tipo: TipoProduto): Promise<TipoProduto> => {
    const response = await fetch(`${API_URL}/api/tipos-produto${tipo.id ? `/${tipo.id}` : ''}`, {
      method: tipo.id ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(tipo),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao salvar tipo de produto')
    return response.json()
  },

  excluir: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/tipos-produto/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao excluir tipo de produto')
  },
}

// Serviço de Usuários
export const usuarioService = {
  listar: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_URL}/api/usuarios`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar usuários')
    return response.json()
  },

  salvar: async (usuario: Usuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/api/usuarios${usuario.id ? `/${usuario.id}` : ''}`, {
      method: usuario.id ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(usuario),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao salvar usuário')
    return response.json()
  },

  excluir: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao excluir usuário')
  },
}

// Serviço de Movimentos de Estoque
export const movimentoService = {
  listar: async (): Promise<MovimentoEstoque[]> => {
    const response = await fetch(`${API_URL}/api/movimentos`, {
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao buscar movimentos')
    return response.json()
  },

  salvar: async (movimento: MovimentoEstoque): Promise<MovimentoEstoque> => {
    const response = await fetch(
      `${API_URL}/api/movimentos${movimento.id ? `/${movimento.id}` : ''}`,
      {
        method: movimento.id ? 'PUT' : 'POST',
        headers: headers(),
        body: JSON.stringify(movimento),
      },
    )
    if (!response.ok) await handleErrorResponse(response, 'Erro ao salvar movimento')
    return response.json()
  },

  excluir: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/movimentos/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
    if (!response.ok) await handleErrorResponse(response, 'Erro ao excluir movimento')
  },
}
