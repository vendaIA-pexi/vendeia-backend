const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API online 🚀");
});

app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;
  const modo = req.query.modo || "wiki"; // wiki | all

  if (!pergunta) {
    return res.json({ erro: "Use /buscar?q=algo" });
  }

  try {
    // 🔹 WIKIPEDIA
    const wikiUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pergunta)}`;
    const wikiRes = await axios.get(wikiUrl, { timeout: 8000 });

    let respostaWiki = wikiRes.data?.extract || "";

    // 🔹 ALL = Wikipedia + DuckDuckGo
    if (modo === "all") {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(pergunta)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await axios.get(ddgUrl, { timeout: 8000 });

      const respostaDDG =
        ddgRes.data.AbstractText ||
        ddgRes.data.Heading ||
        "";

      return res.json({
        pergunta,
        modo: "all",
        resposta:
          respostaWiki ||
          respostaDDG ||
          "Nenhuma resposta encontrada"
      });
    }

    // 🔹 MODO WIKI
    return res.json({
      pergunta,
      modo: "wiki",
      resposta: respostaWiki || "Nenhuma resposta encontrada"
    });

  } catch (error) {
    return res.json({
      pergunta,
      resposta: "Erro ao buscar informações"
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
