app.get("/buscar", async (req, res) => {
  const pergunta = req.query.q;

  if (!pergunta) {
    return res.json({ erro: "Pergunta não informada" });
  }

  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pergunta)}`;
    const response = await axios.get(url);

    if (response.data.extract) {
      return res.json({
        pergunta,
        resposta: response.data.extract
      });
    } else {
      return res.json({
        pergunta,
        resposta: "Nenhuma resposta encontrada"
      });
    }
  } catch (error) {
    return res.json({
      pergunta,
      resposta: "Não foi possível obter resposta"
    });
  }
});
