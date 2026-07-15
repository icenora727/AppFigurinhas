<template>
  <ion-card @click="handleToggle" class="cursor-pointer sticker-card" :class="raridadeClass">
    <ion-card-header>
      <ion-card-title>{{ sticker.nome }}</ion-card-title>
      <ion-card-subtitle class="raridade-pill" :class="raridadeClass">
        {{ sticker.raridade }}
      </ion-card-subtitle>
    </ion-card-header>

    <ion-img :src="sticker.foto" :alt="sticker.nome"
    style="width: 100%; height: 200px; object-fit: inherit;"
    ></ion-img>

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
import { computed } from 'vue'
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
  raridade: string
  foto: string
  coletada: boolean
}

const props = defineProps<{
  sticker: Sticker
}>()

const raridadeNormalizada = computed(() => props.sticker.raridade.toLowerCase())

const raridadeClass = computed(() => `raridade-${raridadeNormalizada.value}`)

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

<style scoped>
.sticker-card {
  overflow: hidden;
}

.raridade-pill {
  display: inline-flex;
  width: fit-content;
  margin-top: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
}

.raridade-comum {
  background: linear-gradient(135deg, #64748b, #334155);
}

.raridade-raro,
.raridade-rara {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.raridade-lendario {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.raridade-secreto {
  background: linear-gradient(135deg, #7c3aed, #4c1d95);
}

.sticker-card.raridade-comum {
  border: 1px solid rgba(100, 116, 139, 0.2);
  background: linear-gradient(180deg, rgba(100, 116, 139, 0.08), transparent 40%);
}

.sticker-card.raridade-raro,
.sticker-card.raridade-rara {
  border: 1px solid rgba(37, 99, 235, 0.22);
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.1), transparent 40%);
}

.sticker-card.raridade-lendario {
  border: 1px solid rgba(245, 158, 11, 0.24);
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.12), transparent 40%);
}

.sticker-card.raridade-secreto {
  border: 1px solid rgba(124, 58, 237, 0.24);
  background: linear-gradient(180deg, rgba(124, 58, 237, 0.12), transparent 40%);
}
</style>