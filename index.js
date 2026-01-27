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
  console.log("BODY RECEBIDO:", req.body);

  // ✅ aceita mensagem ou texto
  const texto = req.body?.mensagem || req.body?.texto;

  if (!texto) {
    return res.json({
      tipo: "texto",
      resposta: "Mensagem vazia"
    });
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
     2️⃣ GERAR IMAGEM
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
     3️⃣ BUSCA WIKIPEDIA (CORRIGIDA)
  ========================= */
  if (textoLower.startsWith("quem é")) {
    const pergunta = texto.replace(/quem é/i, "").trim();

    try {
      // 🔍 Busca título
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
          tipo: "texto",
          resposta: "Não encontrei informações sobre isso."
        });
      }

      const titulo = resultados[0].title;

      // 📄 Busca resumo (API CERTA)
      const pageResponse = await axios.get(
        "https://pt.wikipedia.org/w/api.php",
        {
          params: {
            action: "query",
            prop: "extracts",
            exintro: true,
            explaintext: true,
            titles: titulo,
            format: "json",
            origin: "*"
          },
          headers: {
            "User-Agent": "VendeIA/1.0 (https://vendeia.app)"
          }
        }
      );

      const pages = pageResponse.data.query.pages;
      const page = Object.values(pages)[0];

      if (!page || !page.extract) {
        return res.json({
          tipo: "texto",
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
  console.log("BODY RECEBIDO:", req.body);

  // ✅ aceita mensagem ou texto
  const texto = req.body?.mensagem || req.body?.texto;

  if (!texto) {
    return res.json({
      tipo: "texto",
      resposta: "Mensagem vazia"
    });
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
     2️⃣ GERAR IMAGEM
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
     3️⃣ BUSCA WIKIPEDIA (100% FIX)
  ========================= */
  if (textoLower.startsWith("quem é")) {
    const pergunta = texto.replace(/quem é/i, "").trim();

    try {
      const headers = {
        "User-Agent": "VendeIA/1.0 (https://vendeia.app)"
      };

      // 🔍 BUSCA DO TÍTULO (COM USER-AGENT)
      const searchResponse = await axios.get(
        "https://pt.wikipedia.org/w/api.php",
        {
          params: {
            action: "query",
            list: "search",
            srsearch: pergunta,
            format: "json"
          },
          headers
        }
      );

      const resultados = searchResponse.data?.query?.search;

      if (!resultados || resultados.length === 0) {
        return res.json({
          tipo: "texto",
          resposta: "Não encontrei informações sobre isso."
        });
      }

      const titulo = resultados[0].title;

      // 📄 BUSCA DO RESUMO (COM USER-AGENT)
      const pageResponse = await axios.get(
        "https://pt.wikipedia.org/w/api.php",
        {
          params: {
            action: "query",
            prop: "extracts",
            exintro: true,
            explaintext: true,
            titles: titulo,
            format: "json"
          },
          headers
        }
      );

      const pages = pageResponse.data.query.pages;
      const page = Object.values(pages)[0];

      if (!page?.extract) {
        return res.json({
          tipo: "texto",
          resposta: "Não encontrei um resumo confiável."
        });
      }

      return res.json({
        tipo: "texto",
        resposta: page.extract
      });

    } catch (error) {
      console.error("ERRO WIKI:", error.message);
      return res.json({
        tipo: "texto",
        resposta: "Erro ao buscar informações."
      });
    }
  }

  /* =========================
     FALLBACK
  ========================= */
  return res.json({
    tipo: "texto",
    resposta: "🤖 Entendi, mas ainda não sei o que fazer com isso."
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
