const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const path = [
  { x: -40, y: 200 },
  { x: 200, y: 200 },
  { x: 200, y: 100 },
  { x: 500, y: 100 },
  { x: 500, y: 300 },
  { x: canvas.width + 40, y: 300 }
];

const enemy = {
  x: path[0].x,
  y: path[0].y,
  size: 30,
  speed: 1.2,
  target: 1
};

function update() {
  const targetPoint = path[enemy.target];

  const dx = targetPoint.x - enemy.x;
  const dy = targetPoint.y - enemy.y;
  const dist = Math.hypot(dx, dy);

  if (dist < enemy.speed) {
    enemy.target++;
    if (enemy.target >= path.length) {
      enemy.target = 1;
      enemy.x = path[0].x;
      enemy.y = path[0].y;
    }
  } else {
    enemy.x += (dx / dist) * enemy.speed;
    enemy.y += (dy / dist) * enemy.speed;
  }
}

function drawPath() {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPath();

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
