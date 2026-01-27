const express = require("express");
const axios = require("axios");

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

    const url = "https://api.duckduckgo.com/";

    const { data } = await axios.get(url, {
      params: {
        q: pergunta,
        format: "json",
        no_html: 1,
        skip_disambig: 1
      }
    });

    let resposta =
      data.AbstractText ||
      data.Answer ||
      (data.RelatedTopics &&
        data.RelatedTopics[0] &&
        data.RelatedTopics[0].Text) ||
      "Nenhuma resposta encontrada";

    res.json({
      pergunta,
      resposta
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
