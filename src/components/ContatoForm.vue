<template>

</template>

<script setup lang="ts">
import { IonList, IonItem, IonLabel, IonInput, IonButton, IonToast} from '@ionic/vue'
import { reactive } from 'vue';
import { addContato } from '@/services/database';
import { resolveTripleslashReference } from 'typescript';

const form = reactive({ nome: '', email: '', telefone: ''})
const toast = reactive({ show: false, message: ''})
const errors = reactive({ nome: '', email: ''})

function clearErrors() {
    errors.nome = ''
    errors.email = ''
}

async function salvarContato() {
    clearErrors()

    if (!form.nome || !form.email) {
        if(!form.nome) {
            errors.nome = 'Nome é obrigatório.'
        }
        if(!form.email) {
            errors.email = 'Email é obrigatório.'
        }
        toast.show = true
        toast.message = 'Preencha os campos obrigatórios.'
        return
    }

    await addContato(form.nome, form.email, form.telefone)

    form.nome = ''
    form.email = ''
    form.telefone = ''
    toast.show = true
    toast.message = 'Contato salvo com sucesso.'
    window.dispatchEvent(new CustomEvent('contato-alvo'))
}

</script>