const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let jogador = { x: 50, y: 200, largura: 50, altura: 50, pulando: false, velocidadeY: 0 };
let obstaculos = [];
let gravidade = 0.8;
let mensagens = [
  "Jesus é o caminho!",
  "Permanece firme!",
  "Não temas, Ele é contigo.",
  "O justo viverá pela fé!",
  "Prossegue para o alvo!"
];
let pontuacao = 0;
let intervaloMensagem = 0;

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !jogador.pulando) {
    jogador.velocidadeY = -12;
    jogador.pulando = true;
  }
});

function criarObstaculo() {
  let tamanho = 30 + Math.random() * 20;
  obstaculos.push({ x: canvas.width, y: 250 - tamanho, largura: 20, altura: tamanho });
}

function desenharJogador() {
  ctx.fillStyle = "#007700";
  ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}

function desenharObstaculos() {
  ctx.fillStyle = "#770000";
  for (let obs of obstaculos) {
    ctx.fillRect(obs.x, obs.y, obs.largura, obs.altura);
  }
}

function atualizar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Movimento do jogador
  jogador.velocidadeY += gravidade;
  jogador.y += jogador.velocidadeY;

  if (jogador.y > 200) {
    jogador.y = 200;
    jogador.pulando = false;
  }

  // Obstáculos
  for (let obs of obstaculos) {
    obs.x -= 6;

    // Colisão
    if (
      jogador.x < obs.x + obs.largura &&
      jogador.x + jogador.largura > obs.x &&
      jogador.y < obs.y + obs.altura &&
      jogador.y + jogador.altura > obs.y
    ) {
      alert("Fim de jogo! Sua pontuação: " + pontuacao);
      document.location.reload();
    }
  }

  obstaculos = obstaculos.filter(obs => obs.x + obs.largura > 0);

  // Pontuação e mensagens
  pontuacao++;
  intervaloMensagem++;

  if (intervaloMensagem > 200) {
    const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
    document.getElementById("mensagemBiblica").textContent = mensagem;
    intervaloMensagem = 0;
  }

  desenharJogador();
  desenharObstaculos();

  requestAnimationFrame(atualizar);
}

// Começar o jogo
setInterval(criarObstaculo, 2000);
atualizar();