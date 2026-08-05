<template>
  <ion-content>
    <ion-segment v-model="filtroAtual" @ion-change="definirFiltro(filtroAtual)" class="ion-margin">
      <ion-segment-button value="todas">
        <ion-label>Todas ({{ qtdTodasFig }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="coletadas">
        <ion-label>Coletadas ({{ qtdFigurinhasColetadas }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="pendentes">
        <ion-label>Pendentes ({{ qtdTodasFig - qtdFigurinhasColetadas }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="favoritas">
        <ion-label>Favoritas</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-searchbar
      v-model="termoPesquisa"
      placeholder="Pesquisar por brainrot ou raridade..."
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
            @marcar-favorita="marcarFavorita"
          />
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-text v-if="figurinhasFiltradas.length === 0" class="ion-text-center ion-padding">
      <p>Nenhuma figurinha encontrada</p>
    </ion-text>
  </ion-content>
</template>

<script setup lang="ts">
import { useAlbum } from '../services/database'
import StickerCard from './StickerCard.vue'
import {
  IonContent,
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
  qtdTodasFig,
  qtdFigurinhasColetadas,
  marcarColetada,
  marcarPendente,
  marcarFavorita,
  alternarColetada,
  definirFiltro,
  pesquisar
} = useAlbum()
</script>