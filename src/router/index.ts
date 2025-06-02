import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/services/auth'
import LoginView from '../views/LoginView.vue'
import ListaTransacoesView from '@/views/ListaTransacoesView.vue'
import ListaFornecedoresView from '@/views/ListaFornecedoresView.vue'
import ListaProdutosView from '@/views/ListaProdutosView.vue'
import ListaProdutosEstoqueView from '@/views/ListaProdutosEstoqueView.vue'
import ListaTiposProdutoView from '@/views/ListaTiposProdutoView.vue'
import ListaUsuariosView from '@/views/ListaUsuariosView.vue'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/movimentacoes',
      name: 'movimentacoes',
      component: ListaTransacoesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: ListaUsuariosView,
      meta: { requiresAuth: true },
    },
    {
      path: '/fornecedores',
      name: 'fornecedores',
      component: ListaFornecedoresView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tipos-de-produtos',
      name: 'tipos-de-produtos',
      component: ListaTiposProdutoView,
      meta: { requiresAuth: true },
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: ListaProdutosView,
      meta: { requiresAuth: true },
    },
    {
      path: '/produtos-estoque',
      name: 'produtos-estoque',
      component: ListaProdutosEstoqueView,
      meta: { requiresAuth: true },
    },
  ],
})

// Guarda de navegação global
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getToken()
  const requiresAuth = to.meta.requiresAuth !== false // todas as rotas requerem autenticação por padrão

  // Se o usuário está tentando acessar o login enquanto está autenticado
  if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  // Se a rota requer autenticação e o usuário não está autenticado
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router
