const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🧠 MEMÓRIA SIMPLES
let ultimaMensagem = "";

app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.json({
        tipo: "texto",
        resposta: "Texto não recebido"
      });
    }

    const textoLower = texto.toLowerCase();

    // 🖼️ PEDIDO DE IMAGEM COM CONTEXTO
    if (
      textoLower.includes("cria imagem") ||
      textoLower.includes("criar imagem") ||
      textoLower.includes("gera imagem") ||
      textoLower.includes("transforma em imagem")
    ) {
      return res.json({
        tipo: "imagem",
        prompt: ultimaMensagem || texto,
        imagem: "https://picsum.photos/512"
      });
    }

    // 💾 SALVA NA MEMÓRIA
    ultimaMensagem = texto;

    // ✍️ RESPOSTA NORMAL
    return res.json({
      tipo: "texto",
      resposta: `🔥 Entendi isso:\n\n"${texto}"\n\n👉 Quer que eu transforme em anúncio, imagem ou descrição?`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      tipo: "texto",
      resposta: "Erro interno no servidor"
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
