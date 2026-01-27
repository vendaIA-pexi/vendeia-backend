const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   MEMÓRIA SIMPLES (GLOBAL)
========================= */
let ultimaFrase = null;

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend VendeIA rodando");
});

/* =========================
   ROTA CHAT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const mensagem = req.body?.mensagem?.trim();

    if (!mensagem) {
      return res.json({
        tipo: "texto",
        resposta: "🤔 Não entendi. Pode escrever de novo?"
      });
    }

    const texto = mensagem.toLowerCase();

    /* =========================
       CONFIRMAÇÃO DE IMAGEM
    ========================= */
    if (mensagem === "__CONFIRMAR_IMAGEM__") {
      if (!ultimaFrase) {
        return res.json({
          tipo: "texto",
          resposta: "⚠️ Primeiro crie um texto antes de gerar a imagem."
        });
      }

      return res.json({
        tipo: "imagem",
        imagem: gerarImagem(ultimaFrase)
      });
    }

    /* =========================
       PEDIDO DIRETO DE IMAGEM
    ========================= */
    if (texto.includes("imagem") && ultimaFrase) {
      return res.json({
        tipo: "imagem",
        imagem: gerarImagem(ultimaFrase)
      });
    }

    /* =========================
       CRIAÇÃO DE TEXTO / FRASE
    ========================= */
    if (
      texto.includes("frase") ||
      texto.includes("texto") ||
      texto.includes("mensagem") ||
      texto.includes("motivação")
    ) {
      ultimaFrase = gerarFrase();

      return res.json({
        tipo: "texto",
        resposta:
          `🔥 Criei isso pra você:\n\n` +
          `"${ultimaFrase}"\n\n` +
          `Quer transformar em imagem, anúncio ou legenda?`
      });
    }

    /* =========================
       CONVERSA PADRÃO
    ========================= */
    return res.json({
      tipo: "texto",
      resposta:
        "🤖 Posso criar textos, frases motivacionais ou gerar imagens.\n\n" +
        "Exemplos:\n" +
        "• Crie uma frase motivacional\n" +
        "• Quero um texto de vendas\n" +
        "• Transformar em imagem"
    });

  } catch (err) {
    console.error(err);
    return res.json({
      tipo: "texto",
      resposta: "❌ Algo deu errado. Tenta de novo."
    });
  }
});

/* =========================
   FUNÇÕES AUXILIARES
========================= */
function gerarFrase() {
  const frases = [
    "O sucesso não é sorte, é consistência aplicada todos os dias.",
    "Quem começa pequeno hoje constrói algo grande amanhã.",
    "Disciplina vence motivação quando a vontade falha.",
    "Resultados vêm de quem age mesmo com medo.",
    "A diferença entre sonhar e vencer é executar."
  ];

  return frases[Math.floor(Math.random() * frases.length)];
}

function gerarImagem(texto) {
  // placeholder visual bonito (troca depois por IA real)
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    "arte motivacional com fundo moderno e a frase: " + texto
  )}`;
}

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 VendeIA rodando na porta ${PORT}`);
});
