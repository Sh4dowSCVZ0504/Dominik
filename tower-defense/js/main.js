window.addEventListener("DOMContentLoaded", () => {

    /* ===== ELEMENTOS ===== */
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const playBtn = document.getElementById("playBtn");
    const configBtn = document.getElementById("configBtn");
    const soundBtn = document.getElementById("soundBtn");
    const backBtn = document.getElementById("backBtn");

    const menu = document.getElementById("menu");
    const configMenu = document.getElementById("config");

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    /* ===== VARIÁVEIS ===== */
    let torres = [];
    let monstros = [];
    let projeteis = [];
    let moeda = 100;
    let faseAtual = 1;
    let roundAtual = 1;
    let soundOn = true;

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

            switch (tipo) {
                case "torreta01":
                    this.range = 150; this.damage = 15; this.attackSpeed = 60; this.custo = 20; break;
                case "torreta02":
                    this.range = 200; this.damage = 10; this.attackSpeed = 30; this.custo = 25; break;
                case "torreta03":
                    this.range = 120; this.damage = 25; this.attackSpeed = 90; this.custo = 35; break;
            }

            this.cooldown = 0;
            this.image = assets[tipo];
        }

        atacar() {
            if (this.cooldown > 0) { this.cooldown--; return; }

            for (let monstro of monstros) {
                const dx = monstro.x - this.x;
                const dy = monstro.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= this.range) {
                    projeteis.push(new Projetil(this.x, this.y, monstro, this.damage));
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
        constructor(caminho, tipo = "Normal") {
            this.caminho = caminho;
            this.pontoAtual = 0;
            this.x = caminho[0].x;
            this.y = caminho[0].y;
            this.tipo = tipo;
            this.alive = true;

            if (tipo === "Normal") { this.hp = 50; this.speed = 1; this.valor = 10; }
            else if (tipo === "Especial") { this.hp = 100; this.speed = 1.2; this.valor = 20; }
            else { this.hp = 75; this.speed = 0.8; this.valor = 30; }
        }

        mover() {
            if (this.pontoAtual >= this.caminho.length) {
                nucleo.hp -= 5;
                this.alive = false;
                return;
            }

            const target = this.caminho[this.pontoAtual];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > this.speed) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            } else {
                this.x = target.x;
                this.y = target.y;
                this.pontoAtual++;
            }
        }

        draw() {
            ctx.fillStyle = this.tipo === "Normal" ? "red" :
                this.tipo === "Especial" ? "orange" : "purple";

            ctx.fillRect(this.x - 15, this.y - 15, 30, 30);

            ctx.fillStyle = "green";
            ctx.fillRect(this.x - 15, this.y - 20, 30 * (this.hp / this.maxHp()), 5);
        }

        maxHp() {
            if (this.tipo === "Normal") return 50;
            if (this.tipo === "Especial") return 100;
            return 75;
        }
    }

    class Projetil {
        constructor(x, y, alvo, dano) {
            this.x = x;
            this.y = y;
            this.alvo = alvo;
            this.dano = dano;
            this.speed = 5;
            this.alive = true;
        }

        mover() {
            if (!this.alvo.alive) {
                this.alive = false;
                return;
            }

            const dx = this.alvo.x - this.x;
            const dy = this.alvo.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.speed) {
                this.alvo.hp -= this.dano;
                this.alive = false;
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }

        draw() {
            ctx.fillStyle = "#00ffff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const mapas = [
        [{ x: 0, y: 100 }, { x: 300, y: 100 }, { x: 300, y: 400 }, { x: WIDTH / 2, y: HEIGHT / 2 }],
        [{ x: WIDTH, y: 50 }, { x: 800, y: 50 }, { x: 800, y: 500 }, { x: WIDTH / 2, y: HEIGHT / 2 }],
    ];

    function spawnMonstrosFase(fase, round) {
        let qtd = round + Math.floor(fase / 2);
        for (let i = 0; i < qtd; i++) {
            const caminho = mapas[(fase - 1) % mapas.length];
            let tipo = "Normal";
            if (round % 5 === 0) tipo = "Especial";
            else if (round % 3 === 0) tipo = "Equipado";
            monstros.push(new Monstro(caminho, tipo));
        }
    }

    function draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        ctx.drawImage(assets.nucleo, nucleo.x, nucleo.y, nucleo.width, nucleo.height);

        torres.forEach(t => { t.draw(); t.atacar(); });
        monstros.forEach(m => { m.draw(); m.mover(); });
        projeteis.forEach(p => { p.draw(); p.mover(); });

        for (let i = monstros.length - 1; i >= 0; i--) {
            if (!monstros[i].alive || monstros[i].hp <= 0) {
                moeda += monstros[i].valor;
                monstros.splice(i, 1);
            }
        }

        projeteis = projeteis.filter(p => p.alive);

        if (nucleo.hp <= 0) {
            alert("Você perdeu!");
            location.reload();
        }

        requestAnimationFrame(draw);
    }

    function iniciarRound() {
        spawnMonstrosFase(faseAtual, roundAtual);
        roundAtual++;
    }

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let escolha = prompt("1-Canhão | 2-Flechas | 3-Mago", "1");
        let tipo = escolha === "2" ? "torreta02" :
            escolha === "3" ? "torreta03" : "torreta01";

        const tempTorre = new Torre(x, y, tipo);

        if (moeda >= tempTorre.custo) {
            torres.push(tempTorre);
            moeda -= tempTorre.custo;
        } else {
            alert("Moeda insuficiente!");
        }
    });

    /* ===== MENU FUNCIONAL ===== */

    playBtn.addEventListener("click", () => {
        menu.style.display = "none";
        canvas.style.display = "block";
        draw();
        setInterval(iniciarRound, 10000);
    });

    configBtn.addEventListener("click", () => {
        menu.style.display = "none";
        configMenu.style.display = "flex";
    });

    backBtn.addEventListener("click", () => {
        configMenu.style.display = "none";
        menu.style.display = "flex";
    });

    soundBtn.addEventListener("click", () => {
        soundOn = !soundOn;
        soundBtn.textContent = soundOn ? "Som: On" : "Som: Off";
    });

});
