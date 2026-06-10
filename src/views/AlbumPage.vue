<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Seu Álbum</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleLogout">
            <ion-icon slot="icon-only" :icon="logOutIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Seu Álbum</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Resumo do Álbum</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="12" sizeSm="6" sizeMd="4">
                <div class="ion-text-center">
                  <ion-text color="primary">
                    <h2>{{ totalFigurinhas }}</h2>
                    <p>Total de Figurinhas</p>
                  </ion-text>
                </div>
              </ion-col>
              <ion-col size="12" sizeSm="6" sizeMd="4">
                <div class="ion-text-center">
                  <ion-text color="success">
                    <h2>{{ figurinhasColetadas }}</h2>
                    <p>Coletadas</p>
                  </ion-text>
                </div>
              </ion-col>
              <ion-col size="12" sizeSm="6" sizeMd="4">
                <div class="ion-text-center">
                  <ion-text color="warning">
                    <h2>{{ percentualCompleto }}%</h2>
                    <p>Progresso</p>
                  </ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-progress-bar :value="percentualCompleto / 100" color="success" class="ion-margin-top"></ion-progress-bar>
        </ion-card-content>
      </ion-card>

      <StickerList />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useAlbum } from '../composables/useAlbum'
import StickerList from '../components/StickerList.vue'
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
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonProgressBar,
  toastController
} from '@ionic/vue'
import { logOut } from 'ionicons/icons'

const router = useRouter()
const { logout } = useAuth()
const { totalFigurinhas, figurinhasColetadas, percentualCompleto } = useAlbum()

const logOutIcon = logOut

const handleLogout = async () => {
  logout()
  const toast = await toastController.create({
    message: 'Logout realizado com sucesso!',
    duration: 2000,
    position: 'bottom',
    color: 'success'
  })
  await toast.present()
  await router.push('/login')
}
</script>