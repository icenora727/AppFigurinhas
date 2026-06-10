<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Perfil</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Informações do Usuário</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="handleSalvar">
            <ion-item>
              <ion-label position="floating">Nome Completo</ion-label>
              <ion-input v-model="name" type="text" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">E-mail</ion-label>
              <ion-input v-model="email" type="email" required></ion-input>
            </ion-item>

            <ion-card class="ion-margin-top" color="light">
              <ion-card-content>
                <ion-text>
                  <p><strong>ID:</strong> {{ usuarioAtual?.id }}</p>
                  <p><strong>Membro desde:</strong> Hoje</p>
                </ion-text>
              </ion-card-content>
            </ion-card>

            <ion-text v-if="mensagem" :color="mensagem.tipo === 'sucesso' ? 'success' : 'danger'" class="ion-padding">
              <p>{{ mensagem.texto }}</p>
            </ion-text>

            <ion-button expand="block" type="submit" color="primary" class="ion-margin-top">
              <ion-icon slot="start" :icon="saveIcon"></ion-icon>
              Salvar Alterações
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  toastController
} from '@ionic/vue'
import { save } from 'ionicons/icons'

const { obterUsuarioAtual, atualizarPerfil } = useAuth()

const name = ref('')
const email = ref('')
const usuarioAtual = ref(null)
const mensagem = ref(null)

const saveIcon = save

onMounted(() => {
  const usuario = obterUsuarioAtual()
  if (usuario) {
    usuarioAtual.value = usuario
    name.value = usuario.name
    email.value = usuario.email
  }
})

const handleSalvar = async () => {
  const sucesso = atualizarPerfil(name.value, email.value)

  if (sucesso) {
    mensagem.value = {
      tipo: 'sucesso',
      texto: 'Perfil atualizado!'
    }
    const toast = await toastController.create({
      message: 'Perfil atualizado!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    setTimeout(() => {
      mensagem.value = null
    }, 3000)
  } else {
    mensagem.value = {
      tipo: 'erro',
      texto: 'Erro ao atualizar'
    }
  }
}
</script>