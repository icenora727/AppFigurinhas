import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";
import { ref, computed, onMounted } from "vue";

const dbName = "bancoFigurinhas";
let db: SQLiteDBConnection | null = null;
let initialized = false;
const sqLiteConnection = new SQLiteConnection(CapacitorSQLite);

interface Sticker {
  id: number;
  nome: string;
  foto: string;
  raridade: string;
  coletada: boolean;
}

function getDb() {
  if (!db) {
    throw new Error("Banco nao inicializado");
  }
  return db;
}

async function ensureDatabase() {
  if (initialized && db) {
    return;
  }

  if (!db) {
    db = await sqLiteConnection.createConnection(
      dbName,
      false,
      "no-encryption",
      1,
      false,
    );
  }

  await db.open();
  await db.execute(`CREATE TABLE IF NOT EXISTS figurinhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    foto TEXT,
    raridade TEXT,
    coletada BOOLEAN NOT NULL DEFAULT FALSE
    );`);

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

  initialized = true;
}

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

const todasFig = ref<Sticker[]>([]);

async function carregarFigurinhas() {
  await ensureDatabase();

  const result = await getDb().query(
    "SELECT * FROM figurinhas ORDER BY id"
  );

  todasFig.value = (result.values as Sticker[]) || [];
}



async function toggleColetada(id: number) {
  await ensureDatabase();

  const query = `
  UPDATE figurinhas
  SET coletada = NOT coletada
  WHERE id = ?
  `;

  await getDb().run(query, [id]);

  await carregarFigurinhas();
}

async function apenasColetar(id:number) {
  await ensureDatabase();

  const query = `
  UPDATE figurinhas
  SET coletada = TRUE
  WHERE id = ?
  `;

  await getDb().run(query, [id]);

  await carregarFigurinhas();
}

async function apenasDescoletar(id:number) {
  await ensureDatabase();

  const query = `
  UPDATE figurinhas
  SET coletada = FALSE
  WHERE id = ?
  `;

  await getDb().run(query, [id]);

  await carregarFigurinhas();
}

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