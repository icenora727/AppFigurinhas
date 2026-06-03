import { ref, computed } from "vue";

interface Sticker {
  id: string;
  nome: string;
  selecao: string;
  foto: string;
  coletada: boolean;
}

const figurinhas = ref<Sticker[]>([
  {
    id: "1",
    nome: "Neymar",
    selecao: "Brasil",
    foto: "https://via.placeholder.com/200?text=Neymar",
    coletada: true,
  },
  {
    id: "2",
    nome: "Vinicius Jr",
    selecao: "Brasil",
    foto: "https://via.placeholder.com/200?text=Vinicius",
    coletada: false,
  },
  {
    id: "3",
    nome: "Rodrygo",
    selecao: "Brasil",
    foto: "https://via.placeholder.com/200?text=Rodrygo",
    coletada: true,
  },
  {
    id: "4",
    nome: "Cristiano Ronaldo",
    selecao: "Portugal",
    foto: "https://via.placeholder.com/200?text=CR7",
    coletada: false,
  },
  {
    id: "5",
    nome: "Bruno Fernandes",
    selecao: "Portugal",
    foto: "https://via.placeholder.com/200?text=Bruno",
    coletada: true,
  },
  {
    id: "6",
    nome: "Messi",
    selecao: "Argentina",
    foto: "https://via.placeholder.com/200?text=Messi",
    coletada: true,
  },
  {
    id: "7",
    nome: "De Paul",
    selecao: "Argentina",
    foto: "https://via.placeholder.com/200?text=DePaul",
    coletada: false,
  },
  {
    id: "8",
    nome: "Lewandowski",
    selecao: "Polônia",
    foto: "https://via.placeholder.com/200?text=Lewa",
    coletada: false,
  },
  {
    id: "9",
    nome: "Müller",
    selecao: "Alemanha",
    foto: "https://via.placeholder.com/200?text=Muller",
    coletada: true,
  },
  {
    id: "10",
    nome: "Mbappé",
    selecao: "França",
    foto: "https://via.placeholder.com/200?text=Mbappe",
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
        f.selecao.toLowerCase().includes(termo),
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

  const marcarColetada = (id: string) => {
    const figurinha = figurinhas.value.find((f) => f.id === id);
    if (figurinha) {
      figurinha.coletada = true;
    }
  };

  const marcarPendente = (id: string) => {
    const figurinha = figurinhas.value.find((f) => f.id === id);
    if (figurinha) {
      figurinha.coletada = false;
    }
  };

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

  const obterFigurinhasPorSelecao = (selecao: string) => {
    return figurinhas.value.filter((f) => f.selecao === selecao);
  };

  const obterSelecoes = () => {
    const selecoes = new Set(figurinhas.value.map((f) => f.selecao));
    return Array.from(selecoes).sort();
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
    marcarColetada,
    marcarPendente,
    alternarColetada,
    pesquisar,
    definirFiltro,
    obterFigurinhasPorSelecao,
    obterSelecoes,
  };
}
