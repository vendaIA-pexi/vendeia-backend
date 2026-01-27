const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend online 🚀");
});

app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.json({ erro: "Pergunta não informada" });
  }

  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(pergunta)}&hl=pt-BR`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    let resposta = "";

    // tenta pegar featured snippet
    $("div.BNeawe").each((i, el) => {
      if ($(el).text().length > 50 && resposta === "") {
        resposta = $(el).text();
      }
    });

    if (!resposta) {
      resposta = "Não encontrei uma resposta direta.";
    }

    res.json({
      pergunta,
      resposta,
    });
  } catch (erro) {
    res.json({
      erro: "Erro ao buscar no Google",
      detalhes: erro.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});});
