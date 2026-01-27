app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.json({ erro: "Pergunta não informada" });
  }

  try {
    // 1️⃣ Busca na Wikipedia (OBRIGATÓRIO origin: "*")
    const searchResponse = await axios.get(
      "https://pt.wikipedia.org/w/api.php",
      {
        params: {
          action: "query",
          list: "search",
          srsearch: pergunta,
          format: "json",
          origin: "*" // 👈 ISSO RESOLVE O ERRO
        }
      }
    );

    const resultados = searchResponse.data?.query?.search;

    if (!resultados || resultados.length === 0) {
      return res.json({
        pergunta,
        resposta: "Nenhuma resposta encontrada"
      });
    }

    // 2️⃣ Título correto
    const titulo = resultados[0].title;

    // 3️⃣ Resumo do artigo
    const summaryResponse = await axios.get(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`
    );

    return res.json({
      pergunta,
      titulo,
      resposta: summaryResponse.data.extract || "Sem resumo disponível"
    });

  } catch (error) {
    console.error(error.message);
    return res.json({
      pergunta,
      resposta: "Erro ao buscar informações"
    });
  }
});
