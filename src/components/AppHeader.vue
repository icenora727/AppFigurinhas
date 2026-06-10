<!-- <template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>⚽ Álbum Copa</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="presentMenu">
          <ion-icon slot="icon-only" :icon="menuIcon"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-popover :is-open="isMenuOpen" @did-dismiss="isMenuOpen = false">
    <ion-content>
      <ion-list>
        <ion-item v-if="usuarioAtual" button>
          <ion-label>
            <p class="font-semibold">{{ usuarioAtual.name }}</p>
            <p class="text-sm">{{ usuarioAtual.email }}</p>
          </ion-label>
        </ion-item>
        <ion-item-divider></ion-item-divider>
        <ion-item button @click="navigateTo('/album')">
          <ion-icon slot="start" :icon="albumIcon"></ion-icon>
          <ion-label>Álbum</ion-label>
        </ion-item>
        <ion-item button @click="navigateTo('/profile')">
          <ion-icon slot="start" :icon="personIcon"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-item>
        <ion-item-divider></ion-item-divider>
        <ion-item button @click="handleLogout" color="danger">
          <ion-icon slot="start" :icon="logOutIcon"></ion-icon>
          <ion-label>Sair</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
  toastController
} from '@ionic/vue'
import { menu, album, person, logOut } from 'ionicons/icons'

const router = useRouter()
const { logout, obterUsuarioAtual } = useAuth()
const usuarioAtual = ref()
const isMenuOpen = ref(false)

const menuIcon = menu
const albumIcon = album
const personIcon = person
const logOutIcon = logOut

onMounted(() => {
  usuarioAtual.value = obterUsuarioAtual()
})

const presentMenu = () => {
  isMenuOpen.value = true
}

const navigateTo = (path: string) => {
  isMenuOpen.value = false
  router.push(path)
}

const handleLogout = async () => {
  logout()
  isMenuOpen.value = false
  const toast = await toastController.create({
    message: 'Logout realizado com sucesso!',
    duration: 2000,
    position: 'bottom',
    color: 'success'
  })
  await toast.present()
  router.push('/login')
}
</script> -->