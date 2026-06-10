<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { checkboxOutline, personOutline, homeOutline } from 'ionicons/icons';

</script>

<template>
    <IonPage>
        <IonTabs>

            <IonRouterOutlet />

            <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/tabs/home">
                    <IonIcon :icon="homeOutline" />
                    <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tarefas" href="/tabs/album">
                    <IonIcon :icon="checkboxOutline" />
                    <IonLabel>Álbum</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/tabs/profile">
                    <IonIcon :icon="personOutline" />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>

            </IonTabBar>

        </IonTabs>
    </IonPage>
</template>