<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Estatísticas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Estatísticas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Progresso Geral</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-text>
            <h3>{{ percentualCompleto }}% completo</h3>
          </ion-text>
          <ion-progress-bar :value="percentualCompleto / 100" color="success" class="ion-margin-top"></ion-progress-bar>
          <ion-text class="ion-margin-top">
            <p>{{ figurinhasColetadas }} de {{ totalFigurinhas }} figurinhas coletadas</p>
          </ion-text>
        </ion-card-content>
      </ion-card>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Por Seleção</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="selecao in obterSelecoes()" :key="selecao">
              <ion-label>
                <h3>{{ selecao }}</h3>
                <p>{{ obterFigurinhasPorSelecao(selecao).filter(f => f.coletada).length }} de {{ obterFigurinhasPorSelecao(selecao).length }}</p>
              </ion-label>
              <ion-badge slot="end" color="primary">
                {{ Math.round((obterFigurinhasPorSelecao(selecao).filter(f => f.coletada).length / obterFigurinhasPorSelecao(selecao).length) * 100) }}%
              </ion-badge>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Resumo</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <div class="ion-text-center">
                  <ion-text color="success">
                    <h2>{{ figurinhasColetadas }}</h2>
                    <p>Coletadas</p>
                  </ion-text>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="ion-text-center">
                  <ion-text color="warning">
                    <h2>{{ totalFigurinhas - figurinhasColetadas }}</h2>
                    <p>Pendentes</p>
                  </ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAlbum } from '../../composables/useAlbum'
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
  IonText,
  IonProgressBar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue'

const {
  totalFigurinhas,
  figurinhasColetadas,
  percentualCompleto,
  obterFigurinhasPorSelecao,
  obterSelecoes
} = useAlbum()
</script>