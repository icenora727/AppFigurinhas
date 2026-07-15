<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, logout } = useAuth()

const nomeUsuario = computed(() => currentUser.value?.name ?? 'Usuário')
const emailUsuario = computed(() => currentUser.value?.email ?? 'Sem e-mail cadastrado')

const handleLogout = async () => {
    logout()
    await router.replace('/login')
}
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
                <h1>{{ nomeUsuario }}</h1>
                <p>{{ emailUsuario }}</p>

                <IonButton expand="block" color="danger" class="ion-margin-top" @click="handleLogout">
                    Deslogar
                </IonButton>
            </div>
        </IonContent>
    </IonPage>
</template>