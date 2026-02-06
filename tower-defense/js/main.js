/* ===== CONFIGURAÇÕES INICIAIS ===== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamanho do canvas
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Lista de torres e monstros
let torres = [];
let monstros = [];

// Núcleo
const nucleo = {
    x: WIDTH / 2 - 32,
    y: HEIGHT / 2 - 32,
    width: 64,
    height: 64,
    hp: 100
};

// Imagens
const assets = {
    nucleo: new Image(),
    torreta01: new Image(),
    torreta02: new Image(),
    torreta03: new Image(),
};

assets.nucleo.src = "assets/nucleo.png";
assets.torreta01.src = "assets/torreta01.png";
assets.torreta02.src = "assets/torreta02.png";
assets.torreta03.src = "assets/torreta03.png";

/* ===== CLASSES ===== */
class Torre {
    constructor(x, y, tipo) {
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.range = 150; // alcance
        this.damage = 10; // dano
        this.attackSpeed = 60; // frames entre ataques
        this.cooldown = 0;
        this.image = assets[tipo];
    }

    atacar() {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        // Procura o primeiro monstro na faixa
        for (let monstro of monstros) {
            const dx = monstro.x - this.x;
            const dy = monstro.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= this.range) {
                monstro.hp -= this.damage;
                this.cooldown = this.attackSpeed;
                break;
            }
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x - 32, this.y - 32, 64, 64);
    }
}

class Monstro {
    constructor(x, y, hp, speed) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.speed = speed;
        this.alive = true;
    }

    mover() {
        // Movimento simples em direção ao núcleo
        const dx = nucleo.x + nucleo.width / 2 - this.x;
        const dy = nucleo.y + nucleo.height / 2 - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // Chegou no núcleo
        if (dist < 5) {
            nucleo.hp -= 5;
            this.alive = false;
        }
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
        // Barra de vida
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - 15, this.y - 20, 30 * (this.hp / 50), 5);
    }
}

/* ===== FUNÇÕES ===== */
function spawnMonstro() {
    // Spawn simples aleatório ao redor da tela
    const positions = [
        {x: 0, y: Math.random() * HEIGHT},
        {x: WIDTH, y: Math.random() * HEIGHT},
        {x: Math.random() * WIDTH, y: 0},
        {x: Math.random() * WIDTH, y: HEIGHT}
    ];
    const pos = positions[Math.floor(Math.random() * positions.length)];
    monstros.push(new Monstro(pos.x, pos.y, 50, 1.5));
}

function drawNucleo() {
    ctx.drawImage(assets.nucleo, nucleo.x, nucleo.y, nucleo.width, nucleo.height);
    // HP
    ctx.fillStyle = "green";
    ctx.fillRect(nucleo.x, nucleo.y - 10, nucleo.width * (nucleo.hp / 100), 5);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Núcleo
    drawNucleo();

    // Torres
    for (let torre of torres) {
        torre.draw();
        torre.atacar();
    }

    // Monstros
    for (let monstro of monstros) {
        monstro.draw();
        monstro.mover();
    }

    // Remover monstros mortos
    monstros = monstros.filter(m => m.alive && m.hp > 0);

    requestAnimationFrame(draw);
}

/* ===== EVENTO DE COLOCAR TORRES ===== */
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Adiciona torre do tipo canhão por padrão
    torres.push(new Torre(x, y, "torreta01"));
});

/* ===== SPAWN AUTOMÁTICO DE MONSTROS ===== */
setInterval(spawnMonstro, 2000); // a cada 2 segundos

/* ===== INICIA O JOGO ===== */
draw();
