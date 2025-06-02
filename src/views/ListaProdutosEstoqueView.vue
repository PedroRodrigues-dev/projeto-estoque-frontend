<template>
    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <h1 class="text-h4">Produtos em Estoque por Tipo</h1>
            </v-col>
        </v-row>

        <!-- Seletor de Tipo de Produto -->
        <v-row class="mb-4">
            <v-col cols="12" md="4">
                <v-select v-model="tipoSelecionado" :items="tiposProduto" item-title="nome" item-value="id"
                    label="Selecione o Tipo de Produto" @update:model-value="carregarProdutosPorTipo" />
            </v-col>
        </v-row>

        <!-- Tabela de Produtos -->
        <v-card>
            <v-data-table :headers="headers" :items="produtos" :loading="carregando" :items-per-page="10">
                <template v-slot:item.quantidadeDisponivel="{ item }">
                    <v-chip :color="getCorEstoque(item.quantidadeDisponivel)"
                        :text="item.quantidadeDisponivel.toString()" />
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { produtoService, tipoProdutoService, type ProdutoEstoqueDTO, type TipoProduto } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'

const { mostrarSucesso, mostrarErro } = useSnackbar()

const headers = [
    { title: 'Código', key: 'codigo', sortable: true },
    { title: 'Descrição', key: 'descricao', sortable: true },
    { title: 'Tipo', key: 'tipoProduto', sortable: true },
    { title: 'Qtd. Saída', key: 'quantidadeSaida', sortable: true },
    { title: 'Qtd. Disponível', key: 'quantidadeDisponivel', sortable: true }
]

const produtos = ref<ProdutoEstoqueDTO[]>([])
const tiposProduto = ref<TipoProduto[]>([])
const tipoSelecionado = ref<number | null>(null)
const carregando = ref(false)

const getCorEstoque = (quantidade: number): string => {
    if (quantidade <= 0) return 'error'
    if (quantidade <= 10) return 'warning'
    return 'success'
}

const carregarTiposProduto = async () => {
    try {
        tiposProduto.value = await tipoProdutoService.listar()
    } catch (erro) {
        console.error('Erro ao carregar tipos de produto:', erro)
        mostrarErro('Erro ao carregar tipos de produto')
    }
}

const carregarProdutosPorTipo = async () => {
    if (!tipoSelecionado.value) {
        produtos.value = []
        return
    }

    try {
        carregando.value = true
        produtos.value = await produtoService.listarPorTipoComEstoque(tipoSelecionado.value)
        mostrarSucesso('Produtos carregados com sucesso')
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro)
        mostrarErro('Erro ao carregar produtos')
        produtos.value = []
    } finally {
        carregando.value = false
    }
}

onMounted(async () => {
    await carregarTiposProduto()
})
</script>
