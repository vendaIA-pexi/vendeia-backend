const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   CONFIG
========================= */
const MAX_FREE_MESSAGES = 5;

/* =========================
   MEMÓRIA GLOBAL (SIMPLES)
========================= */
let memoria = {
  mensagens: 0,
  ultimaFrase: null,
  aguardandoTextoImagem: false,
  aguardandoConfirmacaoImagem: false,
  perfil: "curioso",
  emocao: "neutro"
};

/* =========================
   HELPERS
========================= */
const palavrasConfirmacao = ["sim", "ok", "pode", "gera", "gerar", "manda"];

function resetarFluxo() {
  memoria.aguardandoTextoImagem = false;
  memoria.aguardandoConfirmacaoImagem = false;
}

/* =========================
   PERFIL PSICOLÓGICO
========================= */
function detectarPerfil(texto) {
  if (/preço|valor|comprar|pagar/i.test(texto)) return "comprador";
  if (/como funciona|detalhe|tecnico/i.test(texto)) return "tecnico";
  if (/rápido|agora|urgente/i.test(texto)) return "apressado";
  if (/talvez|não sei|pensar/i.test(texto)) return "indeciso";
  return "curioso";
}

/* =========================
   EMOÇÃO
========================= */
function detectarEmocao(texto) {
  if (/raiva|ódio|droga|frustrado/i.test(texto)) return "frustrado";
  if (/top|perfeito|amei|curti/i.test(texto)) return "empolgado";
  return "neutro";
}

/* =========================
   GATILHOS MENTAIS
========================= */
function gatilho(perfil) {
  const g = {
    comprador: "🔥 Últimas oportunidades hoje.",
    indeciso: "🤝 Posso te ajudar a decidir agora.",
    curioso: "👀 Pouca gente sabe disso.",
    tecnico: "🧠 Vou direto ao ponto.",
    apressado: "⏳ Vamos resolver isso rápido."
  };
  return g[perfil] || "";
}

/* =========================
   PAYWALL
========================= */
function verificarLimite(res) {
  memoria.mensagens++;

  if (memoria.mensagens > MAX_FREE_MESSAGES) {
    return responderTexto(
      res,
      "🚫 Você atingiu o limite grátis.\n💳 Libere o Premium para continuar."
    );
  }
  return null;
}

/* =========================
   ROTAS
========================= */
app.get("/", (req, res) => {
  res.json({
    app: "VendeIA",
    status: "online",
    modelo: "GPT-5.2",
    estilo: "IA vendedora"
  });
});

app.post("/chat", (req, res) => {
  try {
    const mensagemRaw = req.body?.mensagem;

    if (typeof mensagemRaw !== "string") {
      return responderTexto(res, "Pode escrever o que quiser 🙂");
    }

    const mensagem = mensagemRaw.trim();
    if (!mensagem) {
      return responderTexto(res, "Pode escrever o que quiser 🙂");
    }

    const texto = mensagem.toLowerCase();

    /* =========================
       LIMITE
    ========================= */
    const bloqueio = verificarLimite(res);
    if (bloqueio) return;

    /* =========================
       PERFIL + EMOÇÃO
    ========================= */
    memoria.perfil = detectarPerfil(texto);
    memoria.emocao = detectarEmocao(texto);

    /* =========================
       CONFIRMAÇÃO DE IMAGEM
    ========================= */
    const confirmouImagem =
      memoria.aguardandoConfirmacaoImagem &&
      (
        mensagem === "__CONFIRMAR_IMAGEM__" ||
        palavrasConfirmacao.some(p => new RegExp(`\\b${p}\\b`).test(texto))
      );

    if (confirmouImagem) {
      const frase = memoria.ultimaFrase || "Mensagem poderosa";
      memoria.ultimaFrase = null;
      resetarFluxo();
      return responderImagem(res, frase);
    }

    /* =========================
       TEXTO PARA IMAGEM
    ========================= */
    if (memoria.aguardandoTextoImagem) {
      memoria.ultimaFrase = mensagem;
      memoria.aguardandoTextoImagem = false;
      memoria.aguardandoConfirmacaoImagem = true;

      return responderTexto(
        res,
        `Perfeito 👌 Vou criar uma arte com:\n\n"${mensagem}"\n\nQuer gerar agora?`
      );
    }

    /* =========================
       PEDIDO DE IMAGEM
    ========================= */
    if (/\b(imagem|gerar imagem|criar imagem)\b/.test(texto)) {
      resetarFluxo();
      memoria.aguardandoTextoImagem = true;
      return responderTexto(res, "Qual texto você quer usar na arte?");
    }

    /* =========================
       TEXTO INTELIGENTE
    ========================= */
    if (/\b(frase|texto|anúncio|legenda|motivação)\b/.test(texto)) {
      const frase = gerarFrase();
      memoria.ultimaFrase = frase;
      resetarFluxo();

      return responderTexto(
        res,
        `${gatilho(memoria.perfil)}\n\n"${frase}"\n\nQuer transformar isso em imagem?`
      );
    }

    /* =========================
       CONVERSA NORMAL
    ========================= */
    resetarFluxo();
    return responderTexto(
      res,
      `${gatilho(memoria.perfil)}\n${gerarRespostaHumana()}`
    );

  } catch (err) {
    console.error("Erro no /chat:", err);
    resetarFluxo();
    return responderTexto(res, "❌ Algo deu errado. Tenta de novo.");
  }
});

/* =========================
   FUNÇÕES DE RESPOSTA
========================= */
function responderTexto(res, texto) {
  return res.json({
    tipo: "texto",
    resposta: texto
  });
}

function responderImagem(res, texto) {
  return res.json({
    tipo: "imagem",
    texto,
    imagem: `https://image.pollinations.ai/prompt/${encodeURIComponent(
      texto + ", arte moderna, fundo bonito, iluminação profissional, alta qualidade"
    )}`
  });
}

/* =========================
   CONTEÚDO
========================= */
function gerarFrase() {
  const frases = [
    "O sucesso não é sorte, é consistência diária.",
    "Quem executa enquanto outros duvidam sai na frente.",
    "Disciplina constrói resultados reais.",
    "Ação vence motivação.",
    "Pequenos passos geram grandes conquistas."
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

function gerarRespostaHumana() {
  const respostas = [
    "Boa pergunta 👀 Quer algo prático?",
    "Posso te ajudar com isso sim.",
    "Isso depende do seu objetivo.",
    "Quer que eu explique de forma simples?",
    "Se quiser, transformo isso em texto ou imagem."
  ];
  return respostas[Math.floor(Math.random() * respostas.length)];
}

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 VendeIA rodando na porta ${PORT}`);
});
