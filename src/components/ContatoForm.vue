<template>
 <IonList>
    <IonItem>
        <IonLabel>Cadastro de Contato</IonLabel>
    </IonItem>

    <IonItem>
        <IonLabel position="stacked">Nome</IonLabel>
        <IonInput v-model="form.nome" required/>
    </IonItem>
    <IonNote color="danger" v-if="errors.nome">{{ errors.nome }}</IonNote>

    <IonItem>
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput v-model="form.email" required/>
    </IonItem>
    <IonNote color="danger" v-if="errors.email">{{ errors.email }}</IonNote>

    <IonItem>
        <IonLabel position="stacked">Telefone</IonLabel>
        <IonInput type="tel" v-model="form.telefone"/>
    </IonItem>

    <IonButton expand="block" type="button" @click="salvarContato">Salvar</IonButton>

    <IonToast :is-open="toast.show" :message="toast.message" duration="2000" @ionDismiss="toast.show = false" />

 </IonList>
</template>

<script setup lang="ts">
import { IonList, IonItem, IonLabel, IonInput, IonButton, IonToast, IonNote} from '@ionic/vue'
import { reactive } from 'vue';
import { addContato } from '@/services/database';

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
    window.dispatchEvent(new CustomEvent('contato-salvo'))
}


</script>