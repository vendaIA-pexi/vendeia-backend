import axios from "axios"
import cheerio from "cheerio"

export async function buscarIdeias(url) {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 8000
  })

  const $ = cheerio.load(data)
  let ideias = []

  $("h1, h2, h3").each((_, el) => {
    ideias.push($(el).text())
  })

  $("p").slice(0, 5).each((_, el) => {
    ideias.push($(el).text())
  })

  return ideias.join(" | ")
}
