import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 ROTA PRINCIPAL DO CHAT
app.post("/chat", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || texto.trim() === "") {
      return res.json({ resposta: "Mensagem vazia 😅" });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
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
              content:
                "Você é o VendeIA, um assistente inteligente, direto e claro."
            },
            {
              role: "user",
              content: texto
            }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await openaiRes.json();

    const resposta =
      data?.choices?.[0]?.message?.content ||
      "Não consegui responder agora 😕";

    return res.json({ resposta });

  } catch (error) {
    console.error("❌ Erro no backend:", error);
    return res.json({ resposta: "Erro no servidor 😢" });
  }
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 VendeIA rodando na porta ${PORT}`);
});
