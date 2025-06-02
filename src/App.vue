<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useSnackbar } from './composables/snackbar'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')

const { snackbar, fechar } = useSnackbar()
</script>

<template>
  <v-app>
    <template v-if="!isLoginPage">
      <app-header />
    </template>

    <v-main>
      <RouterView />
    </v-main>

    <v-snackbar v-model="snackbar.mostrar" :color="snackbar.cor" :timeout="5000" location="top">
      {{ snackbar.mensagem }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="fechar">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
