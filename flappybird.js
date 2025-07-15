const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

window.bird = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  color: "#FFD700",
  gravity: 0.1,
  velocity: 0
};

window.pipes = [];
window.score = 0;
window.gameOver = false;

const PIPE_GAP = 160;
const PIPE_SPACING = 300;

window.updateBird = function () {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
};

window.updatePipes = function () {
  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
      document.getElementById("score").textContent = score;
    }

    // ✅ Fixed Bug 2: strict collision logic
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y <= pipe.topHeight || bird.y + bird.height >= pipe.bottomY)
    ) {
      gameOver = true;
    }
  });

  if (
    pipes.length === 0 ||
    pipes[pipes.length - 1].x < canvas.width - PIPE_SPACING
  ) {
    const topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
    pipes.push({
      x: canvas.width,
      width: 50,
      topHeight: topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false
    });
  }

  if (pipes[0] && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
  }
};

window.jump = function () {
  bird.velocity = -3;
};

window.resetGame = function () {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;

  // ✅ Bug 3 fix
  document.getElementById("score").textContent = "0";
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (window.gameOver) {
      window.resetGame();
    } else {
      window.jump();
    }
  }
});

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBird();
  updatePipes();

  // Draw pipes
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
  });

  // Draw bird
  ctx.fillStyle = bird.color;
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(gameLoop);
}

gameLoop();  