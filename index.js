const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// rota raiz só pra teste rápido
app.get("/", (req, res) => {
  res.send("Backend rodando 🚀");
});

// rota de busca
app.get("/buscar", async (req, res) => {
  try {
    const pergunta = req.query.q;

    if (!pergunta) {
      return res.json({
        erro: "Parâmetro ?q é obrigatório"
      });
    }

    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(pergunta)}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const resposta = $(".result__snippet").first().text().trim();

    res.json({
      pergunta,
      resposta: resposta || "Nenhuma resposta encontrada"
    });
  } catch (error) {
    res.json({
      erro: "Erro ao buscar resposta",
      detalhe: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
