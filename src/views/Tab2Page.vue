<template>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Tab 2</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent :fullscreen="true">
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Tab 2</IonTitle>
                </IonToolbar>
            </IonHeader>
            <ContatoList/>
        </IonContent>
    </IonPage>
</template>

<script setup lang="ts">
import ContatoList from '@/components/ContatoList.vue';
import { IonContent, IonHeader, IonPage, IonTitle } from '@ionic/vue';
</script>