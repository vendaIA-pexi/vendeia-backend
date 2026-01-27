const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =========================
   MEMÓRIA SIMPLES (CHATGPT-LIKE)
========================= */
let memoria = {
  ultimaFrase: null,
  ultimoTopico: null
};

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
  res.send("🤖 VendeIA estilo ChatGPT rodando");
});

/* =========================
   ROTA CHAT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const mensagem = req.body?.mensagem?.trim();

    if (!mensagem) {
      return responderTexto(res, "Pode escrever o que você quer 🙂");
    }

    const texto = mensagem.toLowerCase();

    /* =========================
       CONFIRMAÇÃO DE IMAGEM
    ========================= */
    if (mensagem === "__CONFIRMAR_IMAGEM__") {
      if (!memoria.ultimaFrase) {
        return responderTexto(
          res,
          "Antes preciso de um texto para transformar em imagem 😉"
        );
      }

      return responderImagem(res, memoria.ultimaFrase);
    }

    /* =========================
       PEDIDO DIRETO DE IMAGEM
    ========================= */
    if (texto.includes("imagem")) {
      if (!memoria.ultimaFrase) {
        return responderTexto(
          res,
          "Certo! Qual texto você quer transformar em imagem?"
        );
      }

      return responderImagem(res, memoria.ultimaFrase);
    }

    /* =========================
       CRIAÇÃO DE FRASE / TEXTO
    ========================= */
    if (
      texto.includes("frase") ||
      texto.includes("texto") ||
      texto.includes("mensagem") ||
      texto.includes("motivação")
    ) {
      const frase = gerarFrase();
      memoria.ultimaFrase = frase;
      memoria.ultimoTopico = "texto";

      return responderTexto(
        res,
        `🔥 Criei isso pra você:\n\n"${frase}"\n\nQuer transformar em imagem, anúncio ou legenda?`
      );
    }

    /* =========================
       RESPOSTA CONVERSACIONAL (CHATGPT)
    ========================= */
    memoria.ultimoTopico = "conversa";

    return responderTexto(
      res,
      gerarRespostaHumana(mensagem)
    );

  } catch (e) {
    console.error(e);
    return responderTexto(res, "❌ Algo deu errado, tenta de novo.");
  }
});

/* =========================
   FUNÇÕES
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

function gerarRespostaHumana(pergunta) {
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
