<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="voltarParaLogin"></ion-button>
        </ion-buttons>
        <ion-title>Recuperar Senha</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Conteúdo -->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Header Colapsável -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Recuperar Senha</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Card de Recuperação -->
      <ion-card class="ion-margin-top">
        <ion-card-header>
          <ion-card-title class="ion-text-center">Recuperar Acesso</ion-card-title>
          <ion-card-subtitle class="ion-text-center">
            Digite seu e-mail para recuperar a senha
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <form @submit.prevent="handleRecuperarSenha">
            <!-- Campo Email -->
            <ion-item>
              <ion-label position="floating">E-mail</ion-label>
              <ion-input
                v-model="email"
                required
                placeholder="seu@email.com"
              ></ion-input>
            </ion-item>

            <!-- Mensagem de Erro -->
            <ion-text v-if="erro" color="danger" class="ion-padding">
              <p>{{ erro }}</p>
            </ion-text>

            <!-- Botão Recuperar -->
            <ion-button expand="block" type="submit" color="primary" class="ion-margin-top">
              <ion-icon slot="start" :icon="searchIcon"></ion-icon>
              Buscar Senha
            </ion-button>
          </form>

          <!-- Link para voltar -->
          <ion-text class="ion-text-center ion-margin-top">
            <p>
              Lembrou a senha?
              <ion-button fill="clear" size="small" @click="irParaLogin" class="ion-no-padding">
                Faça login
              </ion-button>
            </p>
          </ion-text>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <!-- Modal/Pop-up de Senha Encontrada -->
    <ion-modal
      :is-open="isModalOpen"
      @did-dismiss="isModalOpen = false"
      :backdrop-dismiss="false"
    >
      <ion-header>
        <ion-toolbar color="success">
          <ion-title>Senha Recuperada</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="fecharModal">
              <ion-icon slot="icon-only" :icon="closeIcon"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Ícone de Sucesso -->
        <div class="ion-text-center ion-margin-top">
          <ion-icon :icon="checkmarkCircle" size="large" color="success"></ion-icon>
        </div>

        <!-- Mensagem de Sucesso -->
        <ion-text class="ion-text-center ion-margin-top">
          <h2>Senha Encontrada!</h2>
          <p>Aqui está a senha associada ao e-mail:</p>
        </ion-text>

        <!-- Card com Email -->
        <ion-card class="ion-margin-top">
          <ion-card-content>
            <ion-text>
              <p><strong>E-mail:</strong></p>
              <p>{{ emailRecuperado }}</p>
            </ion-text>
          </ion-card-content>
        </ion-card>

        <!-- Card com Senha -->
        <ion-card color="warning">
          <ion-card-content>
            <ion-text>
              <p><strong>Sua Senha:</strong></p>
              <div class="password-container">
                <p class="password-text">{{ senhaRecuperada }}</p>
                <ion-button
                  fill="clear"
                  @click="copiarSenha"
                  size="small"
                >
                  <ion-icon slot="icon-only" :icon="copyIcon"></ion-icon>
                </ion-button>
              </div>
            </ion-text>
          </ion-card-content>
        </ion-card>

        <!-- Mensagem de Cópia -->
        <ion-text v-if="senhaCopiada" color="success" class="ion-text-center ion-margin-top">
          <p>✓ Senha copiada para a área de transferência!</p>
        </ion-text>

        <!-- Botões de Ação -->
        <div class="ion-margin-top">
          <ion-button expand="block" color="success" @click="irParaLogin">
            <ion-icon slot="start" :icon="logInIcon"></ion-icon>
            Ir para Login
          </ion-button>
          <ion-button expand="block" color="medium" @click="fecharModal">
            <ion-icon slot="start" :icon="closeIcon"></ion-icon>
            Fechar
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { findUsuarioByLogin } from '../services/database'

import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonModal,
  toastController,
} from "@ionic/vue";
import {
  search,
  close,
  checkmarkCircle,
  copy,
  logIn,
} from "ionicons/icons";

const router = useRouter();

// Estado do componente
const email = ref("");
const erro = ref("");
const isModalOpen = ref(false);
const emailRecuperado = ref("");
const senhaRecuperada = ref("");
const senhaCopiada = ref(false);

// Ícones
const searchIcon = search;
const closeIcon = close;
const copyIcon = copy;
const logInIcon = logIn;

// Função para recuperar a senha
const handleRecuperarSenha = async () => {
  erro.value = "";
  senhaCopiada.value = false;

  if (!email.value) {
    erro.value = "Por favor, digite seu e-mail";
    return;
  }

  const usuarioEncontrado = await findUsuarioByLogin(email.value)

  if (usuarioEncontrado) {
    // Mostrar a senha no pop-up
    emailRecuperado.value = usuarioEncontrado.login;
    senhaRecuperada.value = usuarioEncontrado.senha;
    isModalOpen.value = true;

    // Toast de sucesso
    const toast = await toastController.create({
      message: "Senha encontrada!",
      duration: 2000,
      position: "bottom",
      color: "success",
    });
    await toast.present();
  } else {
    erro.value = "E-mail não encontrado no sistema";
    const toast = await toastController.create({
      message: "E-mail não encontrado",
      duration: 2000,
      position: "bottom",
      color: "danger",
    });
    await toast.present();
  }
};

// Função para copiar a senha
const copiarSenha = async () => {
  try {
    await navigator.clipboard.writeText(senhaRecuperada.value);
    senhaCopiada.value = true;

    const toast = await toastController.create({
      message: "Senha copiada!",
      duration: 1500,
      position: "bottom",
      color: "success",
    });
    await toast.present();

    // Remover mensagem de cópia após 3 segundos
    setTimeout(() => {
      senhaCopiada.value = false;
    }, 3000);
  } catch (err) {
    const toast = await toastController.create({
      message: "Erro ao copiar",
      duration: 1500,
      position: "bottom",
      color: "danger",
    });
    await toast.present();
  }
};

// Função para fechar o modal
const fecharModal = () => {
  isModalOpen.value = false;
  email.value = "";
};

// Função para ir para o login
const irParaLogin = async () => {
  isModalOpen.value = false;
  email.value = "";
  await router.push("/login");
};

const voltarParaLogin = () => {
  router.replace('/login');
};

</script>

<style scoped>
.password-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

.password-text {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  margin: 0;
}
</style>
