import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { ref, computed } from "vue";

const dbName = 'bancoFigurinhas'
let db: SQLiteDBConnection | null = null
let initialized = false
const sqLiteConnection = new SQLiteConnection(CapacitorSQLite)

interface Sticker {
  id: string;
  nome: string;
  foto: string;
  coletada: boolean;
}

async function ensureDatabase() {
  if (initialized && db) {
    return
  }

  if (!db) {
    db = await sqLiteConnection.createConnection(dbName, false, 'no-encryption', 1, false)
  }

  await db.open()
  await db.execute(`CREATE TABLE IF NOT EXISTS figurinhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    foto TEXT,
    coletada BOOLEAN NOT NULL DEFAULT FALSE
    );`,
  )
  await figurinhasPadrão

  initialized = true
}

const figurinhasPadrao: Omit<Sticker, "coletada">[] = [
  {
    id: "1",
    nome: "Tung Tung Tung Sahur",
    foto: "https://upload.wikimedia.org/wikipedia/commons/1/19/Tung_tung_tung_sahur.webp",
  },
  {
    id: "2",
    nome: "Bombardino Crocodilo",
    foto: "https://i1.sndcdn.com/artworks-AtoLRjVHCEez03hb-gesM5Q-t1080x1080.png",
  },
  {
    id: "3",
    nome: "Cappuccino Assassino",
    foto: "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/37d090671a35a113f5b4ea402ea1029e2ce2277e2f18e8602bf0b6782115ebcd.jpeg",
  },
  {
    id: "4",
    nome: "Madin din din dun",
    foto: "https://media.sketchfab.com/models/4d90fef723fd4b18aea3ab253c013eb9/thumbnails/fe22f169e19c4425af392cf5ba8be48c/e7326c9539f643bb888f6aa0fc3f3ee2.jpeg",
  },
  {
    id: "5",
    nome: "Ballerina Cappuccina",
    foto: "https://i.scdn.co/image/ab67616d00001e020b0e45520decafc6e51cdadc",
  },
  {
    id: "6",
    nome: "Brr brr patapim",
    foto: "https://i.scdn.co/image/ab67616d0000b273c98461c1dd6cc2d167f891ed",
  },
  {
    id: "7",
    nome: "Tralalero Tralala",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUl5kAsvGQPMYZnb3m2HsJYbXJbxW7PhnVrg&s",
  },
  {
    id: "8",
    nome: "Chimpanzini Bananini",
    foto: "https://m.media-amazon.com/images/I/61-fYExJ09L._AC_UF350,350_QL50_.jpg",
  },
  {
    id: "9",
    nome: "Frigo Camello Buffo Fardelo",
    foto: "https://i.scdn.co/image/ab67616d0000b27318fd8ca56e26196f90a03226",
  },
  {
    id: "10",
    nome: "Boneka Ambalabu",
    foto: "https://fbi.cults3d.com/uploaders/25344900/illustration-file/1490d2dd-b7f3-4ff0-a99a-9954fbe1fb59/hq2.jpg",
  },
]

function getDb() {
  if (!db) {
    throw new Error('Banco nao inicializado')
  }
  return db
}


export async function toggleColetada(id: Number) {
  await ensureDatabase()

  const query = `
  UPDATE figurinhas
  SET coletada = NOT coletada
  WHERE id = ?
  `
  await getDb().run(query, [id])
}


const figurinhas = ref<Sticker[]>([
  {
    id: "1",
    nome: "Tung Tung Sahur",
    raridade: "Brasil",
    foto: "https://upload.wikimedia.org/wikipedia/commons/1/19/Tung_tung_tung_sahur.webp",
    coletada: true,
  },
  {
    id: "2",
    nome: "Bombardino Crocodilo",
    raridade: "Brasil",
    foto: "https://i1.sndcdn.com/artworks-AtoLRjVHCEez03hb-gesM5Q-t1080x1080.png",
    coletada: false,
  },
  {
    id: "3",
    nome: "Cappuccino Assassino",
    raridade: "Brasil",
    foto: "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/37d090671a35a113f5b4ea402ea1029e2ce2277e2f18e8602bf0b6782115ebcd.jpeg",
    coletada: true,
  },
  {
    id: "4",
    nome: "Madin din din dun",
    raridade: "Portugal",
    foto: "https://media.sketchfab.com/models/4d90fef723fd4b18aea3ab253c013eb9/thumbnails/fe22f169e19c4425af392cf5ba8be48c/e7326c9539f643bb888f6aa0fc3f3ee2.jpeg",
    coletada: false,
  },
  {
    id: "5",
    nome: "Ballerina Cappuccina",
    raridade: "Portugal",
    foto: "https://i.scdn.co/image/ab67616d00001e020b0e45520decafc6e51cdadc",
    coletada: true,
  },
  {
    id: "6",
    nome: "Brr brr patapim",
    raridade: "Argentina",
    foto: "https://i.scdn.co/image/ab67616d0000b273c98461c1dd6cc2d167f891ed",
    coletada: true,
  },
  {
    id: "7",
    nome: "Tralalero Tralala",
    raridade: "Argentina",
    foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUl5kAsvGQPMYZnb3m2HsJYbXJbxW7PhnVrg&s",
    coletada: false,
  },
  {
    id: "8",
    nome: "Chimpanzini Bananini",
    raridade: "Polônia",
    foto: "https://m.media-amazon.com/images/I/61-fYExJ09L._AC_UF350,350_QL50_.jpg",
    coletada: false,
  },
  {
    id: "9",
    nome: "Frigo Camello Buffo Fardelo",
    raridade: "Alemanha",
    foto: "https://i.scdn.co/image/ab67616d0000b27318fd8ca56e26196f90a03226",
    coletada: true,
  },
  {
    id: "10",
    nome: "Boneka Ambalabu",
    raridade: "França",
    foto: "https://fbi.cults3d.com/uploaders/25344900/illustration-file/1490d2dd-b7f3-4ff0-a99a-9954fbe1fb59/hq2.jpg",
    coletada: false,
  },
]);

const filtroAtual = ref<"todas" | "coletadas" | "pendentes">("todas");
const termoPesquisa = ref("");

const figurinhasFiltradas = computed(() => {
  let resultado = figurinhas.value;

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

const totalFigurinhas = computed(() => figurinhas.value.length);
const figurinhasColetadas = computed(
  () => figurinhas.value.filter((f) => f.coletada).length,
);
const percentualCompleto = computed(() => {
  return Math.round((figurinhasColetadas.value / totalFigurinhas.value) * 100);
});

export function useAlbum() {
  const obterTodasFigurinhas = () => figurinhas.value;

  const alternarColetada = (id: string) => {
    const figurinha = figurinhas.value.find((f) => f.id === id);
    if (figurinha) {
      figurinha.coletada = !figurinha.coletada;
    }
  };

  const pesquisar = (termo: string) => {
    termoPesquisa.value = termo;
  };

  const definirFiltro = (filtro: "todas" | "coletadas" | "pendentes") => {
    filtroAtual.value = filtro;
  };

  return {
    figurinhas,
    figurinhasFiltradas,
    filtroAtual,
    termoPesquisa,
    totalFigurinhas,
    figurinhasColetadas,
    percentualCompleto,
    obterTodasFigurinhas,
    alternarColetada,
    pesquisar,
    definirFiltro,
  };
}
