<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-text-center ion-margin-top">
        <h1 class="text-4xl font-bold ion-margin">⚽ Álbum Copa</h1>
        <p class="text-gray-600">Colecionador de Figurinhas da Copa do Mundo</p>
      </div>

      <div class="ion-margin-top ion-margin-bottom">
        <LoginForm />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import LoginForm from '../components/LoginForm.vue'
</script>