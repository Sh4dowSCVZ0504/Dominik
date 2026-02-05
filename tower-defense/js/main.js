const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#111";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#0f0";
ctx.font = "20px Arial";
ctx.fillText("Tower Defense iniciado 🚀", 20, 40);

