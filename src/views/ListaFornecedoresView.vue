<template>
    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <h1 class="text-h4">Fornecedores</h1>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirDialogFornecedor">
                    Novo Fornecedor
                </v-btn>
            </v-col>
        </v-row>

        <!-- Tabela de Fornecedores -->
        <v-card>
            <v-data-table :headers="headers" :items="fornecedores" :loading="carregando" :items-per-page="10">
                <template v-slot:item.acoes="{ item }">
                    <v-btn icon="mdi-pencil" size="small" color="primary" class="mr-1"
                        @click="editarFornecedor(item)" />
                    <v-btn icon="mdi-delete" size="small" color="error" @click="confirmarExclusao(item)" />
                </template>
            </v-data-table>
        </v-card>

        <!-- Dialog para Novo/Editar Fornecedor -->
        <v-dialog v-model="dialogFornecedor" max-width="600">
            <v-card>
                <v-card-title>{{ fornecedorEmEdicao.id ? 'Editar' : 'Novo' }} Fornecedor</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="formValido">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="fornecedorEmEdicao.nome" label="Nome" required
                                    :rules="[(v: string) => !!v || 'Nome é obrigatório']" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="fornecedorEmEdicao.cnpj" label="CNPJ" required :rules="[
                                    (v: string) => !!v || 'CNPJ é obrigatório',
                                    (v: string) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v) || 'CNPJ inválido'
                                ]" v-mask="'##.###.###/####-##'" placeholder="00.000.000/0000-00" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="fornecedorEmEdicao.email" label="E-mail" required :rules="[
                                    (v: string) => !!v || 'E-mail é obrigatório',
                                    (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'
                                ]" type="email" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="fornecedorEmEdicao.telefone" label="Telefone" required
                                    :rules="[(v: string) => !!v || 'Telefone é obrigatório']" v-mask="'(##) #####-####'"
                                    placeholder="(00) 00000-0000" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" @click="dialogFornecedor = false">Cancelar</v-btn>
                    <v-btn color="primary" :loading="salvando" @click="salvarFornecedor">
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
                    Deseja realmente excluir o fornecedor "{{ fornecedorParaExcluir?.nome }}"?
                    <v-alert v-if="fornecedorParaExcluir" type="warning" class="mt-3" density="compact">
                        Esta ação não poderá ser desfeita e pode afetar produtos vinculados a este fornecedor.
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="dialogExclusao = false">Cancelar</v-btn>
                    <v-btn color="error" :loading="excluindo" @click="excluirFornecedor">
                        Excluir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mask } from 'vue-the-mask'
import { fornecedorService, type Fornecedor } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'

interface Fornecedor {
    id?: number
    nome: string
    cnpj: string
    email: string
    telefone: string
}

const headers = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'CNPJ', key: 'cnpj', sortable: true },
    { title: 'E-mail', key: 'email', sortable: true },
    { title: 'Telefone', key: 'telefone', sortable: true },
    { title: 'Ações', key: 'acoes', sortable: false }
]

const fornecedores = ref<Fornecedor[]>([])
const carregando = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const dialogFornecedor = ref(false)
const dialogExclusao = ref(false)
const formValido = ref(false)

const fornecedorEmEdicao = ref<Fornecedor>({
    nome: '',
    cnpj: '',
    email: '',
    telefone: ''
})

const fornecedorParaExcluir = ref<Fornecedor | null>(null)

const { mostrarSucesso, mostrarErro } = useSnackbar()

const abrirDialogFornecedor = () => {
    fornecedorEmEdicao.value = {
        nome: '',
        cnpj: '',
        email: '',
        telefone: ''
    }
    dialogFornecedor.value = true
}

const editarFornecedor = (fornecedor: Fornecedor) => {
    fornecedorEmEdicao.value = { ...fornecedor }
    dialogFornecedor.value = true
}

const confirmarExclusao = (fornecedor: Fornecedor) => {
    fornecedorParaExcluir.value = fornecedor
    dialogExclusao.value = true
}

const carregarDados = async () => {
    try {
        carregando.value = true
        fornecedores.value = await fornecedorService.listar()
        mostrarSucesso('Fornecedores carregados com sucesso')
    } catch (erro) {
        console.error('Erro ao carregar fornecedores:', erro)
        mostrarErro('Erro ao carregar fornecedores')
    } finally {
        carregando.value = false
    }
}

const salvarFornecedor = async () => {
    try {
        salvando.value = true
        await fornecedorService.salvar(fornecedorEmEdicao.value)
        dialogFornecedor.value = false
        await carregarDados()
        mostrarSucesso('Fornecedor salvo com sucesso')
    } catch (erro) {
        console.error('Erro ao salvar fornecedor:', erro)
        mostrarErro('Erro ao salvar fornecedor')
    } finally {
        salvando.value = false
    }
}

const excluirFornecedor = async () => {
    if (!fornecedorParaExcluir.value?.id) return

    try {
        excluindo.value = true
        await fornecedorService.excluir(fornecedorParaExcluir.value.id)
        dialogExclusao.value = false
        await carregarDados()
        mostrarSucesso('Fornecedor excluído com sucesso')
    } catch (erro) {
        console.error('Erro ao excluir fornecedor:', erro)
        mostrarErro('Erro ao excluir fornecedor')
    } finally {
        excluindo.value = false
    }
}

onMounted(async () => {
    await carregarDados()
})
</script>

<script lang="ts">
export default {
    directives: {
        mask
    }
}
</script>
