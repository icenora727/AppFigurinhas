<template>
  <ion-card @click="handleToggle" class="cursor-pointer">
    <ion-card-header>
      <ion-card-title>{{ sticker.nome }}</ion-card-title>
      <ion-card-subtitle>{{ sticker.selecao }}</ion-card-subtitle>
    </ion-card-header>

    <ion-img :src="sticker.foto" :alt="sticker.nome"></ion-img>

    <ion-card-content>
      <div class="flex gap-2">
        <ion-button
          expand="block"
          @click.stop="handleMarcarColetada"
          :color="sticker.coletada ? 'success' : 'medium'"
          size="small"
        >
          <ion-icon slot="start" :icon="sticker.coletada ? checkmarkCircle : ellipseOutline"></ion-icon>
          Coletada
        </ion-button>
        <ion-button
          expand="block"
          @click.stop="handleMarcarPendente"
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
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg,
  IonBadge
} from '@ionic/vue'
import { checkmarkCircle, alertCircle, ellipseOutline } from 'ionicons/icons'

interface Sticker {
  id: string
  nome: string
  selecao: string
  foto: string
  coletada: boolean
}

const props = defineProps<{
  sticker: Sticker
}>()

const emit = defineEmits<{
  toggle: [id: string]
  marcarColetada: [id: string]
  marcarPendente: [id: string]
}>()

const handleToggle = () => {
  emit('toggle', props.sticker.id)
}

const handleMarcarColetada = () => {
  emit('marcarColetada', props.sticker.id)
}

const handleMarcarPendente = () => {
  emit('marcarPendente', props.sticker.id)
}
</script>