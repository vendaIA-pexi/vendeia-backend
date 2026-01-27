 const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let ultimaFrase = null;

/* =========================
   ROTA TESTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

/* =========================
   ROTA CHAT
========================= */
app.post("/chat", async (req, res) => {
  const texto = req.body?.mensagem || req.body?.texto;

  if (!texto) {
    return res.json({ tipo: "texto", resposta: "Mensagem vazia" });
  }

  const textoLower = texto.toLowerCase();

  if (textoLower.includes("criar frase")) {
    ultimaFrase = "O sucesso nasce da coragem de tentar todos os dias.";
    return res.json({
      tipo: "texto",
      resposta: `🔥 Frase criada:\n\n"${ultimaFrase}"`
    });
  }

  if (textoLower.includes("imagem") && ultimaFrase) {
    return res.json({
      tipo: "imagem",
      imagem: "https://picsum.photos/600/400"
    });
  }

  return res.json({
    tipo: "texto",
    resposta: "🤖 Ainda estou aprendendo."
  });
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
