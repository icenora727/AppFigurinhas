<template>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Tab 1</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent :fullscreen="true">
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Tab 1</IonTitle>
                </IonToolbar>
            </IonHeader>
            <ContatoForm/>
        </IonContent>
    </IonPage>
</template>

<script setup lang="ts">
import ContatoForm from '@/components/ContatoForm.vue';
import { IonContent, IonHeader, IonPage, IonTitle } from '@ionic/vue';
</script>