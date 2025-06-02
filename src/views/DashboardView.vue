<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-4">Dashboard</h1>
            </v-col>
        </v-row>

        <!-- Cards de Resumo -->
        <v-row>
            <v-col cols="12" md="3">
                <v-card color="primary">
                    <v-card-text class="text-center">
                        <div class="text-h6 text-white">Total de Produtos</div>
                        <div class="text-h4 text-white">{{ totalProdutos }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card color="success">
                    <v-card-text class="text-center">
                        <div class="text-h6 text-white">Total de Vendas</div>
                        <div class="text-h4 text-white">{{ totalVendas }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card color="info">
                    <v-card-text class="text-center">
                        <div class="text-h6 text-white">Lucro Total</div>
                        <div class="text-h4 text-white">{{ formatarMoeda(lucroTotal) }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card color="warning">
                    <v-card-text class="text-center">
                        <div class="text-h6 text-white">Média de Lucro</div>
                        <div class="text-h4 text-white">{{ formatarMoeda(mediaLucro) }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Tabela de Lucros -->
        <v-row class="mt-4">
            <v-col cols="12">
                <v-card>
                    <v-card-title class="text-h5">
                        Análise de Lucros por Produto
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="produtos" :loading="carregando" :items-per-page="10">
                            <template v-slot:item.valorFornecedor="{ item }">
                                {{ formatarMoeda(item.valorFornecedor) }}
                            </template>

                            <template v-slot:item.valorVenda="{ item }">
                                {{ formatarMoeda(item.valorVenda) }}
                            </template>

                            <template v-slot:item.lucroUnitario="{ item }">
                                <v-chip :color="item.lucroUnitario > 0 ? 'success' : 'error'"
                                    :text="formatarMoeda(item.lucroUnitario)" />
                            </template>

                            <template v-slot:item.lucroTotal="{ item }">
                                <v-chip :color="item.lucroTotal > 0 ? 'success' : 'error'"
                                    :text="formatarMoeda(item.lucroTotal)" />
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { produtoService, type ProdutoLucro } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'

const { mostrarErro } = useSnackbar()

const headers = [
    { title: 'Código', key: 'codigo', sortable: true },
    { title: 'Descrição', key: 'descricao', sortable: true },
    { title: 'Qtd. Vendida', key: 'quantidadeTotalSaida', sortable: true },
    { title: 'Valor Fornecedor', key: 'valorFornecedor', sortable: true },
    { title: 'Valor Venda', key: 'valorVenda', sortable: true },
    { title: 'Lucro Unitário', key: 'lucroUnitario', sortable: true },
    { title: 'Lucro Total', key: 'lucroTotal', sortable: true },
]

const produtos = ref<ProdutoLucro[]>([])
const carregando = ref(false)

// Cálculos para os cards
const totalProdutos = computed(() => produtos.value.length)
const totalVendas = computed(() => produtos.value.reduce((total, produto) => total + produto.quantidadeTotalSaida, 0))
const lucroTotal = computed(() => produtos.value.reduce((total, produto) => total + produto.lucroTotal, 0))
const mediaLucro = computed(() => lucroTotal.value / (totalProdutos.value || 1))

const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

const carregarDados = async () => {
    try {
        carregando.value = true
        produtos.value = await produtoService.listarLucros()
    } catch (erro) {
        console.error('Erro ao carregar lucros:', erro)
        mostrarErro('Erro ao carregar dados de lucros')
    } finally {
        carregando.value = false
    }
}

onMounted(async () => {
    await carregarDados()
})
</script>
