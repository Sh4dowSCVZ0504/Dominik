/* ===== CONFIGURAÇÕES ===== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let torres = [];
let monstros = [];
let moeda = 100; // dinheiro inicial
let faseAtual = 1;
let roundAtual = 1;

/* ===== NÚCLEO ===== */
const nucleo = {
    x: WIDTH / 2 - 32,
    y: HEIGHT / 2 - 32,
    width: 64,
    height: 64,
    hp: 100
};

/* ===== IMAGENS ===== */
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
        this.range = 150;
        this.damage = tipo === "torreta03" ? 20 : 10;
        this.attackSpeed = tipo === "torreta02" ? 30 : 60;
        this.cooldown = 0;
        this.image = assets[tipo];
    }

    atacar() {
        if (this.cooldown > 0) { this.cooldown--; return; }

        for (let monstro of monstros) {
            const dx = monstro.x - this.x;
            const dy = monstro.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
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
    constructor(x, y, hp, speed, valor, tipo="Normal") {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.speed = speed;
        this.valor = valor;
        this.tipo = tipo;
        this.alive = true;
    }

    mover() {
        const dx = nucleo.x + nucleo.width/2 - this.x;
        const dy = nucleo.y + nucleo.height/2 - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > 0) {
            this.x += (dx/dist) * this.speed;
            this.y += (dy/dist) * this.speed;
        }

        if (dist < 5) {
            nucleo.hp -= 5;
            this.alive = false;
        }
    }

    draw() {
        ctx.fillStyle = this.tipo === "Normal" ? "red" : "orange";
        ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - 15, this.y - 20, 30 * (this.hp/this.maxHp()), 5);
    }

    maxHp() {
        return this.tipo === "Normal" ? 50 : 100;
    }
}

/* ===== SPAWN DE MONSTROS POR ROUND ===== */
function spawnMonstrosFase(fase, round) {
    let qtd = round; // quantidade de monstros = round atual
    for (let i = 0; i < qtd; i++) {
        const positions = [
            {x: 0, y: Math.random()*HEIGHT},
            {x: WIDTH, y: Math.random()*HEIGHT},
            {x: Math.random()*WIDTH, y: 0},
            {x: Math.random()*WIDTH, y: HEIGHT}
        ];
        const pos = positions[Math.floor(Math.random()*positions.length)];

        // Monstros especiais a cada 5 rounds
        if (round % 5 === 0) {
            monstros.push(new Monstro(pos.x, pos.y, 100, 1.2, 20, "Especial"));
        } else {
            monstros.push(new Monstro(pos.x, pos.y, 50, 1, 10));
        }
    }
}

/* ===== DRAW ===== */
function drawNucleo() {
    ctx.drawImage(assets.nucleo, nucleo.x, nucleo.y, nucleo.width, nucleo.height);
    ctx.fillStyle = "green";
    ctx.fillRect(nucleo.x, nucleo.y - 10, nucleo.width*(nucleo.hp/100), 5);
}

function draw() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);

    drawNucleo();

    for (let torre of torres) { torre.draw(); torre.atacar(); }

    for (let monstro of monstros) { monstro.draw(); monstro.mover(); }

    // Remover monstros mortos e dar moeda
    for (let i = monstros.length-1; i >=0; i--) {
        if (!monstros[i].alive || monstros[i].hp <= 0) {
            moeda += monstros[i].valor;
            monstros.splice(i,1);
        }
    }

    requestAnimationFrame(draw);
}

/* ===== COLOCAR TORRES ===== */
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (moeda >= 20) { // custo da torre
        torres.push(new Torre(x, y, "torreta01"));
        moeda -= 20;
    }
});

/* ===== CONTROLE DE ROUNDS E FASES ===== */
function iniciarRound() {
    if (roundAtual > 30) {
        faseAtual++;
        roundAtual = 1;
        alert(`Fase ${faseAtual} iniciando!`);
    }
    if (faseAtual > 10) {
        alert("Parabéns! Você venceu todas as fases!");
        return;
    }

    spawnMonstrosFase(faseAtual, roundAtual);
    roundAtual++;
}

// Inicia rounds automaticamente a cada 10s
setInterval(iniciarRound, 10000);

/* ===== INICIA O JOGO ===== */
draw();
