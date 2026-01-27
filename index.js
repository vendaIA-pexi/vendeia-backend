 const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   MEMÓRIA LONGA (MVP)
========================= */
let memoria = {
  ultimaMensagem: null,
  ultimaFrase: null,
  historico: []
};

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Backend VendeIA rodando perfeitamente");
});

/* =========================
   FUNÇÕES AUX
========================= */
function respostaHumana(texto) {
  const emojis = ["🤖", "✨", "🚀", "😉", "🔥"];
  return `${emojis[Math.floor(Math.random() * emojis.length)]} ${texto}`;
}

function salvarMemoria(texto) {
  memoria.ultimaMensagem = texto;
  memoria.historico.push(texto);
  if (memoria.historico.length > 20) memoria.historico.shift();
}

/* =========================
   ROTA CHAT
========================= */
app.post("/chat", async (req, res) => {
  try {
    const texto = req.body?.mensagem || req.body?.texto || "";
    const textoLower = texto.toLowerCase();

    if (!texto.trim()) {
      return res.json({
        tipo: "texto",
        resposta: respostaHumana("Pode mandar sua pergunta 😊")
      });
    }

    salvarMemoria(texto);

    /* =========================
       CRIAR FRASE / TEXTO
    ========================= */
    if (
      textoLower.includes("criar") ||
      textoLower.includes("frase") ||
      textoLower.includes("texto")
    ) {
      memoria.ultimaFrase =
        "O sucesso não é sorte, é consistência aplicada todos os dias.";

      return res.json({
        tipo: "texto",
        resposta: respostaHumana(
          `Criei isso pra você:\n\n"${memoria.ultimaFrase}"\n\nQuer transformar em imagem, anúncio ou legenda?`
        )
      });
    }

    /* =========================
       GERAR IMAGEM (IA-READY)
    ========================= */
    if (
      textoLower.includes("imagem") ||
      textoLower.includes("imagens") ||
      textoLower.includes("gerar imagem")
    ) {
      const prompt =
        memoria.ultimaFrase || texto.replace(/imagem|imagens/gi, "");

      return res.json({
        tipo: "imagem",
        prompt,
        imagem: `https://image.pollinations.ai/prompt/${encodeURIComponent(
          prompt
        )}`
      });
    }

    /* =========================
       QUEM É / O QUE É / EXPLICAR
    ========================= */
    if (
      textoLower.startsWith("quem é") ||
      textoLower.startsWith("o que é") ||
      textoLower.startsWith("explique") ||
      textoLower.startsWith("quem foi")
    ) {
      const pergunta = texto
        .replace(/quem é|o que é|explique|quem foi/gi, "")
        .trim();

      try {
        const response = await axios.get(
          "https://pt.wikipedia.org/api/rest_v1/page/summary/" +
            encodeURIComponent(pergunta)
        );

        if (response.data?.extract) {
          return res.json({
            tipo: "texto",
            resposta: respostaHumana(response.data.extract)
          });
        }
      } catch (e) {}

      return res.json({
        tipo: "texto",
        resposta: respostaHumana(
          `Não achei uma resposta exata, mas posso explicar de outro jeito se quiser 😉`
        )
      });
    }

    /* =========================
       MEMÓRIA / CONTEXTO
    ========================= */
    if (textoLower.includes("lembra") || textoLower.includes("memória")) {
      return res.json({
        tipo: "texto",
        resposta: respostaHumana(
          `Eu lembro das últimas ${memoria.historico.length} mensagens da conversa 😄`
        )
      });
    }

    /* =========================
       FALLBACK INTELIGENTE
    ========================= */
    return res.json({
      tipo: "texto",
      resposta: respostaHumana(
        `Entendi o que você disse. Quer que eu explique, crie algo, gere uma imagem ou pesquise isso?`
      )
    });

  } catch (error) {
    return res.json({
      tipo: "texto",
      resposta: "⚠️ Opa, tive um pequeno erro interno, mas já estou bem 😉"
    });
  }
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
