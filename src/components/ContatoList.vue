<template>
    <IonList>
        <template v-if="contatos.length">
            <IonItemSliding v-for="contato in contatos" :key="contato.id">
                <IonItem>
                    <IonLabel>
                        <h2>{{ contato.nome }}</h2>
                        <p>{{ contato.email }}</p>
                        <p>{{ contato.telefone }}</p>
                    </IonLabel>
                </IonItem>

                <IonItemOptions side="end">
                    <IonItemOption color="primary" @click="editarContato(contato)">Editar</IonItemOption>
                    <IonItemOption color="danger" @click="confirmarExclusao(contato)">Excluir</IonItemOption>
                </IonItemOptions>

            </IonItemSliding>
        </template>
        <IonItem v-else>
            <IonLabel>Nenhum contato encontrado.</IonLabel>
        </IonItem>
    </IonList>

    <IonAlert
        :is-open="editAlert.open"
        header="Editar contato"
        :message="editAlert.error"
        :inputs="editInputs"
        :buttons="[
            { text: 'Cancelar', role: 'cancel', handler: closeEditAlert },
            { text: 'Salvar', handler: salvarEdicao }
        ]"
    />

    <IonAlert
        :is-open="editAlert.open"
        header="Excluir contato"
        message="Tem certeza que deseja excluir esse contato?"
        :buttons="[
            { text: 'Cancelar', role: 'cancel', handler: closeDeleteAlert },
            { text: 'Excluir', role: 'destructive', handler: excluirContato }
        ]"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { listContatos, updateContato, deleteContatoById } from '@/services/database';
import { IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/vue';

const contatos = ref<any[]>([])
const editAlert = ref({ open: false, error: '', data: {id: null as number | null, nome: '', email: '', telefone: ''}  })
const deleteAlert = ref({ open: false, contatoId: null as number | null})

const editInputs = computed(() => [
    { name: 'nome', type: 'text', placeholder: 'Nome', value: editAlert.value.data.nome },
    { name: 'email', type: 'text', placeholder: 'Email', value: editAlert.value.data.email },
    { name: 'telefone', type: 'tel', placeholder: 'Telefone', value: editAlert.value.data.telefone },
])

async function load() {
    contatos.value = await listContatos()
}

function handleContatoSalvo() {
    load()
}

function editarContato(contato: any) {
    editAlert.value = {
        open: true,
        error: '',
        data: {
            id: contato.id,
            nome: contato.nome,
            email: contato.email,
            telefone: contato.telefone,
        },
    }
}

function confirmarExclusao(contato: any) {
    deleteAlert.value = { open: true, contatoId: contato.id }
}

function closeEditAlert() {
    editAlert.value.open = false
    editAlert.value.error = ''
}

function closeDeleteAlert() {
    deleteAlert.value.open = false
}

async function salvarEdicao(values:any) {
    if (!editAlert.value.data.id) {
        return
    }

    const nome = values?.nome ?? editAlert.value.data.nome
    const email = values?.email ?? editAlert.value.data.email
    const telefone = values?.telefone ?? editAlert.value.data.telefone

    if (!nome || !email ) {
        editAlert.value.error = 'Nome e email são obrigatórios'
        return false
    }

    editAlert.value.error = ''
    await updateContato(editAlert.value.data.id, nome, email, telefone)
    closeEditAlert()
    load()
    return true
}

async function excluirContato() {
    if (!deleteAlert.value.contatoId) {
        return
    }

    await deleteContatoById(deleteAlert.value.contatoId)
    closeDeleteAlert()
    load()
}

onMounted(() => {
    load()
    window.addEventListener('contato-salvo', handleContatoSalvo)
})

onBeforeUnmount(() => {
    window.removeEventListener('contato-salvo', handleContatoSalvo)
})
</script>