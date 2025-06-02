<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Movimentações de Estoque</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirDialogMovimento">
          Nova Movimentação
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabela de Movimentações -->
    <v-card>
      <v-data-table :headers="headers" :items="movimentos" :loading="carregando" :items-per-page="10">
        <template v-slot:item.tipoMovimentacao="{ item }">
          <v-chip :color="item.tipoMovimentacao === 'ENTRADA' ? 'success' : 'error'">
            {{ item.tipoMovimentacao === 'ENTRADA' ? 'Entrada' : 'Saída' }}
          </v-chip>
        </template>

        <template v-slot:item.dataMovimentacao="{ item }">
          {{ formatarData(item.dataMovimentacao) }}
        </template>

        <template v-slot:item.valorVenda="{ item }">
          {{ formatarMoeda(item.valorVenda) }}
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog para Nova Movimentação -->
    <v-dialog v-model="dialogMovimento" max-width="600">
      <v-card>
        <v-card-title>Nova Movimentação</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="movimentoEmEdicao.produtoId" :items="produtos" item-title="descricao" item-value="id"
                  label="Produto" required :rules="[(v) => !!v || 'Produto é obrigatório']" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="movimentoEmEdicao.tipoMovimentacao" :items="tiposMovimentacao" item-title="title"
                  item-value="value" label="Tipo de Movimentação" required
                  :rules="[(v) => !!v || 'Tipo é obrigatório']" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="movimentoEmEdicao.quantidadeMovimentada" type="number" min="1"
                  label="Quantidade" required :rules="[
                    (v) => !!v || 'Quantidade é obrigatória',
                    (v) => v > 0 || 'Quantidade deve ser maior que zero'
                  ]" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="movimentoEmEdicao.valorVenda" type="number" step="0.01" min="0"
                  label="Valor de Venda" prefix="R$" required :rules="[
                    (v) => v !== undefined || 'Valor é obrigatório',
                    (v) => v >= 0 || 'Valor deve ser maior ou igual a zero'
                  ]" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="dialogMovimento = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="salvando" @click="salvarMovimento">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { movimentoService, produtoService, type MovimentoEstoque, type Produto } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'

const { mostrarSucesso, mostrarErro } = useSnackbar()

const headers = [
  { title: 'Produto', key: 'produto.descricao', sortable: true },
  { title: 'Tipo', key: 'tipoMovimentacao', sortable: true },
  { title: 'Quantidade', key: 'quantidadeMovimentada', sortable: true },
  { title: 'Valor de Venda', key: 'valorVenda', sortable: true },
  { title: 'Data', key: 'dataMovimentacao', sortable: true }
]

const movimentos = ref<MovimentoEstoque[]>([])
const produtos = ref<Produto[]>([])
const carregando = ref(false)
const salvando = ref(false)
const dialogMovimento = ref(false)
const formValido = ref(false)

const tiposMovimentacao = [
  { title: 'Entrada', value: 'ENTRADA' },
  { title: 'Saída', value: 'SAIDA' }
]

const movimentoEmEdicao = ref<Partial<MovimentoEstoque>>({
  tipoMovimentacao: 'ENTRADA',
  quantidadeMovimentada: 1,
  valorVenda: 0
})

const abrirDialogMovimento = () => {
  movimentoEmEdicao.value = {
    tipoMovimentacao: 'ENTRADA',
    quantidadeMovimentada: 1,
    valorVenda: 0
  }
  dialogMovimento.value = true
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleString('pt-BR')
}

const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const carregarDados = async () => {
  try {
    carregando.value = true
    const [movimentosData, produtosData] = await Promise.all([
      movimentoService.listar(),
      produtoService.listar()
    ])
    movimentos.value = movimentosData
    produtos.value = produtosData
    mostrarSucesso('Dados carregados com sucesso')
  } catch (erro) {
    console.error('Erro ao carregar dados:', erro)
    mostrarErro(erro as Error)
  } finally {
    carregando.value = false
  }
}

const salvarMovimento = async () => {
  try {
    salvando.value = true
    const movimento: MovimentoEstoque = {
      ...movimentoEmEdicao.value as MovimentoEstoque,
      dataMovimentacao: new Date().toISOString()
    }
    await movimentoService.salvar(movimento)
    dialogMovimento.value = false
    await carregarDados()
    mostrarSucesso('Movimentação registrada com sucesso')
  } catch (erro) {
    console.error('Erro ao salvar movimentação:', erro)
    mostrarErro(erro as Error)
  } finally {
    salvando.value = false
  }
}

onMounted(async () => {
  await carregarDados()
})
</script>
