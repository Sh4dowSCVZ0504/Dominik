// ===== CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

// ===== IMAGEM DA TORRETA =====
const torretaImg = new Image();
torretaImg.src = "../assets/torreta01.png";

// ===== TORRETA =====
const torreta = {
    x: canvas.width / 2 - 32,
    y: canvas.height / 2 - 32,
    size: 64
};

// ===== LOOP PRINCIPAL =====
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // fundo
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // desenha torreta
    if (torretaImg.complete) {
        ctx.drawImage(
            torretaImg,
            torreta.x,
            torreta.y,
            torreta.size,
            torreta.size
        );
    }

    requestAnimationFrame(gameLoop);
}

// ===== START =====
torretaImg.onload = () => {
    console.log("✅ Torreta carregada");
    gameLoop();
};
