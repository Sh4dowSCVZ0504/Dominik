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

        switch(tipo) {
            case "torreta01": // Canhão
                this.range = 150;
                this.damage = 15;
                this.attackSpeed = 60;
                this.custo = 20;
                break;
            case "torreta02": // Flechas
                this.range = 200;
                this.damage = 10;
                this.attackSpeed = 30;
                this.custo = 25;
                break;
            case "torreta03": // Mago
                this.range = 120;
                this.damage = 25;
                this.attackSpeed = 90;
                this.custo = 35;
                break;
        }

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
    constructor(x, y, tipo="Normal") {
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.alive = true;

        if (tipo === "Normal") {
            this.hp = 50;
            this.speed = 1;
            this.valor = 10;
        } else if (tipo === "Especial") {
            this.hp = 100;
            this.speed = 1.2;
            this.valor = 20;
        } else if (tipo === "Equipado") {
            this.hp = 75;
            this.speed = 0.8;
            this.valor = 30;
        }
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
        ctx.fillStyle = this.tipo === "Normal" ? "red" : this.tipo === "Especial" ? "orange" : "purple";
        ctx.fillRect(this.x - 15, this.y - 15, 30, 30);

        // Barra de vida
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - 15, this.y - 20, 30 * (this.hp / this.maxHp()), 5);
    }

    maxHp() {
        switch(this.tipo) {
            case "Normal": return 50;
            case "Especial": return 100;
            case "Equipado": return 75;
        }
    }
}

/* ===== SPAWN DE MONSTROS ===== */
function spawnMonstrosFase(fase, round) {
    let qtd = round + Math.floor(fase/2); // quantidade aumenta conforme a fase
    for (let i = 0; i < qtd; i++) {
        const positions = [
            {x:0, y:Math.random()*HEIGHT},
            {x:WIDTH, y:Math.random()*HEIGHT},
            {x:Math.random()*WIDTH, y:0},
            {x:Math.random()*WIDTH, y:HEIGHT}
        ];
        const pos = positions[Math.floor(Math.random()*positions.length)];

        // Monstros especiais a cada 5 rounds
        let tipo = "Normal";
        if (round % 5 === 0) tipo = "Especial";
        else if (round % 3 === 0) tipo = "Equipado";

        monstros.push(new Monstro(pos.x, pos.y, tipo));
    }
}

/* ===== DRAW ===== */
function drawNucleo() {
    ctx.drawImage(assets.nucleo, nucleo.x, nucleo.y, nucleo.width, nucleo.height);
    ctx.fillStyle = "green";
    ctx.fillRect(nucleo.x, nucleo.y - 10, nucleo.width*(nucleo.hp/100), 5);
}

function drawHUD() {
    ctx.fillStyle = "#00ffff";
    ctx.font = "20px JetBrains Mono";
    ctx.fillText(`Moeda: ${moeda}`, 20, 30);
    ctx.fillText(`Fase: ${faseAtual} / 10`, 20, 60);
    ctx.fillText(`Round: ${roundAtual} / 30`, 20, 90);
}

function draw() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);

    drawNucleo();
    drawHUD();

    for (let torre of torres) { torre.draw(); torre.atacar(); }
    for (let monstro of monstros) { monstro.draw(); monstro.mover(); }

    // Remover monstros mortos e dar moeda
    for (let i = monstros.length-1; i >=0; i--) {
        if (!monstros[i].alive || monstros[i].hp <= 0) {
            moeda += monstros[i].valor;
            monstros.splice(i,1);
        }
    }

    // Checagem de vitória ou derrota
    if (nucleo.hp <= 0) {
        alert("Você perdeu! Núcleo destruído!");
        location.reload();
    } else if (faseAtual > 10) {
        alert("Parabéns! Você venceu todas as fases!");
        location.reload();
    }

    requestAnimationFrame(draw);
}

/* ===== COLOCAR TORRES ===== */
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Abre menu de seleção de torre (simples)
    let tipoEscolhido = prompt("Escolha a torre: 1-Canhão, 2-Flechas, 3-Mago", "1");
    let tipo = tipoEscolhido === "2" ? "torreta02" : tipoEscolhido === "3" ? "torreta03" : "torreta01";

    // Verifica se tem moeda suficiente
    const tempTorre = new Torre(x, y, tipo);
    if (moeda >= tempTorre.custo) {
        torres.push(tempTorre);
        moeda -= tempTorre.custo;
    } else {
        alert("Moeda insuficiente!");
    }
});

/* ===== ROUNDS E FASES ===== */
function iniciarRound() {
    if (roundAtual > 30) {
        faseAtual++;
        roundAtual = 1;
        alert(`Fase ${faseAtual} iniciando!`);
    }
    if (faseAtual <= 10) {
        spawnMonstrosFase(faseAtual, roundAtual);
        roundAtual++;
    }
}

// Spawn automático de rounds a cada 10s
setInterval(iniciarRound, 10000);

/* ===== INICIA O JOGO ===== */
draw();
