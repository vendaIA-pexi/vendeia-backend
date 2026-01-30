import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Mensagem vazia 😅" });
    }

    const response = await fetch(
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
            { role: "system", content: "Você é o VendeIA, um assistente inteligente de vendas." },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    return res.json({
      reply: data?.choices?.[0]?.message?.content || "Sem resposta 😕"
    });

  } catch (err) {
    console.error(err);
    return res.json({ reply: "Erro no servidor 😢" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 VendeIA ONLINE"));
