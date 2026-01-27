const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// 🔥 MIDDLEWARES OBRIGATÓRIOS
app.use(cors());
app.use(express.json());

// ✅ ROTA RAIZ (Render testa isso)
app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

// ==============================
// 🤖 ROTA DO CHAT (HTML usa essa)
// ==============================
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

    // 🖼️ PEDIDO DE IMAGEM
    if (
      textoLower.includes("cria imagem") ||
      textoLower.includes("criar imagem") ||
      textoLower.includes("gerar imagem") ||
      textoLower.includes("imagem de")
    ) {
      return res.json({
        tipo: "imagem",
        imagem: "https://picsum.photos/512"
      });
    }

    // 🔎 SE FOR PERGUNTA → WIKIPEDIA
    if (
      textoLower.startsWith("quem é") ||
      textoLower.startsWith("o que é") ||
      textoLower.startsWith("quem foi")
    ) {
      const searchResponse = await axios.get(
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

      const resultados = searchResponse.data?.query?.search;

      if (!resultados || resultados.length === 0) {
        return res.json({
          tipo: "texto",
          resposta: "Não encontrei informações sobre isso."
        });
      }

      const titulo = resultados[0].title;

      const summaryResponse = await axios.get(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          titulo
        )}`
      );

      return res.json({
        tipo: "texto",
        resposta: summaryResponse.data.extract
      });
    }

    // ✍️ TEXTO PADRÃO (modo vendedor)
    return res.json({
      tipo: "texto",
      resposta: `🔥 Texto pronto para vendas:\n\n${texto}\n\n💡 Quer transformar isso em anúncio ou imagem?`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      tipo: "texto",
      resposta: "Erro interno no servidor"
    });
  }
});

// ==============================
// 🚀 LISTEN (SÓ ESSE!)
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
  } catch (error) {
    console.error(error.response?.status, error.message);
    return res.json({
      pergunta,
      resposta: "Erro ao buscar informações"
    });
  }
});

// 🚀 OBRIGATÓRIO NO RENDER
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
