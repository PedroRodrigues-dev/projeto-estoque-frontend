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

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>
