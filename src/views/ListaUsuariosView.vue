<template>
  <v-container>
    <!-- Tabela de Usuários -->
    <v-card>
      <v-data-table :headers="headers" :items="usuarios" :loading="carregando" :items-per-page="10">
        <template v-slot:item.papel="{ item }">
          <v-chip :color="definirCorPerfil(item.papel)" :text="item.papel" />
        </template>

        <template v-slot:item.acoes="{ item }">
          <v-btn icon="mdi-pencil" size="small" color="primary" class="mr-1" @click="editarUsuario(item)" />
          <v-btn icon="mdi-delete" size="small" color="error" @click="confirmarExclusao(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog para Novo/Editar Usuário -->
    <v-dialog v-model="dialogUsuario" max-width="600">
      <v-card>
        <v-card-title>{{ usuarioEmEdicao.id ? 'Editar' : 'Novo' }} Usuário</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValido">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="usuarioEmEdicao.nome" label="Nome" required
                  :rules="[v => !!v || 'Nome é obrigatório']" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="usuarioEmEdicao.email" label="E-mail" type="email" required :rules="[
                  v => !!v || 'E-mail é obrigatório',
                  v => /.+@.+\..+/.test(v) || 'E-mail inválido'
                ]" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="usuarioEmEdicao.papel" :items="perfis" label="Papel" required
                  :rules="[v => !!v || 'Papel é obrigatório']" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="usuarioEmEdicao.senha" label="Senha" type="password" required :rules="[
                  v => !!v || 'Senha é obrigatória',
                  v => v?.length >= 6 || 'A senha deve ter no mínimo 6 caracteres'
                ]" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="confirmacaoSenha" label="Confirmar Senha" type="password" required :rules="[
                  v => !!v || 'Confirmação de senha é obrigatória',
                  v => v === usuarioEmEdicao.senha || 'As senhas não conferem'
                ]" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="dialogUsuario = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="salvando" @click="salvarUsuario">
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
          Deseja realmente excluir o usuário "{{ usuarioParaExcluir?.nome }}"?
          <v-alert v-if="usuarioParaExcluir" type="warning" class="mt-3" density="compact">
            Esta ação não poderá ser desfeita.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialogExclusao = false">Cancelar</v-btn>
          <v-btn color="error" :loading="excluindo" @click="excluirUsuario">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usuarioService, type Usuario } from '@/services/api'
import { useSnackbar } from '@/composables/snackbar'


const perfis = ['ADMIN', 'GERENTE', 'OPERADOR']

const headers = [
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'E-mail', key: 'email', sortable: true },
  { title: 'Papel', key: 'papel', sortable: true },
  { title: 'Ações', key: 'acoes', sortable: false }
]

const usuarios = ref<Usuario[]>([])
const carregando = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const dialogUsuario = ref(false)
const dialogExclusao = ref(false)
const formValido = ref(false)
const confirmacaoSenha = ref('')

const usuarioEmEdicao = ref<Usuario>({
  nome: '',
  email: '',
  senha: '',
  papel: ''
})

const usuarioParaExcluir = ref<Usuario | null>(null)

const { mostrarSucesso, mostrarErro } = useSnackbar()

const definirCorPerfil = (perfil: string) => {
  switch (perfil) {
    case 'ADMIN':
      return 'red'
    case 'COMUM':
      return 'blue'
    default:
      return 'grey'
  }
}

const abrirDialogUsuario = () => {
  usuarioEmEdicao.value = {
    nome: '',
    email: '',
    senha: '',
    papel: ''
  }
  confirmacaoSenha.value = ''
  dialogUsuario.value = true
}

const editarUsuario = (usuario: Usuario) => {
  const { senha, ...dadosUsuario } = usuario
  usuarioEmEdicao.value = { ...dadosUsuario }
  dialogUsuario.value = true
}

const confirmarExclusao = (usuario: Usuario) => {
  usuarioParaExcluir.value = usuario
  dialogExclusao.value = true
}

const carregarDados = async () => {
  try {
    carregando.value = true
    usuarios.value = await usuarioService.listar()
    mostrarSucesso('Usuários carregados com sucesso')
  } catch (erro) {
    console.error('Erro ao carregar usuários:', erro)
    mostrarErro('Erro ao carregar usuários')
  } finally {
    carregando.value = false
  }
}

const salvarUsuario = async () => {
  try {
    salvando.value = true
    await usuarioService.salvar(usuarioEmEdicao.value)
    dialogUsuario.value = false
    await carregarDados()
    mostrarSucesso('Usuário salvo com sucesso')
  } catch (erro) {
    console.error('Erro ao salvar usuário:', erro)
    mostrarErro('Erro ao salvar usuário')
  } finally {
    salvando.value = false
  }
}

const excluirUsuario = async () => {
  if (!usuarioParaExcluir.value?.id) return

  try {
    excluindo.value = true
    await usuarioService.excluir(usuarioParaExcluir.value.id)
    dialogExclusao.value = false
    await carregarDados()
    mostrarSucesso('Usuário excluído com sucesso')
  } catch (erro) {
    console.error('Erro ao excluir usuário:', erro)
    mostrarErro('Erro ao excluir usuário')
  } finally {
    excluindo.value = false
  }
}

onMounted(async () => {
  await carregarDados()
})
</script>
