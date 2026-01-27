const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ ROTA RAIZ (Render precisa disso)
app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

// ✅ ROTA INTELIGENTE (TEXTO + IMAGEM)
app.post("/api/chat", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({
        tipo: "texto",
        resposta: "Texto não recebido"
      });
    }

    const textoLower = texto.toLowerCase();

    // 🖼️ DETECTA PEDIDO DE IMAGEM
    if (
      textoLower.includes("criar imagem") ||
      textoLower.includes("cria imagem") ||
      textoLower.includes("gerar imagem") ||
      textoLower.includes("imagem")
    ) {
      return res.json({
        tipo: "imagem",
        imagem: "https://picsum.photos/512"
      });
    }

    // 📚 BUSCA NA WIKIPEDIA (COM USER-AGENT)
    const headers = {
      "User-Agent": "VendeIA/1.0 (contato@vendeia.app)"
    };

    // 1️⃣ Buscar título
    const searchResponse = await axios.get(
      "https://pt.wikipedia.org/w/api.php",
      {
        params: {
          action: "query",
          list: "search",
          srsearch: texto,
          format: "json",
          origin: "*"
        },
        headers
      }
    );

    const resultados = searchResponse.data?.query?.search;

    if (!resultados || resultados.length === 0) {
      return res.json({
        tipo: "texto",
        resposta: "Nenhuma resposta encontrada"
      });
    }

    const titulo = resultados[0].title;

    // 2️⃣ Buscar resumo (AQUI ESTAVA O ERRO)
    const summaryResponse = await axios.get(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`,
      { headers }
    );

    return res.json({
      tipo: "texto",
      resposta: summaryResponse.data.extract
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      tipo: "texto",
      resposta: "Erro interno no servidor"
    });
  }
});

// ✅ START SERVER (OBRIGATÓRIO NO RENDER)
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
