const express = require("express");
const path = require("path");

const app = express();

// arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
