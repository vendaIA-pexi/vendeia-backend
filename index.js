const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== ROTA TESTE ===== */
app.get("/", (req, res) => {
  res.send("🚀 Backend VendeIA online");
});

/* ===== CHAT ===== */
app.post("/chat", (req, res) => {
  const mensagem = req.body.mensagem;

  if (!mensagem) {
    return res.json({
      tipo: "texto",
      resposta: "⚠️ Nenhuma mensagem recebida."
    });
  }

  const texto = mensagem.toLowerCase();

  // respostas simples (base)
  if (texto.includes("oi") || texto.includes("olá")) {
    return res.json({
      tipo: "texto",
      resposta: "👋 Olá! Em que posso te ajudar?"
    });
  }

  if (texto.includes("imagem")) {
    return res.json({
      tipo: "imagem",
      imagem: "https://picsum.photos/512/512"
    });
  }

  // resposta padrão
  return res.json({
    tipo: "texto",
    resposta: `🤖 Você disse: "${mensagem}"`
  });
});

/* ===== START ===== */
app.listen(PORT, () => {
  console.log("✅ Servidor rodando na porta", PORT);
});
