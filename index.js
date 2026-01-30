import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.json({ resposta: "Mensagem vazia" });
  }

  if (mensagem.toLowerCase().includes("neymar")) {
    return res.json({
      resposta: "Neymar é um jogador de futebol brasileiro, um dos mais famosos do mundo."
    });
  }

  res.json({
    resposta: "Você disse: " + mensagem
  });
});

app.listen(3000, () => {
  console.log("VendeIA rodando");
});
