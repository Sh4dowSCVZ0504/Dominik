const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const enemy = {
  x: -40,
  y: canvas.height / 2 - 20,
  size: 40,
  speed: 1.5
};

function update() {
  enemy.x += enemy.speed;

  if (enemy.x > canvas.width) {
    enemy.x = -enemy.size;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
