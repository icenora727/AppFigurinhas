<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title class="text-center text-2xl">Cadastro</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <form @submit.prevent="handleRegister">
        <ion-item>
          <ion-label position="floating">Nome Completo</ion-label>
          <ion-input
            v-model="name"
            type="text"
            required
            placeholder="Seu Nome"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input
            v-model="email"
            required
            placeholder="seu@email.com"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha</ion-label>
          <ion-input
            v-model="password"
            required
            placeholder="••••••"
          ></ion-input>
        </ion-item>

        <ion-text v-if="password.length > 0 && password.length < 6" color="danger" class="ion-padding">
          <p>A senha deve ter no mínimo 6 caracteres</p>
        </ion-text>

        <ion-item>
          <ion-label position="floating">Confirmar Senha</ion-label>
          <ion-input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••"
          ></ion-input>
        </ion-item>

        <ion-text v-if="confirmPassword && password !== confirmPassword" color="danger" class="ion-padding">
          <p>As senhas não conferem</p>
        </ion-text>

        <ion-text v-if="erro" color="danger" class="ion-padding">
          <p>{{ erro }}</p>
        </ion-text>

        <ion-text v-if="sucesso" color="success" class="ion-padding">
          <p>{{ sucesso }}</p>
        </ion-text>

        <ion-button expand="block" type="submit" :disabled="!isFormValid" class="ion-margin-top">
          Cadastrar
        </ion-button>
      </form>

      <ion-text class="ion-text-center ion-margin-top">
        <p>
          Já tem conta?
          <router-link to="/login" class="ion-text-primary">
            Faça login
          </router-link>
        </p>
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
const { cadastrar } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const erro = ref('')
const sucesso = ref('')

const isFormValid = computed(() => {
  return name.value && email.value && password.value && confirmPassword.value && password.value === confirmPassword.value && password.value.length >= 6
})

const handleRegister = async () => {
  erro.value = ''
  sucesso.value = ''

  if (!name.value || !email.value || !password.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    erro.value = 'As senhas não conferem'
    return
  }

  const resultado = cadastrar(name.value, email.value, password.value)

  if (resultado) {
    sucesso.value = 'Cadastro realizado com sucesso! Redirecionando...'
    const toast = await toastController.create({
      message: 'Cadastro realizado com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    setTimeout(() => {
      router.push('/album')
    }, 1500)
  } else {
    erro.value = 'Este e-mail já está cadastrado'
    const toast = await toastController.create({
      message: 'Este e-mail já está cadastrado',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}
</script>