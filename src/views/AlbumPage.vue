<template>
  <ion-page>
    <AppHeader />

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
import { useAlbum } from '../composables/useAlbum'
import AppHeader from '../components/AppHeader.vue'
import StickerList from '../components/StickerList.vue'
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
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonProgressBar
} from '@ionic/vue'

const { totalFigurinhas, figurinhasColetadas, percentualCompleto } = useAlbum()
</script>