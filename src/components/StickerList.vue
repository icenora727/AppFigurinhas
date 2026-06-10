<template>
  <ion-segment v-model="filtroAtual" @ion-change="definirFiltro(filtroAtual)" class="ion-margin">
    <ion-segment-button value="todas">
      <ion-label>Todas ({{ totalFigurinhas }})</ion-label>
    </ion-segment-button>
    <ion-segment-button value="coletadas">
      <ion-label>Coletadas ({{ figurinhasColetadas }})</ion-label>
    </ion-segment-button>
    <ion-segment-button value="pendentes">
      <ion-label>Pendentes ({{ totalFigurinhas - figurinhasColetadas }})</ion-label>
    </ion-segment-button>
  </ion-segment>

  <ion-searchbar
    v-model="termoPesquisa"
    placeholder="Pesquisar por jogador ou seleção..."
    @ion-input="pesquisar(termoPesquisa)"
    class="ion-margin"
  ></ion-searchbar>

  <ion-grid class="ion-padding">
    <ion-row>
      <ion-col size="12" sizeSm="6" sizeMd="4" sizeLg="3" v-for="sticker in figurinhasFiltradas" :key="sticker.id">
        <StickerCard
          :sticker="sticker"
          @toggle="alternarColetada"
          @marcar-coletada="marcarColetada"
          @marcar-pendente="marcarPendente"
        />
      </ion-col>
    </ion-row>
  </ion-grid>

  <ion-text v-if="figurinhasFiltradas.length === 0" class="ion-text-center ion-padding">
    <p>Nenhuma figurinha encontrada</p>
  </ion-text>
</template>

<script setup lang="ts">
import { useAlbum } from '../composables/useAlbum'
import StickerCard from './StickerCard.vue'
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/vue'

const {
  figurinhasFiltradas,
  filtroAtual,
  termoPesquisa,
  totalFigurinhas,
  figurinhasColetadas,
  marcarColetada,
  marcarPendente,
  alternarColetada,
  definirFiltro,
  pesquisar
} = useAlbum()
</script>