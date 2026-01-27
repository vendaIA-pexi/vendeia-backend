const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   MEMÓRIA SIMPLES (GLOBAL)
========================= */
let memoria = {
  ultimaFrase: null,
  aguardandoTextoImagem: false,
  aguardandoConfirmacaoImagem: false
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
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
  res.send("🤖 VendeIA estilo ChatGPT rodando");
});

/* =========================
   ROTA CHAT
========================= */
app.post("/chat", (req, res) => {
  try {
    const mensagemRaw = req.body?.mensagem;

    if (typeof mensagemRaw !== "string") {
      return responderTexto(res, "Pode escrever o que você quiser 🙂");
    }

    const mensagem = mensagemRaw.trim();
    if (!mensagem) {
      return responderTexto(res, "Pode escrever o que você quiser 🙂");
    }

    const texto = mensagem.toLowerCase();

    /* =========================
       CONFIRMAÇÃO DE IMAGEM
    ========================= */
    const confirmouImagem =
      memoria.aguardandoConfirmacaoImagem &&
      (
        mensagem === "__CONFIRMAR_IMAGEM__" ||
        palavrasConfirmacao.some(p =>
          new RegExp(`\\b${p}\\b`).test(texto)
        )
      );

    if (confirmouImagem) {
      if (!memoria.ultimaFrase) {
        resetarFluxo();
        memoria.aguardandoTextoImagem = true;
        return responderTexto(
          res,
          "Beleza 😄 Qual texto você quer transformar em imagem?"
        );
      }

      const frase = memoria.ultimaFrase;
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
        `Perfeito 👌 Posso transformar isso em imagem:\n\n"${mensagem}"\n\nQuer que eu gere agora?`
      );
    }

    /* =========================
       PEDIDO DE IMAGEM
    ========================= */
    if (/\b(imagem|gerar imagem|criar imagem)\b/.test(texto)) {
      if (!memoria.ultimaFrase) {
        resetarFluxo();
        memoria.aguardandoTextoImagem = true;
        return responderTexto(
          res,
          "Show 😄 Qual texto você quer transformar em imagem?"
        );
      }

      const frase = memoria.ultimaFrase;
      memoria.ultimaFrase = null;
      resetarFluxo();

      return responderImagem(res, frase);
    }

    /* =========================
       CRIAÇÃO DE TEXTO
    ========================= */
    if (/\b(frase|texto|mensagem|motivação|anúncio|legenda)\b/.test(texto)) {
      const frase = gerarFrase();
      memoria.ultimaFrase = frase;
      resetarFluxo();

      return responderTexto(
        res,
        `🔥 Criei isso pra você:\n\n"${frase}"\n\nQuer transformar em imagem, anúncio ou legenda?`
      );
    }

    /* =========================
       CONVERSA NORMAL
    ========================= */
    resetarFluxo();
    return responderTexto(res, gerarRespostaHumana());

  } catch (err) {
    console.error("Erro no /chat:", err);
    resetarFluxo();
    return responderTexto(res, "❌ Algo deu errado. Tenta de novo.");
  }
});

/* =========================
   FUNÇÕES AUXILIARES
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
    imagem: `https://image.pollinations.ai/prompt/${encodeURIComponent(
      "arte moderna, fundo bonito, tipografia forte, frase: " + texto
    )}`
  });
}

function gerarFrase() {
  const frases = [
    "O sucesso não é sorte, é consistência aplicada todos os dias.",
    "Quem age enquanto os outros duvidam chega mais longe.",
    "Disciplina é fazer mesmo quando a motivação não aparece.",
    "Resultados vêm de quem executa, não de quem só planeja.",
    "Pequenas ações diárias criam grandes resultados."
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

function gerarRespostaHumana() {
  const respostas = [
    "Boa pergunta 👀 Quer que eu explique de forma simples ou direta?",
    "Posso te ajudar com isso sim. Quer um exemplo prático?",
    "Isso depende do objetivo. Me conta um pouco mais.",
    "Interessante isso 🤔 Você quer algo mais técnico ou mais simples?",
    "Se quiser, posso transformar isso em texto, imagem ou explicação."
  ];
  return respostas[Math.floor(Math.random() * respostas.length)];
}

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 VendeIA rodando na porta ${PORT}`);
});
