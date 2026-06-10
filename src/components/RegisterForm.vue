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
      duration: 1500,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    
    // Aguarda o toast desaparecer antes de redirecionar
    await new Promise(resolve => setTimeout(resolve, 1600))
    
    // Redireciona para o álbum
    await router.push('/album')
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