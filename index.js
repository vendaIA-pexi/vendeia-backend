const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rota raiz
app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

// rota do chat
app.post("/api/chat", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.json({
        tipo: "texto",
        resposta: "Nenhum texto recebido"
      });
    }

    const lower = texto.toLowerCase();

    // imagem fake (teste)
    if (
      lower.includes("criar imagem") ||
      lower.includes("cria imagem") ||
      lower.includes("imagem de")
    ) {
      return res.json({
        tipo: "imagem",
        imagem: "https://picsum.photos/512"
      });
    }

    // wikipedia
    if (
      lower.startsWith("quem é") ||
      lower.startsWith("quem foi") ||
      lower.startsWith("o que é")
    ) {
      const busca = await axios.get(
        "https://pt.wikipedia.org/w/api.php",
        {
          params: {
            action: "query",
            list: "search",
            srsearch: texto,
            format: "json",
            origin: "*"
          }
        }
      );

      const resultados = busca.data?.query?.search;

      if (!resultados || resultados.length === 0) {
        return res.json({
          tipo: "texto",
          resposta: "Não encontrei informações."
        });
      }

      const titulo = resultados[0].title;

      const resumo = await axios.get(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`
      );

      return res.json({
        tipo: "texto",
        resposta: resumo.data.extract
      });
    }

    // resposta padrão
    return res.json({
      tipo: "texto",
      resposta: "🔥 Posso te ajudar a criar textos ou imagens para vender!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      tipo: "texto",
      resposta: "Erro interno no servidor"
    });
  }
});

// listen (APENAS UM)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
