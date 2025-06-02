<template>
    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <h1 class="text-h4">Tipos de Produto</h1>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirDialogTipoProduto">
                    Novo Tipo de Produto
                </v-btn>
            </v-col>
        </v-row>

        <!-- Tabela de Tipos de Produto -->
        <v-card>
            <v-data-table :headers="headers" :items="tiposProduto" :loading="carregando" :items-per-page="10">
                <template v-slot:item.acoes="{ item }">
                    <v-btn icon="mdi-pencil" size="small" color="primary" class="mr-1"
                        @click="editarTipoProduto(item)" />
                    <v-btn icon="mdi-delete" size="small" color="error" @click="confirmarExclusao(item)" />
                </template>
            </v-data-table>
        </v-card>

        <!-- Dialog para Novo/Editar Tipo de Produto -->
        <v-dialog v-model="dialogTipoProduto" max-width="500">
            <v-card>
                <v-card-title>{{ tipoProdutoEmEdicao.id ? 'Editar' : 'Novo' }} Tipo de Produto</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="formValido">
                        <v-text-field v-model="tipoProdutoEmEdicao.nome" label="Nome" required
                            :rules="[v => !!v || 'Nome é obrigatório']" />
                        <v-textarea v-model="tipoProdutoEmEdicao.descricao" label="Descrição" required
                            :rules="[v => !!v || 'Descrição é obrigatória']" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" @click="dialogTipoProduto = false">Cancelar</v-btn>
                    <v-btn color="primary" :loading="salvando" @click="salvarTipoProduto">
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
                    Deseja realmente excluir o tipo de produto "{{ tipoParaExcluir?.nome }}"?
                    <v-alert v-if="tipoParaExcluir" type="warning" class="mt-3" density="compact">
                        Esta ação não poderá ser desfeita e pode afetar produtos vinculados a este tipo.
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="dialogExclusao = false">Cancelar</v-btn>
                    <v-btn color="error" :loading="excluindo" @click="excluirTipoProduto">
                        Excluir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { tipoProdutoService, type TipoProduto } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'

interface TipoProduto {
    id?: number
    nome: string
    descricao: string
}

const headers = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'Descrição', key: 'descricao', sortable: true },
    { title: 'Ações', key: 'acoes', sortable: false }
]

const tiposProduto = ref<TipoProduto[]>([])
const carregando = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const dialogTipoProduto = ref(false)
const dialogExclusao = ref(false)
const formValido = ref(false)

const tipoProdutoEmEdicao = ref<TipoProduto>({
    nome: '',
    descricao: ''
})

const tipoParaExcluir = ref<TipoProduto | null>(null)

const { mostrarSucesso, mostrarErro } = useSnackbar()

const abrirDialogTipoProduto = () => {
    tipoProdutoEmEdicao.value = {
        nome: '',
        descricao: ''
    }
    dialogTipoProduto.value = true
}

const editarTipoProduto = (tipo: TipoProduto) => {
    tipoProdutoEmEdicao.value = { ...tipo }
    dialogTipoProduto.value = true
}

const confirmarExclusao = (tipo: TipoProduto) => {
    tipoParaExcluir.value = tipo
    dialogExclusao.value = true
}

const carregarDados = async () => {
    try {
        carregando.value = true
        tiposProduto.value = await tipoProdutoService.listar()
        mostrarSucesso('Tipos de produto carregados com sucesso')
    } catch (erro) {
        console.error('Erro ao carregar tipos de produto:', erro)
        mostrarErro('Erro ao carregar tipos de produto')
    } finally {
        carregando.value = false
    }
}

const salvarTipoProduto = async () => {
    try {
        salvando.value = true
        await tipoProdutoService.salvar(tipoProdutoEmEdicao.value)
        dialogTipoProduto.value = false
        await carregarDados()
        mostrarSucesso('Tipo de produto salvo com sucesso')
    } catch (erro) {
        console.error('Erro ao salvar tipo de produto:', erro)
        mostrarErro('Erro ao salvar tipo de produto')
    } finally {
        salvando.value = false
    }
}

const excluirTipoProduto = async () => {
    if (!tipoParaExcluir.value?.id) return

    try {
        excluindo.value = true
        await tipoProdutoService.excluir(tipoParaExcluir.value.id)
        dialogExclusao.value = false
        await carregarDados()
        mostrarSucesso('Tipo de produto excluído com sucesso')
    } catch (erro) {
        console.error('Erro ao excluir tipo de produto:', erro)
        mostrarErro('Erro ao excluir tipo de produto')
    } finally {
        excluindo.value = false
    }
}

onMounted(async () => {
    await carregarDados()
})
</script>
