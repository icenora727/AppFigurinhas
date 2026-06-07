<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title class="text-center text-2xl">Login</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <form @submit.prevent="handleLogin">
        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha</ion-label>
          <ion-input
            v-model="password"
            type="password"
            required
            placeholder="••••••"
          ></ion-input>
        </ion-item>

        <ion-text v-if="erro" color="danger" class="ion-padding">
          <p>{{ erro }}</p>
        </ion-text>

        <ion-button expand="block" type="submit" class="ion-margin-top">
          Entrar
        </ion-button>
      </form>

      <ion-text class="ion-text-center ion-margin-top">
        <p>
          Não tem conta?
          <router-link to="/register" class="ion-text-primary">
            Cadastre-se
          </router-link>
        </p>
        <p>
          <router-link to="/reset-password" class="ion-text-primary">
            Esqueceu a senha?
          </router-link>
        </p>
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
  toastController
} from '@ionic/vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const erro = ref('')

const handleLogin = async () => {
  erro.value = ''

  if (!email.value || !password.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  const sucesso = login(email.value, password.value)

  if (sucesso) {
    const toast = await toastController.create({
      message: 'Login realizado com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    router.push('/album')
  } else {
    erro.value = 'E-mail ou senha incorretos'
    const toast = await toastController.create({
      message: 'E-mail ou senha incorretos',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}
</script>