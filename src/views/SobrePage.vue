<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-card>
        <ion-card-header>
          <ion-card-title>Álbum de Figurinhas</ion-card-title>
          <ion-card-subtitle>Versão 1.0.0</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          Aplicativo desenvolvido com <strong>Ionic Vue</strong> e
          <strong>Capacitor SQLite</strong> para gerenciamento de uma coleção
          de figurinhas.
        </ion-card-content>
      </ion-card>
      
      <ion-list inset>
        <ion-list-header>
          <ion-label>Informações</ion-label>
        </ion-list-header>

        <ion-item
          button
          detail
          href="https://www.exemplo.com/termos"
          target="_blank"
        >
          <ion-icon :icon="documentTextOutline" slot="start" />
          <ion-label>Termos de Uso</ion-label>
        </ion-item>

        <ion-item
          button
          detail
          href="https://www.exemplo.com/privacidade"
          target="_blank"
        >
          <ion-icon :icon="shieldCheckmarkOutline" slot="start" />
          <ion-label>Política de Privacidade</ion-label>
        </ion-item>

        <ion-item>
          <ion-icon :icon="informationCircleOutline" slot="start" />
          <ion-label>
            <h2>Versão</h2>
            <p>1.0.0</p>
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/vue";

import {
  documentTextOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
} from "ionicons/icons";
</script>