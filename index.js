// ================================
// VENDAIA — INDEX.JS ULTIMATE
// Máquina automática de conversão
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
  STATS: "vendaia_stats",
  SESSION: "vendaia_session"
};

// ----------------
// INIT
// ----------------
document.addEventListener("DOMContentLoaded", () => {
  initUsuario();
  initSessao();
  mensagemBoasVindas();
});

// ----------------
// USUÁRIO
// ----------------
function initUsuario() {
  if (!localStorage.getItem(STORAGE.USER)) {
    localStorage.setItem(STORAGE.USER, JSON.stringify({
      plano: "free",
      mensagens: 0,
      perfil: "desconhecido",
      emocao: "neutro",
      ultimoAcesso: Date.now()
    }));
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
  localStorage.setItem(STORAGE.SESSION, JSON.stringify({
    inicio: Date.now(),
    mensagens: []
  }));
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
// PERFIL PSICOLÓGICO
// ----------------
function detectarPerfil(texto) {
  if (/preço|valor|comprar|pagar/i.test(texto)) return "comprador";
  if (/como funciona|detalhe|tecnico/i.test(texto)) return "tecnico";
  if (/rápido|agora|urgente/i.test(texto)) return "apressado";
  if (/talvez|não sei|pensar/i.test(texto)) return "indeciso";
  return "curioso";
}

// ----------------
// EMOÇÃO
// ----------------
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
    responderBot("🚫 Você atingiu o limite grátis. Libere o Premium para continuar.");
    responderBot("💳 Premium: imagens ilimitadas, memória longa e respostas avançadas.");
    return false;
  }
  return true;
}

// ----------------
// AFILIADO
// ----------------
function afiliadoSugestao(perfil) {
  if (perfil === "comprador") {
    return "💸 Recomendo este produto agora 👉 https://seulink.com";
  }
  return "";
}

// ----------------
// IA VENDEDORA
// ----------------
async function processarMensagem(texto) {
  const u = getUser();
  if (!verificarLimite()) return;

  u.mensagens++;
  u.perfil = detectarPerfil(texto);
  u.emocao = detectarEmocao(texto);
  u.ultimoAcesso = Date.now();
  setUser(u);

  salvarMemoria("user", texto);

  await typingFake();

  let resposta = "";

  // IA fake local (fallback)
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
// OUTPUT (exemplo)
// ----------------
function responderBot(texto) {
  console.log("BOT:", texto);
}

// ----------------
// BOAS-VINDAS
// ----------------
function mensagemBoasVindas() {
  responderBot("👋 Bem-vindo ao VendaIA.");
  responderBot("Sou uma IA criada para vender, otimizar e te dar vantagem.");
}
