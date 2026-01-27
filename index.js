const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API está rodando");
});

app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.json({ erro: "Pergunta não informada" });
  }

  try {
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
        pergunta,
        resposta: "Nenhuma resposta encontrada"
      });
    }

    const titulo = resultados[0].title;

    const summaryResponse = await axios.get(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`
    );

    return res.json({
      pergunta,
      titulo,
      resposta: summaryResponse.data.extract || "Sem resumo disponível"
    });

  } catch (error) {
    return res.json({
      pergunta,
      resposta: "Erro ao buscar informações"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
