<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Produtos</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirDialogProduto">
          Novo Produto
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabela de Produtos -->
    <v-card>
      <v-data-table :headers="headers" :items="produtos" :loading="carregando" :items-per-page="10">
        <template v-slot:item.tipo="{ item }">
          {{ item.tipoProduto?.nome }}
        </template>

        <template v-slot:item.fornecedor="{ item }">
          {{ item.fornecedor?.nome }}
        </template>

        <template v-slot:item.valorFornecedor="{ item }">
          {{ formatarMoeda(item.valorFornecedor) }}
        </template>

        <template v-slot:item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'success' : 'error'" :text="item.ativo ? 'Ativo' : 'Inativo'" />
        </template>

        <template v-slot:item.acoes="{ item }">
          <v-btn icon="mdi-pencil" size="small" color="primary" class="mr-1" @click="editarProduto(item)" />
          <v-btn icon="mdi-delete" size="small" color="error" @click="confirmarExclusao(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog para Novo/Editar Produto -->
    <v-dialog v-model="dialogProduto" max-width="600">
      <v-card>
        <v-card-title>{{ produtoEmEdicao.id ? 'Editar' : 'Novo' }} Produto</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="produtoEmEdicao.codigo" label="Código" required
                  :rules="[(v: string) => !!v || 'Código é obrigatório']" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="produtoEmEdicao.quantidadeEstoque" type="number" min="0"
                  label="Quantidade em Estoque" required :rules="[
                    (v: number) => v !== undefined || 'Quantidade é obrigatória',
                    (v: number) => v >= 0 || 'Quantidade deve ser maior ou igual a zero'
                  ]" />
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="produtoEmEdicao.descricao" label="Descrição" required
                  :rules="[(v: string) => !!v || 'Descrição é obrigatória']" rows="3" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="produtoEmEdicao.tipoProdutoId" :items="tiposProduto" item-title="nome"
                  item-value="id" label="Tipo de Produto" required
                  :rules="[(v: number) => !!v || 'Tipo é obrigatório']" />
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="produtoEmEdicao.fornecedorId" :items="fornecedores" item-title="nome" item-value="id"
                  label="Fornecedor" required :rules="[(v: number) => !!v || 'Fornecedor é obrigatório']" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="produtoEmEdicao.valorFornecedor" label="Valor Fornecedor" prefix="R$"
                  type="number" step="0.01" required :rules="[
                    (v: number) => v !== undefined || 'Valor é obrigatório',
                    (v: number) => v >= 0 || 'Valor deve ser maior ou igual a zero'
                  ]" />
              </v-col>

              <v-col cols="12" md="6">
                <v-switch v-model="produtoEmEdicao.ativo" label="Produto Ativo" color="success" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="dialogProduto = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="salvando" @click="salvarProduto">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="dialogExclusao" max-width="400">
      <v-card>
        <v-card-title>Confirmar Exclusão</v-card-title>
        <v-card-text>
          Deseja realmente excluir o produto "{{ produtoParaExcluir?.descricao }}"?
          <v-alert v-if="produtoParaExcluir" type="warning" class="mt-3" density="compact">
            Esta ação não poderá ser desfeita e pode afetar movimentações vinculadas a este produto.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialogExclusao = false">Cancelar</v-btn>
          <v-btn color="error" :loading="excluindo" @click="excluirProduto">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { produtoService, tipoProdutoService, fornecedorService, type Produto, type TipoProduto, type Fornecedor } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'

const { mostrarSucesso, mostrarErro } = useSnackbar()

const headers = [
  { title: 'Código', key: 'codigo', sortable: true },
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'Tipo', key: 'tipo', sortable: true },
  { title: 'Fornecedor', key: 'fornecedor', sortable: true },
  { title: 'Qtd. Estoque', key: 'quantidadeEstoque', sortable: true },
  { title: 'Valor', key: 'valorFornecedor', sortable: true },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Ações', key: 'acoes', sortable: false }
]

const produtos = ref<Produto[]>([])
const tiposProduto = ref<TipoProduto[]>([])
const fornecedores = ref<Fornecedor[]>([])
const carregando = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const dialogProduto = ref(false)
const dialogExclusao = ref(false)
const formValido = ref(false)

const produtoEmEdicao = ref<Partial<Produto>>({
  codigo: '',
  descricao: '',
  tipoProdutoId: undefined,
  fornecedorId: undefined,
  valorFornecedor: 0,
  quantidadeEstoque: 0,
  ativo: true
})

const produtoParaExcluir = ref<Produto | null>(null)

const formatarMoeda = (valor: number) => {
  return valor?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const abrirDialogProduto = () => {
  produtoEmEdicao.value = {
    codigo: '',
    descricao: '',
    tipoProdutoId: undefined,
    fornecedorId: undefined,
    valorFornecedor: 0,
    quantidadeEstoque: 0,
    ativo: true
  }
  dialogProduto.value = true
}

const editarProduto = (produto: Produto) => {
  produtoEmEdicao.value = { ...produto }
  dialogProduto.value = true
}

const confirmarExclusao = (produto: Produto) => {
  produtoParaExcluir.value = produto
  dialogExclusao.value = true
}

const carregarDados = async () => {
  try {
    carregando.value = true
    produtos.value = await produtoService.listar()
    mostrarSucesso('Produtos carregados com sucesso')
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro)
    mostrarErro('Erro ao carregar produtos')
  } finally {
    carregando.value = false
  }
}

const carregarTiposProduto = async () => {
  try {
    tiposProduto.value = await tipoProdutoService.listar()
  } catch (erro) {
    console.error('Erro ao carregar tipos de produto:', erro)
    mostrarErro('Erro ao carregar tipos de produto')
  }
}

const carregarFornecedores = async () => {
  try {
    fornecedores.value = await fornecedorService.listar()
  } catch (erro) {
    console.error('Erro ao carregar fornecedores:', erro)
    mostrarErro('Erro ao carregar fornecedores')
  }
}

const salvarProduto = async () => {
  try {
    salvando.value = true
    await produtoService.salvar(produtoEmEdicao.value as Produto)
    dialogProduto.value = false
    await carregarDados()
    mostrarSucesso('Produto salvo com sucesso')
  } catch (erro) {
    console.error('Erro ao salvar produto:', erro)
    mostrarErro('Erro ao salvar produto')
  } finally {
    salvando.value = false
  }
}

const excluirProduto = async () => {
  if (!produtoParaExcluir.value?.id) return

  try {
    excluindo.value = true
    await produtoService.excluir(produtoParaExcluir.value.id)
    dialogExclusao.value = false
    await carregarDados()
    mostrarSucesso('Produto excluído com sucesso')
  } catch (erro) {
    console.error('Erro ao excluir produto:', erro)
    mostrarErro('Erro ao excluir produto')
  } finally {
    excluindo.value = false
  }
}

onMounted(async () => {
  await Promise.all([carregarDados(), carregarTiposProduto(), carregarFornecedores()])
})
</script>
