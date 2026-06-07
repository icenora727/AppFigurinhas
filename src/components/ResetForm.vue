<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title class="text-center text-2xl">Recuperar Senha</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <form @submit.prevent="handleReset">
        <div v-if="!emailEnviado">
          <ion-item>
            <ion-label position="floating">E-mail</ion-label>
            <ion-input
              v-model="email"
              type="email"
              required
              placeholder="seu@email.com"
            ></ion-input>
          </ion-item>

          <ion-text v-if="erro" color="danger" class="ion-padding">
            <p>{{ erro }}</p>
          </ion-text>

          <ion-button expand="block" type="submit" class="ion-margin-top">
            Enviar Link de Recuperação
          </ion-button>
        </div>

        <div v-else>
          <ion-note color="success" class="ion-padding">
            ✓ E-mail de recuperação enviado para {{ email }}
          </ion-note>

          <ion-item class="ion-margin-top">
            <ion-label position="floating">Nova Senha</ion-label>
            <ion-input
              v-model="newPassword"
              type="password"
              required
              placeholder="••••••"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Confirmar Nova Senha</ion-label>
            <ion-input
              v-model="confirmNewPassword"
              type="password"
              required
              placeholder="••••••"
            ></ion-input>
          </ion-item>

          <ion-text v-if="erroReset" color="danger" class="ion-padding">
            <p>{{ erroReset }}</p>
          </ion-text>

          <ion-button expand="block" @click="confirmarNovaSenha" type="button" color="success" class="ion-margin-top">
            Confirmar Nova Senha
          </ion-button>
        </div>
      </form>

      <ion-text class="ion-text-center ion-margin-top">
        <router-link to="/login" class="ion-text-primary">
          Voltar ao Login
        </router-link>
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonNote,
  toastController,
  alertController
} from '@ionic/vue'

const router = useRouter()
const { resetarSenha } = useAuth()

const email = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const emailEnviado = ref(false)
const erro = ref('')
const erroReset = ref('')

const handleReset = async () => {
  erro.value = ''

  if (!email.value) {
    erro.value = 'Por favor, informe seu e-mail'
    return
  }

  emailEnviado.value = true
  const toast = await toastController.create({
    message: 'E-mail de recuperação enviado!',
    duration: 2000,
    position: 'bottom',
    color: 'success'
  })
  await toast.present()
}

const confirmarNovaSenha = async () => {
  erroReset.value = ''

  if (!newPassword.value || !confirmNewPassword.value) {
    erroReset.value = 'Por favor, preencha todos os campos'
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    erroReset.value = 'As senhas não conferem'
    return
  }

  if (newPassword.value.length < 6) {
    erroReset.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }

  const sucesso = resetarSenha(email.value, newPassword.value)

  if (sucesso) {
    const alert = await alertController.create({
      header: 'Sucesso',
      message: 'Senha redefinida com sucesso!',
      buttons: ['OK']
    })
    await alert.present()
    router.push('/login')
  } else {
    erroReset.value = 'Erro ao redefinir a senha'
  }
}
</script>