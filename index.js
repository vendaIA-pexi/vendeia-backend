const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🧠 memória simples (MVP)
let ultimaFrase = null;

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

/* =========================
   ROTA PRINCIPAL
========================= */
app.post("/chat", async (req, res) => {
  const texto = req.body?.texto; // 🔴 AJUSTE IMPORTANTE

  if (!texto) {
    return res.json({ resposta: "Mensagem vazia" });
  }

  const textoLower = texto.toLowerCase();

  /* =========================
     1️⃣ CRIAR FRASE
  ========================= */
  if (
    textoLower.includes("criar frase") ||
    textoLower.includes("criar uma frase")
  ) {
    ultimaFrase = "O sucesso nasce da coragem de tentar todos os dias.";

    return res.json({
      tipo: "texto",
      resposta: `🔥 Frase criada:\n\n"${ultimaFrase}"\n\n👉 Quer transformar em imagem, anúncio ou descrição?`
    });
  }

  /* =========================
     2️⃣ GERAR IMAGEM DA FRASE
  ========================= */
  if (
    (textoLower.includes("imagem") ||
      textoLower.includes("criar imagem")) &&
    ultimaFrase
  ) {
    return res.json({
      tipo: "imagem",
      imagem: "https://picsum.photos/600/400"
    });
  }

  /* =========================
     3️⃣ BUSCA WIKIPEDIA
  ========================= */
  if (textoLower.startsWith("quem é")) {
    const pergunta = texto.replace(/quem é/i, "").trim();

    try {
      const searchResponse = await axios.get(
        "https://pt.wikipedia.org/w/api.php",
        {
          params: {
            action: "query",
            list: "search",
            srsearch: pergunta,
            format: "json",
            origin: "*"
          }
        }
      );

      const resultados = searchResponse.data?.query?.search;

      if (!resultados || resultados.length === 0) {
        return res.json({
          resposta: "Não encontrei informações sobre isso."
        });
      }

      const titulo = resultados[0].title;

      const summaryResponse = await axios.get(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          titulo
        )}`
      );

      return res.json({
        tipo: "texto",
        resposta: summaryResponse.data.extract
      });
    } catch (error) {
      return res.json({
        resposta: "Erro ao buscar informações."
      });
    }
  }

  /* =========================
     FALLBACK
  ========================= */
  return res.json({
    resposta: "🤖 Entendi, mas ainda não sei o que fazer com isso."
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
