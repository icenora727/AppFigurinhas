import { computed, ref } from 'vue'
import {
  addUsuario,
  findUsuarioById,
  findUsuarioByLogin,
  realizarLogin,
  resetarSenhaUsuario,
  updateUsuario,
} from '@/services/database'

interface User {
  id: number
  name: string
  email: string
  password: string
}

function carregarUsuarioPersistido(): User | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const armazenado = localStorage.getItem('currentUser')
  if (!armazenado) {
    return null
  }

  try {
    return JSON.parse(armazenado) as User
  } catch {
    return null
  }
}

const currentUser = ref<User | null>(carregarUsuarioPersistido())
const isAuthenticated = computed(() => currentUser.value !== null)

function salvarUsuarioAtual(usuario: User | null) {
  if (typeof localStorage === 'undefined') {
    return
  }

  if (usuario) {
    localStorage.setItem('currentUser', JSON.stringify(usuario))
    return
  }

  localStorage.removeItem('currentUser')
}

function converterUsuarioBanco(usuario: { id: number; nome: string; login: string; senha: string }) {
  return {
    id: usuario.id,
    name: usuario.nome,
    email: usuario.login,
    password: usuario.senha,
  }
}

export function useAuth() {
  const login = async (email: string, password: string): Promise<boolean> => {
    const usuario = await realizarLogin(email, password)

    if (!usuario) {
      return false
    }

    currentUser.value = converterUsuarioBanco(usuario)
    salvarUsuarioAtual(currentUser.value)
    return true
  }

  const logout = () => {
    currentUser.value = null
    salvarUsuarioAtual(null)
  }

  const cadastrar = async (name: string, email: string, password: string): Promise<boolean> => {
    const usuarioExistente = await findUsuarioByLogin(email)
    if (usuarioExistente) {
      return false
    }

    await addUsuario(name, email, password)

    const novoUsuario = await findUsuarioByLogin(email)
    if (!novoUsuario) {
      return false
    }

    currentUser.value = converterUsuarioBanco(novoUsuario)
    salvarUsuarioAtual(currentUser.value)
    return true
  }

  const resetarSenha = async (email: string, novaSenha: string): Promise<boolean> => {
    if (novaSenha.length < 6) {
      return false
    }

    return await resetarSenhaUsuario(email, novaSenha)
  }

  const obterUsuarioAtual = () => {
    if (!currentUser.value) {
      currentUser.value = carregarUsuarioPersistido()
    }
    return currentUser.value
  }

  const atualizarPerfil = async (name: string, email: string): Promise<boolean> => {
    const usuarioAtual = obterUsuarioAtual()
    if (!usuarioAtual) {
      return false
    }

    const usuarioDb = await findUsuarioById(usuarioAtual.id)
    if (!usuarioDb) {
      return false
    }

    await updateUsuario(name, email, usuarioAtual.password, usuarioAtual.id)
    currentUser.value = {
      ...usuarioAtual,
      name,
      email,
    }
    salvarUsuarioAtual(currentUser.value)
    return true
  }

  return {
    login,
    logout,
    cadastrar,
    resetarSenha,
    obterUsuarioAtual,
    atualizarPerfil,
    isAuthenticated,
    currentUser,
  }
}
