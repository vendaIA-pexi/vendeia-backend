const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// rota principal
app.get("/", (req, res) => {
  res.send("Backend rodando 🚀");
});

// rota de busca
app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.json({ resposta: "Pergunta não informada" });
  }

  try {
    const url = `https://pt.wikipedia.org/wiki/${encodeURIComponent(pergunta)}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let texto = "";

    $("p").each((i, el) => {
      const p = $(el).text();
      if (p.length > 50 && texto === "") {
        texto = p;
      }
    });

    if (!texto) {
      texto = "Nenhuma resposta encontrada";
    }

    res.json({
      pergunta,
      resposta: texto
    });

  } catch (error) {
    res.json({
      pergunta,
      resposta: "Não foi possível obter resposta"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
