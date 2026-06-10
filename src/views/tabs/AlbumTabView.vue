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
                    <p>Total</p>
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

      <ion-segment v-model="filtroAtual" @ion-change="definirFiltro(filtroAtual)" class="ion-margin">
        <ion-segment-button value="todas">
          <ion-label>Todas</ion-label>
        </ion-segment-button>
        <ion-segment-button value="coletadas">
          <ion-label>Coletadas</ion-label>
        </ion-segment-button>
        <ion-segment-button value="pendentes">
          <ion-label>Pendentes</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-searchbar
        v-model="termoPesquisa"
        placeholder="Pesquisar..."
        @ion-input="pesquisar(termoPesquisa)"
        class="ion-margin"
      ></ion-searchbar>

      <ion-grid class="ion-padding">
        <ion-row>
          <ion-col size="12" sizeSm="6" sizeMd="4" sizeLg="3" v-for="sticker in figurinhasFiltradas" :key="sticker.id">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ sticker.nome }}</ion-card-title>
                <ion-card-subtitle>{{ sticker.selecao }}</ion-card-subtitle>
              </ion-card-header>

              <ion-img :src="sticker.foto" :alt="sticker.nome"></ion-img>

              <ion-card-content>
                <div class="flex gap-2">
                  <ion-button
                    expand="block"
                    @click="marcarColetada(sticker.id)"
                    :color="sticker.coletada ? 'success' : 'medium'"
                    size="small"
                  >
                    <ion-icon slot="start" :icon="sticker.coletada ? checkmarkCircle : ellipseOutline"></ion-icon>
                    Coletada
                  </ion-button>
                  <ion-button
                    expand="block"
                    @click="marcarPendente(sticker.id)"
                    :color="!sticker.coletada ? 'warning' : 'medium'"
                    size="small"
                  >
                    <ion-icon slot="start" :icon="!sticker.coletada ? alertCircle : ellipseOutline"></ion-icon>
                    Pendente
                  </ion-button>
                </div>

                <ion-badge v-if="sticker.coletada" color="success" class="ion-margin-top">
                  ✓ Coletada
                </ion-badge>
                <ion-badge v-else color="warning" class="ion-margin-top">
                  ○ Pendente
                </ion-badge>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-text v-if="figurinhasFiltradas.length === 0" class="ion-text-center ion-padding">
        <p>Nenhuma figurinha encontrada</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useAlbum } from '../../composables/useAlbum'
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
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
  IonImg,
  IonBadge,
  toastController
} from '@ionic/vue'
import { logOut, checkmarkCircle, alertCircle, ellipseOutline } from 'ionicons/icons'

const router = useRouter()
const { logout } = useAuth()
const {
  figurinhasFiltradas,
  filtroAtual,
  termoPesquisa,
  totalFigurinhas,
  figurinhasColetadas,
  percentualCompleto,
  marcarColetada,
  marcarPendente,
  definirFiltro,
  pesquisar
} = useAlbum()

const logOutIcon = logOut

const handleLogout = async () => {
  logout()
  const toast = await toastController.create({
    message: 'Logout realizado!',
    duration: 1500,
    position: 'bottom',
    color: 'success'
  })
  await toast.present()
  await router.push('/login')
}
</script>