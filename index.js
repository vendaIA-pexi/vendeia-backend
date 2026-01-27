const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// rota raiz
app.get("/", (req, res) => {
  res.status(200).send("API está rodando 🚀");
});

// rota de busca usando Wikipedia
app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.status(400).json({
      erro: "Pergunta não informada"
    });
  }

  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pergunta)}`;
    const response = await axios.get(url);

    if (response.data?.extract) {
      return res.status(200).json({
        pergunta,
        resposta: response.data.extract
      });
    }

    return res.status(404).json({
      pergunta,
      resposta: "Nenhuma resposta encontrada"
    });

  } catch (error) {
    return res.status(500).json({
      pergunta,
      resposta: "Não foi possível obter resposta"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
