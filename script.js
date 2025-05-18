const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
let score = 0;

// Movimento do obstáculo
function moveObstacle() {
  obstacle.style.right = "-50px";
  let position = -50;

  const interval = setInterval(() => {
    if (position >= window.innerWidth) {
      position = -50;
      score++;
      scoreDisplay.textContent = "Pontuação: " + score;
    } else {
      position += 5;
    }

    obstacle.style.right = position + "px";

    // Colisão
    const playerBottom = player.getBoundingClientRect().bottom;
    const playerLeft = player.getBoundingClientRect().left;
    const obstacleLeft = obstacle.getBoundingClientRect().left;

    if (
      obstacleLeft < playerLeft + 50 &&
      obstacleLeft + 50 > playerLeft &&
      playerBottom > window.innerHeight - 60
    ) {
      alert("Fim de jogo! Sua pontuação: " + score);
      clearInterval(interval);
      location.reload();
    }
  }, 20);
}

moveObstacle();

// Controle de pulo
function jump() {
  if (!player.classList.contains("jump")) {
    player.classList.add("jump");
    setTimeout(() => {
      player.classList.remove("jump");
    }, 500);
  }
}

document.addEventListener("keydown", function(e) {
  if (e.code === "Space") {
    jump();
  }
});

document.addEventListener("touchstart", function() {
  jump();
});