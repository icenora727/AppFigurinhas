import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { ref, computed, onMounted, onUnmounted } from 'vue'
 
const dbName = 'banco'
let db: SQLiteDBConnection | null = null
let initialized = false
const sqLiteConnection = new SQLiteConnection(CapacitorSQLite)

interface UsuarioDB {
  id: number;
  nome: string;
  login: string;
  senha: string;
}

interface UsuarioAtual {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface Sticker {
  id: number;
  nome: string;
  foto: string;
  raridade: string;
  coletada: boolean;
}

interface AchievementDB {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  ordem: number;
}

interface AchievementView extends AchievementDB {
  desbloqueada: boolean;
  desbloqueadaEm: string | null;
}

const ACHIEVEMENTS_UPDATED_EVENT = 'appfigurinhas:achievements-updated'

function notificarConquistasAtualizadas() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(ACHIEVEMENTS_UPDATED_EVENT))
}

async function ensureDatabase() {
  if (initialized && db) {
    return
  }

  if (!db) {
    db = await sqLiteConnection.createConnection(dbName, false, 'no-encryption', 1, false)
  }

  await db.open()
  await db.execute(`CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT
    );`,
  )

  await db.execute(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    login TEXT NOT NULL UNIQUE,
    senha TEXT
    );`,
  )

  await db.execute(`CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    ordem INTEGER NOT NULL
    );`,
  )

  await db.execute(`CREATE TABLE IF NOT EXISTS user_achievements (
    usuario_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    desbloqueada_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, achievement_id)
    );`,
  )

  await garantirConquistasPadrao()

  await db.execute(`CREATE TABLE IF NOT EXISTS figurinhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    foto TEXT,
    raridade TEXT,
    coletada BOOLEAN NOT NULL DEFAULT FALSE
    );`,
  )

  const schemaInfo = await getDb().query(`PRAGMA table_info(figurinhas)`)
  const hasColetadaColumn = (schemaInfo.values || []).some(
    (column) => column.name === 'coletada',
  )

  if (!hasColetadaColumn) {
    await getDb().execute(
      `ALTER TABLE figurinhas ADD COLUMN coletada BOOLEAN NOT NULL DEFAULT FALSE`,
    )
  }

  await db.execute(`CREATE TABLE IF NOT EXISTS figurinhas_usuario (
    usuario_id INTEGER NOT NULL,
    figurinha_id INTEGER NOT NULL,
    coletada BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (usuario_id, figurinha_id)
    );`,
  )

  await removerConquistasObsoletas()


  const quantidadeFig = await getDb().query(
    "SELECT COUNT(*) as total FROM figurinhas",
  );

  if ((quantidadeFig.values?.[0].total ?? 0) === 0) {
    for (const figurinha of figurinhasPadrao) {
      await getDb().run(
        `INSERT INTO figurinhas(id, nome, foto, raridade, coletada)
        VALUES (?,?,?,?,FALSE)`,
        [figurinha.id, figurinha.nome, figurinha.foto, figurinha.raridade],
      );
    }
  }

  initialized = true
}

function getDb() {
  if (!db) {
    throw new Error('Banco de dados ainda não inicializado')
  }
  return db
}

function obterUsuarioAtualSalvo() {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const armazenado = localStorage.getItem('currentUser')
  if (!armazenado) {
    return null
  }

  try {
    return JSON.parse(armazenado) as UsuarioAtual
  } catch {
    return null
  }
}

export async function initDatabase() {
  try {
    await ensureDatabase()
  } catch (error) {
    console.error('Erro ao iniciar DB', error)
    throw error
  }
}

// ======================= USUARIO E CONTATO ==============================

export async function addUsuario(
  nome: string,
  login: string,
  senha: string
) {
  await ensureDatabase()
  const query = 'INSERT INTO usuarios (nome, login, senha) VALUES (?, ?, ?);'
  await getDb().run(query, [nome, login, senha])
}

export async function findUsuarioByLogin(login: string) {
  await ensureDatabase()
  const result = await getDb().query(
    'SELECT id, nome, login, senha FROM usuarios WHERE login = ? COLLATE NOCASE LIMIT 1',
    [login],
  )
  return (result.values?.[0] as UsuarioDB | undefined) ?? null
}

export async function findUsuarioById(id: number) {
  await ensureDatabase()
  const result = await getDb().query(
    'SELECT id, nome, login, senha FROM usuarios WHERE id = ? LIMIT 1',
    [id],
  )
  return (result.values?.[0] as UsuarioDB | undefined) ?? null
}

export async function updateUsuario(nome:string, login:string, senha:string, id: number) {
  await ensureDatabase()
  const query = `UPDATE usuarios SET nome = ?, login = ?, senha = ? WHERE id = ?`
  await getDb().run(query, [nome, login, senha, id])
}

export async function realizarLogin(email: string, senha: string) {
  await ensureDatabase()
  const query = `SELECT id, nome, login, senha FROM usuarios WHERE login = ? COLLATE NOCASE AND senha = ? LIMIT 1`
  const result = await getDb().query(query, [email, senha])
  return (result.values?.[0] as UsuarioDB | undefined) ?? null
}

export async function resetarSenhaUsuario(login: string, novaSenha: string) {
  await ensureDatabase()
  const query = `UPDATE usuarios SET senha = ? WHERE login = ?`
  const result = await getDb().run(query, [novaSenha, login])
  return (result.changes?.changes ?? 0) > 0
}

export async function addContato(nome: string, email: string, telefone: string) {
  await ensureDatabase()
  const query = 'INSERT INTO contatos (nome, email, telefone) VALUES (?, ?, ?);'
  await getDb().run(query, [nome, email, telefone])
}

export async function listContatos(){
  await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM contatos;`)
    return result.values || []
  }

export async function deleteContatoById(id: number) {
  await ensureDatabase()
  const query = `DELETE FROM contatos where id = ?`;
  return await getDb().run(query,[id]);
}

export async function updateContato(id: number, nome: string, email: string, telefone: string) {
  await ensureDatabase()
  const query = `UPDATE contatos SET nome = ?, email = ?, telefone = ? WHERE id = ?;`
  await getDb().run(query, [nome, email, telefone, id])
}

export async function findContatoById(id:number) {
  await ensureDatabase()
  const query = `SELECT * FROM contatos where id = ?`
  const result = await getDb().query(query,[id])
  return result.values || []
}

// ======================= FIGURINHAS ==============================

const figurinhasPadrao: Omit<Sticker, "coletada">[] = [
  {
    id: 1,
    nome: "Tung Tung Tung Sahur",
    foto: "https://upload.wikimedia.org/wikipedia/commons/1/19/Tung_tung_tung_sahur.webp",
    raridade: "secreto"
  },
  {
    id: 2,
    nome: "Bombardino Crocodilo",
    foto: "https://i1.sndcdn.com/artworks-AtoLRjVHCEez03hb-gesM5Q-t1080x1080.png",
    raridade: "comum"
  },
  {
    id: 3,
    nome: "Cappuccino Assassino",
    foto: "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/37d090671a35a113f5b4ea402ea1029e2ce2277e2f18e8602bf0b6782115ebcd.jpeg",
    raridade: "comum"
  },
  {
    id: 4,
    nome: "Madin din din dun",
    foto: "https://media.sketchfab.com/models/4d90fef723fd4b18aea3ab253c013eb9/thumbnails/fe22f169e19c4425af392cf5ba8be48c/e7326c9539f643bb888f6aa0fc3f3ee2.jpeg",
    raridade: "raro"
  },
  {
    id: 5,
    nome: "Ballerina Cappuccina",
    foto: "https://i.scdn.co/image/ab67616d00001e020b0e45520decafc6e51cdadc",
    raridade: "comum"
  },
  {
    id: 6,
    nome: "Brr brr patapim",
    foto: "https://i.scdn.co/image/ab67616d0000b273c98461c1dd6cc2d167f891ed",
    raridade: "rara"
  },
  {
    id: 7,
    nome: "Tralalero Tralala",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUl5kAsvGQPMYZnb3m2HsJYbXJbxW7PhnVrg&s",
    raridade: "lendario"
  },
  {
    id: 8,
    nome: "Chimpanzini Bananini",
    foto: "https://m.media-amazon.com/images/I/61-fYExJ09L._AC_UF350,350_QL50_.jpg",
    raridade: "comum"
  },
  {
    id: 9,
    nome: "Frigo Camello Buffo Fardelo",
    foto: "https://i.scdn.co/image/ab67616d0000b27318fd8ca56e26196f90a03226",
    raridade: "raro"
  },
  {
    id: 10,
    nome: "Boneka Ambalabu",
    foto: "https://fbi.cults3d.com/uploaders/25344900/illustration-file/1490d2dd-b7f3-4ff0-a99a-9954fbe1fb59/hq2.jpg",
    raridade: "comum"
  },
];

const conquistasPadrao: Omit<AchievementDB, 'id'>[] = [
  {
    codigo: 'primeira-figurinha',
    nome: 'Primeira Figurinha',
    descricao: 'Desbloqueie ao coletar a primeira figurinha do brainrot.',
    ordem: 1,
  },
  {
    codigo: 'iniciante',
    nome: 'Iniciante',
    descricao: 'Colete 3 figurinhas.',
    ordem: 2,
  },
  {
    codigo: 'colecionador',
    nome: 'Colecionador',
    descricao: 'Colete 5 figurinhas.',
    ordem: 3,
  },
  {
    codigo: 'album-em-construcao',
    nome: 'Álbum em Progresso',
    descricao: 'Colete 7 figurinhas.',
    ordem: 4,
  },
  {
    codigo: 'cacador-de-raras',
    nome: 'Caçador de Raras',
    descricao: 'Colete 3 figurinhas raras.',
    ordem: 5,
  },
  {
    codigo: 'especialista-em-raras',
    nome: 'Especialista nas Raras',
    descricao: 'Colete 5 figurinhas raras.',
    ordem: 6,
  },
  {
    codigo: 'campeao-dos-brainrots',
    nome: 'Campeão dos Brainrots',
    descricao: 'Complete 100% do álbum.',
    ordem: 7,
  },
]

const codigosConquistasAtuais = conquistasPadrao.map((conquista) => conquista.codigo)

const todasFig = ref<Sticker[]>([]);

async function garantirFigurinhasDoUsuario(usuarioId: number) {
  const existentes = await getDb().query(
    'SELECT COUNT(*) as total FROM figurinhas_usuario WHERE usuario_id = ?',
    [usuarioId],
  )

  if ((existentes.values?.[0].total ?? 0) > 0) {
    return
  }

  const figurinhasLegadas = await getDb().query(
    'SELECT id, COALESCE(coletada, FALSE) AS coletada FROM figurinhas ORDER BY id',
  )

  const valoresLegados = figurinhasLegadas.values || []

  for (const figurinha of valoresLegados) {
    await getDb().run(
      `INSERT INTO figurinhas_usuario(usuario_id, figurinha_id, coletada) VALUES (?, ?, ?)`,
      [usuarioId, figurinha.id, figurinha.coletada ? 1 : 0],
    )
  }

  if (valoresLegados.some((figurinha) => figurinha.coletada)) {
    await getDb().run('UPDATE figurinhas SET coletada = FALSE')
  }
}

async function garantirConquistasPadrao() {
  for (const conquista of conquistasPadrao) {
    await getDb().run(
      `INSERT OR IGNORE INTO achievements(codigo, nome, descricao, ordem)
      VALUES (?, ?, ?, ?)`,
      [conquista.codigo, conquista.nome, conquista.descricao, conquista.ordem],
    )
  }
}

async function removerConquistasObsoletas() {
  if (codigosConquistasAtuais.length === 0) {
    return
  }

  const placeholders = codigosConquistasAtuais.map(() => '?').join(', ')

  await getDb().run(
    `DELETE FROM user_achievements
     WHERE achievement_id IN (
       SELECT id FROM achievements WHERE codigo NOT IN (${placeholders})
     )`,
    codigosConquistasAtuais,
  )

  await getDb().run(
    `DELETE FROM achievements WHERE codigo NOT IN (${placeholders})`,
    codigosConquistasAtuais,
  )
}

async function contarFigurinhasColetadas(usuarioId: number) {
  const resultado = await getDb().query(
    'SELECT COUNT(*) as total FROM figurinhas_usuario WHERE usuario_id = ? AND coletada = TRUE',
    [usuarioId],
  )

  return Number(resultado.values?.[0].total ?? 0)
}

async function contarFigurinhasRaras(usuarioId: number) {
  const resultado = await getDb().query(
    `SELECT COUNT(*) as total
    FROM figurinhas_usuario fu
    INNER JOIN figurinhas f ON f.id = fu.figurinha_id
    WHERE fu.usuario_id = ?
      AND fu.coletada = TRUE
      AND LOWER(f.raridade) IN ('raro', 'rara', 'lendario', 'lendário', 'secreto', 'secreta')`,
    [usuarioId],
  )

  return Number(resultado.values?.[0].total ?? 0)
}

async function contarPercentualAlbum(usuarioId: number) {
  const resultado = await getDb().query(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN coletada = TRUE THEN 1 ELSE 0 END) as coletadas
    FROM figurinhas_usuario
    WHERE usuario_id = ?`,
    [usuarioId],
  )

  const total = Number(resultado.values?.[0].total ?? 0)
  const coletadas = Number(resultado.values?.[0].coletadas ?? 0)

  if (total === 0) {
    return 0
  }

  return Math.round((coletadas * 100) / total)
}

async function sincronizarConquistasUsuario(usuarioId: number) {
  await garantirConquistasPadrao()

  const [quantidadeColetadas, quantidadeRaras, percentualAlbum] = await Promise.all([
    contarFigurinhasColetadas(usuarioId),
    contarFigurinhasRaras(usuarioId),
    contarPercentualAlbum(usuarioId),
  ])

  const conquistas = await getDb().query(
    'SELECT id, codigo, nome, descricao, ordem FROM achievements ORDER BY ordem ASC, id ASC',
  )

  for (const conquista of (conquistas.values || []) as AchievementDB[]) {
    const desbloqueada =
      (conquista.codigo === 'primeira-figurinha' && quantidadeColetadas >= 1) ||
      (conquista.codigo === 'iniciante' && quantidadeColetadas >= 3) ||
      (conquista.codigo === 'colecionador' && quantidadeColetadas >= 5) ||
      (conquista.codigo === 'album-em-construcao' && quantidadeColetadas >= 7) ||
      (conquista.codigo === 'cacador-de-raras' && quantidadeRaras >= 3) ||
      (conquista.codigo === 'especialista-em-raras' && quantidadeRaras >= 5) ||
      (conquista.codigo === 'album-quase-completo' && percentualAlbum >= 80) ||
      (conquista.codigo === 'campeao-dos-brainrots' && percentualAlbum >= 100)

    if (!desbloqueada) {
      continue
    }

    await getDb().run(
      `INSERT OR IGNORE INTO user_achievements(usuario_id, achievement_id, desbloqueada_em)
      VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [usuarioId, conquista.id],
    )
  }

  notificarConquistasAtualizadas()
}

async function listarConquistasDoUsuario(usuarioId: number) {
  await garantirConquistasPadrao()
  await sincronizarConquistasUsuario(usuarioId)

  const resultado = await getDb().query(
    `SELECT
      a.id,
      a.codigo,
      a.nome,
      a.descricao,
      a.ordem,
      CASE WHEN ua.usuario_id IS NULL THEN 0 ELSE 1 END AS desbloqueada,
      ua.desbloqueada_em AS desbloqueadaEm
    FROM achievements a
    LEFT JOIN user_achievements ua
      ON ua.achievement_id = a.id AND ua.usuario_id = ?
    ORDER BY a.ordem ASC, a.id ASC`,
    [usuarioId],
  )

  return (resultado.values || []) as AchievementView[]
}

async function carregarFigurinhas() {
  await ensureDatabase();

  const usuarioAtual = obterUsuarioAtualSalvo()

  if (!usuarioAtual) {
    const result = await getDb().query(
      'SELECT id, nome, foto, raridade, FALSE AS coletada FROM figurinhas ORDER BY id',
    )

    todasFig.value = (result.values as Sticker[]) || []
    return
  }

  await garantirFigurinhasDoUsuario(usuarioAtual.id)

  const result = await getDb().query(
    `SELECT 
      f.id,
      f.nome,
      f.foto,
      f.raridade,
      COALESCE(fu.coletada, FALSE) AS coletada
    FROM figurinhas f
    LEFT JOIN figurinhas_usuario fu
      ON fu.figurinha_id = f.id AND fu.usuario_id = ?
    ORDER BY f.id`,
    [usuarioAtual.id],
  )

  todasFig.value = (result.values as Sticker[]) || []
}

async function toggleColetada(id: number) {
  await ensureDatabase();

  const usuarioAtual = obterUsuarioAtualSalvo()
  if (!usuarioAtual) {
    return
  }

  await garantirFigurinhasDoUsuario(usuarioAtual.id)

  const query = `
  UPDATE figurinhas_usuario
  SET coletada = NOT coletada
  WHERE usuario_id = ? AND figurinha_id = ?
  `;

  await getDb().run(query, [usuarioAtual.id, id]);

  void sincronizarConquistasUsuario(usuarioAtual.id).catch((error) => {
    console.error('Erro ao sincronizar conquistas', error)
  })

  await carregarFigurinhas();
}

async function apenasColetar(id:number) {
  await ensureDatabase();

  const usuarioAtual = obterUsuarioAtualSalvo()
  if (!usuarioAtual) {
    return
  }

  await garantirFigurinhasDoUsuario(usuarioAtual.id)

  const query = `
  UPDATE figurinhas_usuario
  SET coletada = TRUE
  WHERE usuario_id = ? AND figurinha_id = ?
  `;

  await getDb().run(query, [usuarioAtual.id, id]);

  void sincronizarConquistasUsuario(usuarioAtual.id).catch((error) => {
    console.error('Erro ao sincronizar conquistas', error)
  })

  await carregarFigurinhas();
}

async function apenasDescoletar(id:number) {
  await ensureDatabase();

  const usuarioAtual = obterUsuarioAtualSalvo()
  if (!usuarioAtual) {
    return
  }

  await garantirFigurinhasDoUsuario(usuarioAtual.id)

  const query = `
  UPDATE figurinhas_usuario
  SET coletada = FALSE
  WHERE usuario_id = ? AND figurinha_id = ?
  `;

  await getDb().run(query, [usuarioAtual.id, id]);

  void sincronizarConquistasUsuario(usuarioAtual.id).catch((error) => {
    console.error('Erro ao sincronizar conquistas', error)
  })


  await carregarFigurinhas();
}

// ======================= PESQUISA E FILTRO ==============================

const filtroAtual = ref<"todas" | "coletadas" | "pendentes">("todas");
const termoPesquisa = ref("");

const figurinhasFiltradas = computed(() => {
  let resultado = [...todasFig.value];

  if (filtroAtual.value === "coletadas") {
    resultado = resultado.filter((f) => f.coletada);
  } else if (filtroAtual.value === "pendentes") {
    resultado = resultado.filter((f) => !f.coletada);
  }

  if (termoPesquisa.value) {
    const termo = termoPesquisa.value.toLowerCase();
    resultado = resultado.filter(
      (f) =>
        f.nome.toLowerCase().includes(termo) ||
        f.raridade.toLowerCase().includes(termo),
    );
  }

  return resultado;
});

const qtdTodasFig = computed(() => todasFig.value.length);

const qtdFigurinhasColetadas = computed(
  () => todasFig.value.filter(f => f.coletada).length
  )

const percentualCompleto = computed(() => {
  if (qtdTodasFig.value === 0) return 0;

  return Math.round(
    qtdFigurinhasColetadas.value * 100 / qtdTodasFig.value
  )
})

// ======================= EXPORT ==============================

export function useAlbum() {
  onMounted(async () => {
    await carregarFigurinhas();
  });


  const alternarColetada = async (id: number) => {
    await toggleColetada(id);
  };

  const marcarColetada = async (id: number) => {
    await apenasColetar(id);
  };

  const marcarPendente = async (id: number) => {
    await apenasDescoletar(id);
  };

  const pesquisar = (termo: string) => {
    termoPesquisa.value = termo;
  };

  const definirFiltro = (filtro: "todas" | "coletadas" | "pendentes") => {
    filtroAtual.value = filtro;
  };

  return {
    figurinhasFiltradas,
    filtroAtual,
    termoPesquisa,
    todasFig,
    qtdTodasFig,
    qtdFigurinhasColetadas,
    percentualCompleto,
    alternarColetada,
    marcarColetada,
    marcarPendente,
    pesquisar,
    definirFiltro,
  }
}

const conquistasUsuario = ref<AchievementView[]>([])

export function useConquistas() {
  const carregarConquistas = async () => {
    await ensureDatabase()

    const usuarioAtual = obterUsuarioAtualSalvo()
    if (!usuarioAtual) {
      conquistasUsuario.value = []
      return
    }

    conquistasUsuario.value = await listarConquistasDoUsuario(usuarioAtual.id)
  }

  onMounted(async () => {
    await carregarConquistas()
  })

  if (typeof window !== 'undefined') {
    const atualizarQuandoNotificado = () => {
      void carregarConquistas()
    }

    window.addEventListener(ACHIEVEMENTS_UPDATED_EVENT, atualizarQuandoNotificado)

    onUnmounted(() => {
      window.removeEventListener(ACHIEVEMENTS_UPDATED_EVENT, atualizarQuandoNotificado)
    })
  }

  const recarregarConquistas = async () => {
    await carregarConquistas()
  }

  const conquistasDesbloqueadas = computed(
    () => conquistasUsuario.value.filter((conquista) => conquista.desbloqueada).length,
  )

  const percentualConquistas = computed(() => {
    if (conquistasUsuario.value.length === 0) {
      return 0
    }

    return Math.round(
      (conquistasDesbloqueadas.value * 100) / conquistasUsuario.value.length,
    )
  })

  return {
    conquistasUsuario,
    conquistasDesbloqueadas,
    percentualConquistas,
    atualizarConquistas: recarregarConquistas,
  }
}