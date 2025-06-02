<template>
  <v-card width="400" class="mx-auto" elevation="3">
    <v-card-text class="pa-6">
      <div class="text-center mb-6">
        <h1 class="text-h4 mb-2">Login</h1>
        <p class="text-body-2 text-medium-emphasis">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>

      <form @submit.prevent="emit('submit')">
        <v-alert v-if="errorMessage" type="error" class="mb-4">
          {{ errorMessage }}
        </v-alert>

        <v-text-field v-model="emailModel" label="E-mail" type="email" variant="outlined" density="compact"
          hide-details="auto" required class="mb-4" />

        <v-text-field v-model="passwordModel" label="Senha" :type="showPassword ? 'text' : 'password'"
          variant="outlined" density="compact" hide-details="auto" required class="mb-4">
          <template v-slot:append-inner>
            <v-icon :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click="togglePasswordVisibility" />
          </template>
        </v-text-field>

        <v-btn type="submit" color="primary" size="large" :loading="loading" block>
          <template v-if="!loading">
            Entrar
          </template>
          <template v-else>
            <v-progress-circular indeterminate size="20" width="2" color="white" class="mr-2" />
            Entrando...
          </template>
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  email: string
  password: string
  loading: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  (e: 'update:email', value: string): void
  (e: 'update:password', value: string): void
  (e: 'submit'): void
}>()

const showPassword = ref(false)

const emailModel = computed({
  get: () => props.email,
  set: (value) => emit('update:email', value)
})

const passwordModel = computed({
  get: () => props.password,
  set: (value) => emit('update:password', value)
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
