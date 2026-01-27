const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend rodando 🚀");
});

app.get("/buscar", async (req, res) => {
  try {
    const pergunta = req.query.q;

    if (!pergunta) {
      return res.json({ erro: "Use ?q=pergunta" });
    }

    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(pergunta)}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);

    // tenta pegar snippet
    let resposta = $(".result__snippet").first().text().trim();

    // fallback: tenta outro formato
    if (!resposta) {
      resposta = $(".result__body").first().text().trim();
    }

    // fallback final
    if (!resposta) {
      resposta = $(".results").text().slice(0, 300).trim();
    }

    res.json({
      pergunta,
      resposta: resposta || "Não foi possível obter resposta"
    });
  } catch (err) {
    res.json({
      erro: "Erro na busca",
      detalhe: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
