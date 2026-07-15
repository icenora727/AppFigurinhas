<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { checkboxOutline, personOutline, personCircle } from 'ionicons/icons';

</script>

<template>
    <IonPage>
        <IonTabs>

            <IonRouterOutlet />

            <IonTabBar slot="bottom">
                <IonTabButton tab="tarefas" href="/tabs/album">
                    <IonIcon :icon="checkboxOutline" />
                    <IonLabel>Álbum</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/tabs/profile">
                    <IonIcon :icon="personOutline" />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tabs/tab2">
                    <IonIcon :icon="personCircle" />
                    <IonLabel>Tab2</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab1" href="/tabs/tab1">
                    <IonIcon :icon="personCircle" />
                    <IonLabel>Tab1</IonLabel>
                </IonTabButton>
                <IonTabButton tab="sobre" href="/tabs/sobre">
                    <IonIcon :icon="personCircle" />
                    <IonLabel>Sobre</IonLabel>
                </IonTabButton>

            </IonTabBar>

        </IonTabs>
    </IonPage>
</template>