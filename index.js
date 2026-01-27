const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROTA DE TESTE
app.get("/", (req, res) => {
  res.send("Backend VendeIA rodando 🚀");
});

// ROTA USADA PELO FRONTEND
app.post("/api/chat", (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({
      resposta: "Texto não recebido"
    });
  }

  res.json({
    resposta: `🔥 Texto pronto para cosméticos:

Realce sua beleza com produtos de alta qualidade,
fórmulas modernas e resultados comprovados.
Garanta o seu agora e sinta a diferença! 💄✨`
  });
});

// PORTA OBRIGATÓRIA NO RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
