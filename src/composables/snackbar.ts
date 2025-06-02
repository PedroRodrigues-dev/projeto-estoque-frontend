import { ref } from 'vue'

interface SnackbarState {
  show: boolean
  message: string
  color: string
}

const snackbar = ref<SnackbarState>({
  show: false,
  message: '',
  color: 'success',
})

export function useSnackbar() {
  const mostrarSucesso = (message: string) => {
    snackbar.value = {
      show: true,
      message,
      color: 'success',
    }
  }

  const mostrarErro = (error: Error | string) => {
    const message = error instanceof Error ? error.message : error
    snackbar.value = {
      show: true,
      message,
      color: 'error',
    }
  }

  const mostrarAlerta = (mensagem: string) => {
    snackbar.value = {
      show: true,
      message: mensagem,
      color: 'warning',
    }
  }

  const fechar = () => {
    snackbar.value.show = false
  }

  return {
    snackbar,
    mostrarSucesso,
    mostrarErro,
    mostrarAlerta,
    fechar,
  }
}
