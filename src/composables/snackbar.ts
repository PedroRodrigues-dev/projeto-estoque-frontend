import { ref } from 'vue'

interface SnackbarState {
  mostrar: boolean
  mensagem: string
  cor: string
}

const snackbar = ref<SnackbarState>({
  mostrar: false,
  mensagem: '',
  cor: 'success',
})

export function useSnackbar() {
  const mostrarMensagem = (mensagem: string, cor: string) => {
    snackbar.value = {
      mostrar: true,
      mensagem,
      cor,
    }
  }

  const mostrarSucesso = (mensagem: string) => {
    mostrarMensagem(mensagem, 'success')
  }

  const mostrarErro = (mensagem: string) => {
    mostrarMensagem(mensagem, 'error')
  }

  const mostrarAlerta = (mensagem: string) => {
    mostrarMensagem(mensagem, 'warning')
  }

  const fechar = () => {
    snackbar.value.mostrar = false
  }

  return {
    snackbar,
    mostrarSucesso,
    mostrarErro,
    mostrarAlerta,
    fechar,
  }
}
