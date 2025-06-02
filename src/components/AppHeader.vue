<template>
  <div>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Sistema de Estoque</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="surface-variant">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-logout" title="Sair" @click="logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="left" temporary>
      <v-list>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/dashboard" />
        <v-list-item prepend-icon="mdi-domain" title="Fornecedores" value="fornecedores" to="/fornecedores" />
        <v-list-item prepend-icon="mdi-widgets" title="Tipos de Produtos" value="tipos-de-produtos"
          to="/tipos-de-produtos" />
        <v-list-item prepend-icon="mdi-package-variant" title="Produtos" value="produtos" to="/produtos" />
        <v-list-item prepend-icon="mdi-package-variant-closed" title="Produtos em Estoque" value="produtos-estoque"
          to="/produtos-estoque" />
        <v-list-item prepend-icon="mdi-transfer" title="Movimentações" value="movimentacoes" to="/movimentacoes" />
        <v-list-item prepend-icon="mdi-account" title="Usuários" value="usuarios" to="/usuarios" />
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const logout = async () => {
  // TODO: Implementar lógica de logout
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
