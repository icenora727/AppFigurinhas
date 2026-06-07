# Códigos - Álbum de Figurinhas da Copa do Mundo (Com Ionic)

Este documento contém todos os códigos refatorados para usar a estrutura completa do Ionic Framework.

---

## 1. COMPOSABLES

### 1.1 - `composables/useAuth.ts`

```typescript
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  password: string
}

const users = ref<User[]>([
  {
    id: '1',
    name: 'Usuário Teste',
    email: 'teste@email.com',
    password: '123456'
  }
])

const currentUser = ref<User | null>(null)
const isAuthenticated = computed(() => currentUser.value !== null)

export function useAuth() {
  const login = (email: string, password: string): boolean => {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = { ...user }
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  const cadastrar = (name: string, email: string, password: string): boolean => {
    const userExists = users.value.some(u => u.email === email)
    if (userExists) {
      return false
    }

    if (password.length < 6) {
      return false
    }

    const newUser: User = {
      id: String(users.value.length + 1),
      name,
      email,
      password
    }

    users.value.push(newUser)
    currentUser.value = { ...newUser }
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    return true
  }

  const resetarSenha = (email: string, novaSenha: string): boolean => {
    const user = users.value.find(u => u.email === email)
    if (user && novaSenha.length >= 6) {
      user.password = novaSenha
      return true
    }
    return false
  }

  const obterUsuarioAtual = () => {
    if (!currentUser.value) {
      const stored = localStorage.getItem('currentUser')
      if (stored) {
        currentUser.value = JSON.parse(stored)
      }
    }
    return currentUser.value
  }

  const atualizarPerfil = (name: string, email: string): boolean => {
    if (currentUser.value) {
      const userIndex = users.value.findIndex(u => u.id === currentUser.value!.id)
      if (userIndex !== -1) {
        users.value[userIndex].name = name
        users.value[userIndex].email = email
        currentUser.value.name = name
        currentUser.value.email = email
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        return true
      }
    }
    return false
  }

  return {
    login,
    logout,
    cadastrar,
    resetarSenha,
    obterUsuarioAtual,
    atualizarPerfil,
    isAuthenticated,
    currentUser
  }
}
```

### 1.2 - `composables/useAlbum.ts`

```typescript
import { ref, computed } from 'vue'

interface Sticker {
  id: string
  nome: string
  selecao: string
  foto: string
  coletada: boolean
}

const figurinhas = ref<Sticker[]>([
  { id: '1', nome: 'Neymar', selecao: 'Brasil', foto: 'https://via.placeholder.com/200?text=Neymar', coletada: true },
  { id: '2', nome: 'Vinicius Jr', selecao: 'Brasil', foto: 'https://via.placeholder.com/200?text=Vinicius', coletada: false },
  { id: '3', nome: 'Rodrygo', selecao: 'Brasil', foto: 'https://via.placeholder.com/200?text=Rodrygo', coletada: true },
  { id: '4', nome: 'Cristiano Ronaldo', selecao: 'Portugal', foto: 'https://via.placeholder.com/200?text=CR7', coletada: false },
  { id: '5', nome: 'Bruno Fernandes', selecao: 'Portugal', foto: 'https://via.placeholder.com/200?text=Bruno', coletada: true },
  { id: '6', nome: 'Messi', selecao: 'Argentina', foto: 'https://via.placeholder.com/200?text=Messi', coletada: true },
  { id: '7', nome: 'De Paul', selecao: 'Argentina', foto: 'https://via.placeholder.com/200?text=DePaul', coletada: false },
  { id: '8', nome: 'Lewandowski', selecao: 'Polônia', foto: 'https://via.placeholder.com/200?text=Lewa', coletada: false },
  { id: '9', nome: 'Müller', selecao: 'Alemanha', foto: 'https://via.placeholder.com/200?text=Muller', coletada: true },
  { id: '10', nome: 'Mbappé', selecao: 'França', foto: 'https://via.placeholder.com/200?text=Mbappe', coletada: false },
])

const filtroAtual = ref<'todas' | 'coletadas' | 'pendentes'>('todas')
const termoPesquisa = ref('')

const figurinhasFiltradas = computed(() => {
  let resultado = figurinhas.value

  if (filtroAtual.value === 'coletadas') {
    resultado = resultado.filter(f => f.coletada)
  } else if (filtroAtual.value === 'pendentes') {
    resultado = resultado.filter(f => !f.coletada)
  }

  if (termoPesquisa.value) {
    const termo = termoPesquisa.value.toLowerCase()
    resultado = resultado.filter(f =>
      f.nome.toLowerCase().includes(termo) ||
      f.selecao.toLowerCase().includes(termo)
    )
  }

  return resultado
})

const totalFigurinhas = computed(() => figurinhas.value.length)
const figurinhasColetadas = computed(() => figurinhas.value.filter(f => f.coletada).length)
const percentualCompleto = computed(() => {
  return Math.round((figurinhasColetadas.value / totalFigurinhas.value) * 100)
})

export function useAlbum() {
  const obterTodasFigurinhas = () => figurinhas.value

  const marcarColetada = (id: string) => {
    const figurinha = figurinhas.value.find(f => f.id === id)
    if (figurinha) {
      figurinha.coletada = true
    }
  }

  const marcarPendente = (id: string) => {
    const figurinha = figurinhas.value.find(f => f.id === id)
    if (figurinha) {
      figurinha.coletada = false
    }
  }

  const alternarColetada = (id: string) => {
    const figurinha = figurinhas.value.find(f => f.id === id)
    if (figurinha) {
      figurinha.coletada = !figurinha.coletada
    }
  }

  const pesquisar = (termo: string) => {
    termoPesquisa.value = termo
  }

  const definirFiltro = (filtro: 'todas' | 'coletadas' | 'pendentes') => {
    filtroAtual.value = filtro
  }

  const obterFigurinhasPorSelecao = (selecao: string) => {
    return figurinhas.value.filter(f => f.selecao === selecao)
  }

  const obterSelecoes = () => {
    const selecoes = new Set(figurinhas.value.map(f => f.selecao))
    return Array.from(selecoes).sort()
  }

  return {
    figurinhas,
    figurinhasFiltradas,
    filtroAtual,
    termoPesquisa,
    totalFigurinhas,
    figurinhasColetadas,
    percentualCompleto,
    obterTodasFigurinhas,
    marcarColetada,
    marcarPendente,
    alternarColetada,
    pesquisar,
    definirFiltro,
    obterFigurinhasPorSelecao,
    obterSelecoes
  }
}
```

---

## 2. COMPONENTES

### 2.1 - `components/LoginForm.vue`

```vue
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title class="text-center text-2xl">Login</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <form @submit.prevent="handleLogin">
        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha</ion-label>
          <ion-input
            v-model="password"
            type="password"
            required
            placeholder="••••••"
          ></ion-input>
        </ion-item>

        <ion-text v-if="erro" color="danger" class="ion-padding">
          <p>{{ erro }}</p>
        </ion-text>

        <ion-button expand="block" type="submit" class="ion-margin-top">
          Entrar
        </ion-button>
      </form>

      <ion-text class="ion-text-center ion-margin-top">
        <p>
          Não tem conta?
          <router-link to="/register" class="ion-text-primary">
            Cadastre-se
          </router-link>
        </p>
        <p>
          <router-link to="/reset-password" class="ion-text-primary">
            Esqueceu a senha?
          </router-link>
        </p>
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  toastController
} from '@ionic/vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const erro = ref('')

const handleLogin = async () => {
  erro.value = ''

  if (!email.value || !password.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  const sucesso = login(email.value, password.value)

  if (sucesso) {
    const toast = await toastController.create({
      message: 'Login realizado com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    router.push('/album')
  } else {
    erro.value = 'E-mail ou senha incorretos'
    const toast = await toastController.create({
      message: 'E-mail ou senha incorretos',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}
</script>
```

### 2.2 - `components/RegisterForm.vue`

```vue
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title class="text-center text-2xl">Cadastro</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <form @submit.prevent="handleRegister">
        <ion-item>
          <ion-label position="floating">Nome Completo</ion-label>
          <ion-input
            v-model="name"
            type="text"
            required
            placeholder="Seu Nome"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha</ion-label>
          <ion-input
            v-model="password"
            type="password"
            required
            placeholder="••••••"
          ></ion-input>
        </ion-item>

        <ion-text v-if="password.length > 0 && password.length < 6" color="danger" class="ion-padding">
          <p>A senha deve ter no mínimo 6 caracteres</p>
        </ion-text>

        <ion-item>
          <ion-label position="floating">Confirmar Senha</ion-label>
          <ion-input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••"
          ></ion-input>
        </ion-item>

        <ion-text v-if="confirmPassword && password !== confirmPassword" color="danger" class="ion-padding">
          <p>As senhas não conferem</p>
        </ion-text>

        <ion-text v-if="erro" color="danger" class="ion-padding">
          <p>{{ erro }}</p>
        </ion-text>

        <ion-text v-if="sucesso" color="success" class="ion-padding">
          <p>{{ sucesso }}</p>
        </ion-text>

        <ion-button expand="block" type="submit" :disabled="!isFormValid" class="ion-margin-top">
          Cadastrar
        </ion-button>
      </form>

      <ion-text class="ion-text-center ion-margin-top">
        <p>
          Já tem conta?
          <router-link to="/login" class="ion-text-primary">
            Faça login
          </router-link>
        </p>
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  toastController
} from '@ionic/vue'

const router = useRouter()
const { cadastrar } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const erro = ref('')
const sucesso = ref('')

const isFormValid = computed(() => {
  return name.value && email.value && password.value && confirmPassword.value && password.value === confirmPassword.value && password.value.length >= 6
})

const handleRegister = async () => {
  erro.value = ''
  sucesso.value = ''

  if (!name.value || !email.value || !password.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    erro.value = 'As senhas não conferem'
    return
  }

  if (password.value.length < 6) {
    erro.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }

  const resultado = cadastrar(name.value, email.value, password.value)

  if (resultado) {
    sucesso.value = 'Cadastro realizado com sucesso! Redirecionando...'
    const toast = await toastController.create({
      message: 'Cadastro realizado com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    setTimeout(() => {
      router.push('/album')
    }, 1500)
  } else {
    erro.value = 'Este e-mail já está cadastrado'
    const toast = await toastController.create({
      message: 'Este e-mail já está cadastrado',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}
</script>
```

### 2.3 - `components/ResetPasswordForm.vue`

```vue
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title class="text-center text-2xl">Recuperar Senha</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <form @submit.prevent="handleReset">
        <div v-if="!emailEnviado">
          <ion-item>
            <ion-label position="floating">E-mail</ion-label>
            <ion-input
              v-model="email"
              type="email"
              required
              placeholder="seu@email.com"
            ></ion-input>
          </ion-item>

          <ion-text v-if="erro" color="danger" class="ion-padding">
            <p>{{ erro }}</p>
          </ion-text>

          <ion-button expand="block" type="submit" class="ion-margin-top">
            Enviar Link de Recuperação
          </ion-button>
        </div>

        <div v-else>
          <ion-note color="success" class="ion-padding">
            ✓ E-mail de recuperação enviado para {{ email }}
          </ion-note>

          <ion-item class="ion-margin-top">
            <ion-label position="floating">Nova Senha</ion-label>
            <ion-input
              v-model="newPassword"
              type="password"
              required
              placeholder="••••••"
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Confirmar Nova Senha</ion-label>
            <ion-input
              v-model="confirmNewPassword"
              type="password"
              required
              placeholder="••••••"
            ></ion-input>
          </ion-item>

          <ion-text v-if="erroReset" color="danger" class="ion-padding">
            <p>{{ erroReset }}</p>
          </ion-text>

          <ion-button expand="block" @click="confirmarNovaSenha" type="button" color="success" class="ion-margin-top">
            Confirmar Nova Senha
          </ion-button>
        </div>
      </form>

      <ion-text class="ion-text-center ion-margin-top">
        <router-link to="/login" class="ion-text-primary">
          Voltar ao Login
        </router-link>
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonNote,
  toastController,
  alertController
} from '@ionic/vue'

const router = useRouter()
const { resetarSenha } = useAuth()

const email = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const emailEnviado = ref(false)
const erro = ref('')
const erroReset = ref('')

const handleReset = async () => {
  erro.value = ''

  if (!email.value) {
    erro.value = 'Por favor, informe seu e-mail'
    return
  }

  emailEnviado.value = true
  const toast = await toastController.create({
    message: 'E-mail de recuperação enviado!',
    duration: 2000,
    position: 'bottom',
    color: 'success'
  })
  await toast.present()
}

const confirmarNovaSenha = async () => {
  erroReset.value = ''

  if (!newPassword.value || !confirmNewPassword.value) {
    erroReset.value = 'Por favor, preencha todos os campos'
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    erroReset.value = 'As senhas não conferem'
    return
  }

  if (newPassword.value.length < 6) {
    erroReset.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }

  const sucesso = resetarSenha(email.value, newPassword.value)

  if (sucesso) {
    const alert = await alertController.create({
      header: 'Sucesso',
      message: 'Senha redefinida com sucesso!',
      buttons: ['OK']
    })
    await alert.present()
    router.push('/login')
  } else {
    erroReset.value = 'Erro ao redefinir a senha'
  }
}
</script>
```

### 2.4 - `components/StickerCard.vue`

```vue
<template>
  <ion-card @click="handleToggle" class="cursor-pointer">
    <ion-card-header>
      <ion-card-title>{{ sticker.nome }}</ion-card-title>
      <ion-card-subtitle>{{ sticker.selecao }}</ion-card-subtitle>
    </ion-card-header>

    <ion-img :src="sticker.foto" :alt="sticker.nome"></ion-img>

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
import { defineProps, defineEmits } from 'vue'
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
  selecao: string
  foto: string
  coletada: boolean
}

const props = defineProps<{
  sticker: Sticker
}>()

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
```

### 2.5 - `components/StickerList.vue`

```vue
<template>
  <ion-content>
    <ion-segment v-model="filtroAtual" @ion-change="definirFiltro(filtroAtual)" class="ion-margin">
      <ion-segment-button value="todas">
        <ion-label>Todas ({{ totalFigurinhas }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="coletadas">
        <ion-label>Coletadas ({{ figurinhasColetadas }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="pendentes">
        <ion-label>Pendentes ({{ totalFigurinhas - figurinhasColetadas }})</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-searchbar
      v-model="termoPesquisa"
      placeholder="Pesquisar por jogador ou seleção..."
      @ion-input="pesquisar(termoPesquisa)"
      class="ion-margin"
    ></ion-searchbar>

    <ion-grid class="ion-padding">
      <ion-row>
        <ion-col size="12" sizeSm="6" sizeMd="4" sizeLg="3" v-for="sticker in figurinhasFiltradas" :key="sticker.id">
          <StickerCard
            :sticker="sticker"
            @toggle="alternarColetada"
            @marcar-coletada="marcarColetada"
            @marcar-pendente="marcarPendente"
          />
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-text v-if="figurinhasFiltradas.length === 0" class="ion-text-center ion-padding">
      <p>Nenhuma figurinha encontrada</p>
    </ion-text>
  </ion-content>
</template>

<script setup lang="ts">
import { useAlbum } from '../composables/useAlbum'
import StickerCard from './StickerCard.vue'
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/vue'

const {
  figurinhasFiltradas,
  filtroAtual,
  termoPesquisa,
  totalFigurinhas,
  figurinhasColetadas,
  marcarColetada,
  marcarPendente,
  alternarColetada,
  definirFiltro,
  pesquisar
} = useAlbum()
</script>
```

### 2.6 - `components/AppHeader.vue`

```vue
<template>
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
const usuarioAtual = ref(null)
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
</script>
```

---

## 3. VIEWS (PÁGINAS)

### 3.1 - `views/LoginView.vue`

```vue
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
```

### 3.2 - `views/RegisterView.vue`

```vue
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-text-center ion-margin-top">
        <h1 class="text-4xl font-bold ion-margin">⚽ Álbum Copa</h1>
        <p class="text-gray-600">Crie sua conta para começar</p>
      </div>

      <div class="ion-margin-top ion-margin-bottom">
        <RegisterForm />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import RegisterForm from '../components/RegisterForm.vue'
</script>
```

### 3.3 - `views/ResetPasswordView.vue`

```vue
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-text-center ion-margin-top">
        <h1 class="text-4xl font-bold ion-margin">⚽ Álbum Copa</h1>
        <p class="text-gray-600">Recuperar Acesso</p>
      </div>

      <div class="ion-margin-top ion-margin-bottom">
        <ResetPasswordForm />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
</script>
```

### 3.4 - `views/AlbumView.vue`

```vue
<template>
  <ion-page>
    <AppHeader />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Seu Álbum</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Resumo do Álbum</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="12" sizeSm="6" sizeMd="4">
                <div class="ion-text-center">
                  <ion-text color="primary">
                    <h2>{{ totalFigurinhas }}</h2>
                    <p>Total de Figurinhas</p>
                  </ion-text>
                </div>
              </ion-col>
              <ion-col size="12" sizeSm="6" sizeMd="4">
                <div class="ion-text-center">
                  <ion-text color="success">
                    <h2>{{ figurinhasColetadas }}</h2>
                    <p>Coletadas</p>
                  </ion-text>
                </div>
              </ion-col>
              <ion-col size="12" sizeSm="6" sizeMd="4">
                <div class="ion-text-center">
                  <ion-text color="warning">
                    <h2>{{ percentualCompleto }}%</h2>
                    <p>Progresso</p>
                  </ion-text>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>

          <ion-progress-bar :value="percentualCompleto / 100" color="success" class="ion-margin-top"></ion-progress-bar>
        </ion-card-content>
      </ion-card>

      <StickerList />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAlbum } from '../composables/useAlbum'
import AppHeader from '../components/AppHeader.vue'
import StickerList from '../components/StickerList.vue'
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonProgressBar
} from '@ionic/vue'

const { totalFigurinhas, figurinhasColetadas, percentualCompleto } = useAlbum()
</script>
```

### 3.5 - `views/ProfileView.vue`

```vue
<template>
  <ion-page>
    <AppHeader />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Perfil</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card class="ion-margin">
        <ion-card-header>
          <ion-card-title>Informações do Usuário</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="handleSalvar">
            <ion-item>
              <ion-label position="floating">Nome Completo</ion-label>
              <ion-input v-model="name" type="text" required></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">E-mail</ion-label>
              <ion-input v-model="email" type="email" required></ion-input>
            </ion-item>

            <ion-card class="ion-margin-top" color="light">
              <ion-card-content>
                <ion-text>
                  <p><strong>ID do Usuário:</strong> {{ usuarioAtual?.id }}</p>
                  <p><strong>Membro desde:</strong> Hoje</p>
                </ion-text>
              </ion-card-content>
            </ion-card>

            <ion-text v-if="mensagem" :color="mensagem.tipo === 'sucesso' ? 'success' : 'danger'" class="ion-padding">
              <p>{{ mensagem.texto }}</p>
            </ion-text>

            <div class="ion-margin-top">
              <ion-button expand="block" type="submit" color="primary">
                <ion-icon slot="start" :icon="saveIcon"></ion-icon>
                Salvar Alterações
              </ion-button>
              <ion-button expand="block" @click="voltarAlbum" color="medium">
                <ion-icon slot="start" :icon="arrowBackIcon"></ion-icon>
                Voltar
              </ion-button>
            </div>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AppHeader from '../components/AppHeader.vue'
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  toastController
} from '@ionic/vue'
import { save, arrowBack } from 'ionicons/icons'

const router = useRouter()
const { obterUsuarioAtual, atualizarPerfil } = useAuth()

const name = ref('')
const email = ref('')
const usuarioAtual = ref(null)
const mensagem = ref(null)

const saveIcon = save
const arrowBackIcon = arrowBack

onMounted(() => {
  const usuario = obterUsuarioAtual()
  if (usuario) {
    usuarioAtual.value = usuario
    name.value = usuario.name
    email.value = usuario.email
  }
})

const handleSalvar = async () => {
  const sucesso = atualizarPerfil(name.value, email.value)

  if (sucesso) {
    mensagem.value = {
      tipo: 'sucesso',
      texto: 'Perfil atualizado com sucesso!'
    }
    const toast = await toastController.create({
      message: 'Perfil atualizado com sucesso!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    setTimeout(() => {
      mensagem.value = null
    }, 3000)
  } else {
    mensagem.value = {
      tipo: 'erro',
      texto: 'Erro ao atualizar perfil'
    }
    const toast = await toastController.create({
      message: 'Erro ao atualizar perfil',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}

const voltarAlbum = () => {
  router.push('/album')
}
</script>
```

---

## 4. APP.VUE

### 4.1 - `App.vue`

```vue
<template>
  <ion-app>
    <router-view />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from '@ionic/vue'
</script>

<style scoped>
:deep(.ion-page) {
  background: #f5f5f5;
}
</style>
```

---

## 5. ROUTER

### 5.1 - `router/index.ts`

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPasswordView.vue')
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('../views/AlbumView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/album'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, obterUsuarioAtual } = useAuth()

  if (to.meta.requiresAuth) {
    obterUsuarioAtual()
    if (isAuthenticated.value) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
```

---

## 6. MAIN.TS

### 6.1 - `main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import './style.css'

const app = createApp(App)
  .use(IonicVue)
  .use(router)

router.isReady().then(() => {
  app.mount('#app')
})
```

---

## 7. PACKAGE.JSON (DEPENDÊNCIAS)

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "@ionic/vue": "^7.0.0",
    "ionicons": "^7.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

---

## 8. ESTRUTURA DE PASTAS

```
src/
├── components/
│   ├── AppHeader.vue
│   ├── LoginForm.vue
│   ├── RegisterForm.vue
│   ├── ResetPasswordForm.vue
│   ├── StickerCard.vue
│   └── StickerList.vue
├── composables/
│   ├── useAuth.ts
│   └── useAlbum.ts
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── ResetPasswordView.vue
│   ├── AlbumView.vue
│   └── ProfileView.vue
├── router/
│   └── index.ts
├── App.vue
├── main.ts
└── style.css
```

---

## 9. DADOS DE TESTE

**Usuário pré-cadastrado para teste:**

- **E-mail:** teste@email.com
- **Senha:** 123456

---

## COMPONENTES IONIC UTILIZADOS

Este projeto utiliza os seguintes componentes do Ionic:

- **IonPage**: Estrutura base de cada página
- **IonContent**: Conteúdo scrollável
- **IonHeader/IonToolbar**: Cabeçalho da aplicação
- **IonTitle**: Título da página
- **IonCard/IonCardHeader/IonCardTitle/IonCardContent**: Cartões de conteúdo
- **IonItem/IonLabel/IonInput**: Campos de formulário
- **IonButton**: Botões interativos
- **IonIcon**: Ícones do Ionicons
- **IonSegment/IonSegmentButton**: Seletor de abas
- **IonSearchbar**: Barra de pesquisa
- **IonGrid/IonRow/IonCol**: Sistema de grid responsivo
- **IonBadge**: Badges de status
- **IonProgressBar**: Barra de progresso
- **IonText**: Texto com cores
- **IonNote**: Notas informativas
- **IonPopover**: Menu flutuante
- **IonList**: Listas de itens
- **IonItemDivider**: Divisor de itens
- **IonImg**: Imagens otimizadas
- **toastController**: Notificações toast
- **alertController**: Diálogos de alerta

---

## NOTAS IMPORTANTES

1. Este projeto usa **Vue 3 com Composition API** e **TypeScript**.
2. Os dados são armazenados em **memória (ref)** e no **localStorage** para persistência básica.
3. O **Ionic Framework** fornece componentes responsivos e nativos.
4. Todos os componentes são **reutilizáveis** e **composables** encapsulam a lógica de negócio.
5. A **autenticação** é simulada em memória. Para produção, integre com um backend real.
6. Os **ícones** vêm da biblioteca **Ionicons**.
7. A aplicação é **totalmente responsiva** e funciona em desktop, tablet e mobile.

Copie os códigos conforme sua estrutura de projeto!
