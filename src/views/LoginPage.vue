<script setup lang="ts">
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
  toastController,
  IonPage,
} from "@ionic/vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const erro = ref("");

const handleLogin = async () => {
  erro.value = "";

  if (!email.value || !password.value) {
    erro.value = "Por favor, preencha todos os campos";
    return;
  }

  const sucesso = await login(email.value, password.value);

  if (sucesso) {
    const toast = await toastController.create({
      message: "Login realizado com sucesso!",
      duration: 800,
      position: "bottom",
      color: "success",
    });
    await toast.present();
    router.replace("/tabs");
  } else {
    erro.value = "E-mail ou senha incorretos";
    const toast = await toastController.create({
      message: "E-mail ou senha incorretos",
      duration: 1000,
      position: "bottom",
      color: "danger",
    });
    await toast.present();
  }
};

const irParaCadastro = async () => {
  await router.push("/register");
};

const irParaResetSenha = async () => {
  await router.push("/reset");
};
</script>

<template>
  <ion-page>
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
            <ion-button
              fill="clear"
              size="small"
              @click="irParaCadastro"
              class="ion-no-padding"
            >
              Cadastre-se
            </ion-button>
          </p>
          <p>
            <ion-button
              fill="clear"
              size="small"
              @click="irParaResetSenha"
              class="ion-no-padding"
            >
              Esqueceu a senha?
            </ion-button>
          </p>
        </ion-text>
      </ion-card-content>
    </ion-card>
  </ion-page>
</template>
