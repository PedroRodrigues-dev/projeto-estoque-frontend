<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authService from '@/services/auth'

const router = useRouter()
const formValido = ref(false)
const mostrarSenha = ref(false)
const carregando = ref(false)
const mostrarErro = ref(false)
const mensagemErro = ref('')

const credentials = ref({
  email: '',
  senha: ''
})

const realizarLogin = async () => {
  try {
    carregando.value = true
    await authService.login(credentials.value)
    router.push('/dashboard')
  } catch (erro) {
    mensagemErro.value = erro instanceof Error ? erro.message : 'Erro ao realizar login'
    mostrarErro.value = true
  } finally {
    carregando.value = false
  }
}

const irParaCadastro = () => {
  router.push('/register')
}
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center text-h5 py-4">
            Login
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="formValido" @submit.prevent="realizarLogin">
              <v-text-field v-model="credentials.email" label="E-mail" type="email" required :rules="[
                v => !!v || 'E-mail é obrigatório',
                v => /.+@.+\..+/.test(v) || 'E-mail inválido'
              ]" prepend-inner-icon="mdi-email" variant="outlined" density="comfortable" />

              <v-text-field v-model="credentials.senha" label="Senha" :type="mostrarSenha ? 'text' : 'password'"
                required :rules="[v => !!v || 'Senha é obrigatória']" prepend-inner-icon="mdi-lock"
                :append-inner-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="mostrarSenha = !mostrarSenha" variant="outlined" density="comfortable" />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" size="large" block :loading="carregando" @click="realizarLogin">
              Entrar
            </v-btn>
          </v-card-actions>

          <v-card-text class="text-center">
            <v-btn variant="text" @click="irParaCadastro" block>
              Não tem uma conta? Cadastre-se
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para mensagens de erro -->
    <v-snackbar v-model="mostrarErro" color="error" timeout="5000" location="top">
      {{ mensagemErro }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="mostrarErro = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
