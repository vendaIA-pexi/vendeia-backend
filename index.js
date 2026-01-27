const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.json({ erro: "Pergunta não informada" });
  }

  try {
    const headers = {
      "User-Agent": "MinhaAPI/1.0 (contato@email.com)"
    };

    // 1) Buscar título
    const searchResponse = await axios.get(
      "https://pt.wikipedia.org/w/api.php",
      {
        params: {
          action: "query",
          list: "search",
          srsearch: pergunta,
          format: "json",
          origin: "*"
        },
        headers
      }
    );

    const resultados = searchResponse.data?.query?.search;

    if (!resultados || resultados.length === 0) {
      return res.json({
        pergunta,
        resposta: "Nenhuma resposta encontrada"
      });
    }

    const titulo = resultados[0].title;

    // 2) Buscar resumo
    const summaryResponse = await axios.get(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`,
      { headers }
    );

    return res.json({
      pergunta,
      titulo,
      resposta: summaryResponse.data.extract
    });

  } catch (error) {
    console.error(error.response?.status, error.message);
    return res.json({
      pergunta,
      resposta: "Erro ao buscar informações"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
