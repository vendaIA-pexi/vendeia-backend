const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend online 🚀");
});

app.get("/buscar", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.json({ erro: "Parâmetro q não informado" });
  }

  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    const $ = cheerio.load(data);
    const resultado = $("div.BNeawe").first().text();

    res.json({
      pergunta: query,
      resposta: resultado || "Nenhuma resposta encontrada"
    });
  } catch (erro) {
    res.json({ erro: "Erro ao buscar no Google" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
