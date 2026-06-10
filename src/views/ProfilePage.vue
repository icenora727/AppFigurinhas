<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

</script>

<template>
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonTitle>
                    Perfil
                </IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent class="ion-padding">
            <div class="profile-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb7dVK6dbPT6Qa4q6aafJZFp6OOP5oD9zVMQ&s"
                 alt="">
                <h1>Gabi</h1>
                <p>Programador Web</p>
            </div>
        </IonContent>
    </IonPage>
</template>