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
    email: 'a',
    password: 'a'
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
      localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('isAuthenticated')
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
    localStorage.setItem('isAuthenticated', 'true')
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
      const isAuth = localStorage.getItem('isAuthenticated')
      if (stored && isAuth === 'true') {
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