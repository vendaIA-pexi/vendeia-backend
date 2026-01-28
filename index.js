// ================================
// VENDAIA — INDEX.JS ULTIMATE (FIX)
// ================================

// ----------------
// CONFIG
// ----------------
const API_CHAT = "https://vendeia-backend.onrender.com/chat";
const API_IMAGE = "https://vendeia-backend.onrender.com/imagem";

const MAX_FREE_MESSAGES = 5;

const STORAGE = {
  MEMORIA: "vendaia_memoria",
  USER: "vendaia_user",
  SESSION: "vendaia_session"
};

// ----------------
// SAFE INIT (browser only)
// ----------------
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initUsuario();
    initSessao();
    mensagemBoasVindas();
  });
}

// ----------------
// USUÁRIO
// ----------------
function initUsuario() {
  if (!localStorage.getItem(STORAGE.USER)) {
    localStorage.setItem(
      STORAGE.USER,
      JSON.stringify({
        plano: "free",
        mensagens: 0,
        perfil: "desconhecido",
        emocao: "neutro",
        ultimoAcesso: Date.now()
      })
    );
  }
}

function getUser() {
  return JSON.parse(localStorage.getItem(STORAGE.USER));
}

function setUser(data) {
  localStorage.setItem(STORAGE.USER, JSON.stringify(data));
}

// ----------------
// SESSÃO
// ----------------
function initSessao() {
  localStorage.setItem(
    STORAGE.SESSION,
    JSON.stringify({ inicio: Date.now() })
  );
}

// ----------------
// MEMÓRIA
// ----------------
function getMemoria() {
  return JSON.parse(localStorage.getItem(STORAGE.MEMORIA)) || [];
}

function salvarMemoria(tipo, texto) {
  const m = getMemoria();
  m.push({ tipo, texto, data: Date.now() });
  localStorage.setItem(STORAGE.MEMORIA, JSON.stringify(m.slice(-100)));
}

// ----------------
// UX
// ----------------
function typingFake() {
  return new Promise(r => setTimeout(r, 600 + Math.random() * 900));
}

// ----------------
// PERFIL + EMOÇÃO
// ----------------
function detectarPerfil(texto) {
  if (/preço|valor|comprar|pagar/i.test(texto)) return "comprador";
  if (/como funciona|detalhe|tecnico/i.test(texto)) return "tecnico";
  if (/rápido|agora|urgente/i.test(texto)) return "apressado";
  if (/talvez|não sei|pensar/i.test(texto)) return "indeciso";
  return "curioso";
}

function detectarEmocao(texto) {
  if (/raiva|ódio|droga/i.test(texto)) return "frustrado";
  if (/top|perfeito|amei/i.test(texto)) return "empolgado";
  return "neutro";
}

// ----------------
// GATILHOS
// ----------------
function gatilho(perfil) {
  const g = {
    comprador: "🔥 Últimas vagas hoje.",
    indeciso: "🤝 Posso te ajudar a decidir agora.",
    curioso: "👀 Pouca gente sabe disso.",
    tecnico: "🧠 Vou direto ao ponto.",
    apressado: "⏳ Vamos resolver em 1 minuto."
  };
  return g[perfil] || "";
}

// ----------------
// PAYWALL
// ----------------
function verificarLimite() {
  const u = getUser();
  if (u.plano === "premium") return true;

  if (u.mensagens >= MAX_FREE_MESSAGES) {
    responderBot("🚫 Limite grátis atingido.");
    responderBot("💳 Libere o Premium para continuar.");
    return false;
  }
  return true;
}

// ----------------
// AFILIADO
// ----------------
function afiliadoSugestao(perfil) {
  if (perfil === "comprador") {
    return "\n💸 Recomendo agora 👉 https://seulink.com";
  }
  return "";
}

// ----------------
// IA VENDEDORA (CORE)
// ----------------
async function processarMensagem(texto) {
  if (!texto.trim()) return;

  const u = getUser();
  if (!verificarLimite()) return;

  u.mensagens++;
  u.perfil = detectarPerfil(texto);
  u.emocao = detectarEmocao(texto);
  u.ultimoAcesso = Date.now();
  setUser(u);

  salvarMemoria("user", texto);
  responderUser(texto);

  await typingFake();

  let resposta = "";
  resposta += gatilho(u.perfil) + "\n";
  resposta += "Entendi o que você quer.\n";

  if (u.perfil === "comprador") {
    resposta += "👉 Posso te entregar a melhor opção agora.\n";
  }

  resposta += afiliadoSugestao(u.perfil);

  salvarMemoria("bot", resposta);
  responderBot(resposta);
}

// ----------------
// OUTPUT REAL (HTML)
// ----------------
function responderBot(texto) {
  const chat = document.getElementById("chat");
  if (!chat) return;
  chat.innerHTML += `<div class="bot">🤖 ${texto}</div>`;
}

function responderUser(texto) {
  const chat = document.getElementById("chat");
  if (!chat) return;
  chat.innerHTML += `<div class="user">🧑 ${texto}</div>`;
}

// ----------------
// ENTRADA DO USUÁRIO
// ----------------
function enviar() {
  const input = document.getElementById("input");
  if (!input) return;
  const texto = input.value;
  input.value = "";
  processarMensagem(texto);
}

// ----------------
// BOAS-VINDAS
// ----------------
function mensagemBoasVindas() {
  responderBot("👋 Bem-vindo ao VendaIA.");
  responderBot("Sou uma IA criada para vender e converter.");
}
