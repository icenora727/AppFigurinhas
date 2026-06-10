<template>
  <ion-page>
    <ion-tabs>
      <ion-tab tab="album">
        <router-view></router-view>
      </ion-tab>

      <ion-tab tab="stats">
        <router-view></router-view>
      </ion-tab>

      <ion-tab tab="profile">
        <router-view></router-view>
      </ion-tab>

      <ion-tab-bar slot="bottom" color="primary">
        <ion-tab-button tab="album" href="/tabs/album">
          <ion-icon :icon="albumIcon"></ion-icon>
          <ion-label>Álbum</ion-label>
          <ion-badge v-if="figurinhasColetadas > 0" color="success">{{ figurinhasColetadas }}</ion-badge>
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
import { useAlbum } from '../composables/useAlbum'
import {
  IonPage,
  IonTabs,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge
} from '@ionic/vue'
import { album, statsChart, person } from 'ionicons/icons'

const { figurinhasColetadas } = useAlbum()

const albumIcon = album
const statsIcon = statsChart
const personIcon = person
</script>