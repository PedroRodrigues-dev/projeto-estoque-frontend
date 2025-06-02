<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h4 mb-4">
            Cadastro
          </v-card-title>

          <v-form ref="form" v-model="formValido" @submit.prevent="registrar">
            <v-text-field v-model="formData.nome" label="Nome" :rules="[rules.required('Nome')]" required
              variant="outlined" class="mb-2" />

            <v-text-field v-model="formData.email" label="Email" type="email"
              :rules="[rules.required('Email'), rules.email()]" required variant="outlined" class="mb-2" />

            <v-text-field v-model="formData.senha" label="Senha" :type="mostrarSenha ? 'text' : 'password'"
              :append-icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'" @click:append="mostrarSenha = !mostrarSenha"
              :rules="[rules.required('Senha'), rules.minLength('Senha', 6)]" required variant="outlined"
              class="mb-4" />

            <v-btn block color="primary" size="large" type="submit" :loading="carregando">
              Cadastrar
            </v-btn>

            <v-btn block variant="text" class="mt-2" :to="{ name: 'login' }">
              Já tem uma conta? Faça login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/snackbar'
import { register } from '@/services/auth'

const router = useRouter()
const { mostrarSucesso, mostrarErro } = useSnackbar()

const formValido = ref(false)
const carregando = ref(false)
const mostrarSenha = ref(false)

const formData = ref({
  nome: '',
  email: '',
  senha: ''
})

const rules = {
  required: (field: string) => (v: string) => !!v || `${field} é obrigatório`,
  email: () => (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (field: string, length: number) => (v: string) =>
    (v && v.length >= length) || `${field} deve ter no mínimo ${length} caracteres`
}

const registrar = async () => {
  try {
    carregando.value = true
    await register(formData.value)
    mostrarSucesso('Cadastro realizado com sucesso')
    router.push({ name: 'login' })
  } catch (erro) {
    console.error('Erro no cadastro:', erro)
    mostrarErro(erro as Error)
  } finally {
    carregando.value = false
  }
}
</script>
