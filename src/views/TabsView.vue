<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom" color="primary">
        <ion-tab-button tab="album" href="/tabs/album">
          <ion-icon :icon="albumIcon"></ion-icon>
          <ion-label>Álbum</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="stats" href="/tabs/stats">
          <ion-icon :icon="statsIcon"></ion-icon>
          <ion-label>Estatísticas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personIcon"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/vue'
import { album, statsChart, person } from 'ionicons/icons'

const albumIcon = album
const statsIcon = statsChart
const personIcon = person
</script>