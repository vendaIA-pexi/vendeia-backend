import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    // ✅ PADRÃO: texto
    const { texto } = req.body;

    if (!texto) {
      return res.json({ resposta: "Mensagem vazia 😅" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions"),
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Você é o VendeIA, um assistente inteligente de vendas, claro e direto."
            },
            {
              role: "user",
              content: texto
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🛡️ Proteção total
    const resposta =
      data?.choices?.[0]?.message?.content ||
      "Não consegui responder agora 😕";

    return res.json({ resposta });

  } catch (err) {
    console.error("❌ Erro no /chat:", err);
    return res.json({ resposta: "Erro no servidor 😢" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 VendeIA ONLINE na porta", PORT);
});
