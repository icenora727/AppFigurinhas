<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { checkboxOutline, informationCircleOutline, personOutline, trophyOutline } from 'ionicons/icons';

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
                <IonTabButton tab="conquistas" href="/tabs/conquistas">
                    <IonIcon :icon="trophyOutline" />
                    <IonLabel>Conquistas</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/tabs/profile">
                    <IonIcon :icon="personOutline" />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab="sobre" href="/tabs/sobre">
                    <IonIcon :icon="informationCircleOutline" />
                    <IonLabel>Sobre</IonLabel>
                </IonTabButton>

            </IonTabBar>

        </IonTabs>
    </IonPage>
</template>