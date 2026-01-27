const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// rota raiz
app.get("/", (req, res) => {
  res.send("Backend online 🚀");
});

// rota de busca no Google
app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.status(400).json({ erro: "Pergunta não informada" });
  }

  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(pergunta)}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const $ = cheerio.load(data);

    // pega o primeiro trecho de resposta
    let resposta = "";
    $("div.BNeawe").each((i, el) => {
      const texto = $(el).text();
      if (texto.length > 50 && !resposta) {
        resposta = texto;
      }
    });

    if (!resposta) {
      resposta = "Não encontrei uma resposta clara.";
    }

    res.json({
      pergunta,
      resposta
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar no Google" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
