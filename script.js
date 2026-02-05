// ===== ELEMENTOS =====
const openSidebarBtn = document.getElementById("openSidebar");
const sidebar = document.getElementById("sidebar");
const openNotebookBtn = document.getElementById("openNotebook");
const notebook = document.getElementById("notebook");
const notebookText = document.getElementById("notebookText");
const snowContainer = document.getElementById("snowContainer");
const openConfigBtn = document.getElementById("openConfig");
const wallpaper = document.getElementById("wallpaper");

// ===== BACKDROP E MENU DE CONFIG =====
const configBackdrop = document.getElementById("configBackdrop");
const configMenu = document.getElementById("configMenu");

// ===== SLIDERS =====
const snowAmountSlider = document.getElementById("snowAmount");
const brightnessSlider = document.getElementById("brightness");
const sidebarWidthSlider = document.getElementById("sidebarWidth");

// ===== ABRIR / FECHAR SIDEBAR (CSS CONTROLA TUDO) =====
openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// ===== ABRIR / FECHAR CADERNO =====
openNotebookBtn.addEventListener("click", () => {
    notebook.classList.toggle("active");
});

// ===== ABRIR MENU DE CONFIG =====
openConfigBtn.addEventListener("click", () => {
    configMenu.classList.add("active");
    configBackdrop.style.opacity = "1";
    configBackdrop.style.pointerEvents = "auto";
});

// ===== FECHAR MENU AO CLICAR NO BACKDROP =====
configBackdrop.addEventListener("click", () => {
    configMenu.classList.remove("active");
    configBackdrop.style.opacity = "0";
    configBackdrop.style.pointerEvents = "none";
});

// ===== SALVAR TEXTO DO CADERNO =====
notebookText.addEventListener("input", () => {
    localStorage.setItem("dominik-notebook", notebookText.value);
});

// ===== CARREGAR TEXTO SALVO =====
window.addEventListener("load", () => {
    const savedText = localStorage.getItem("dominik-notebook");
    if (savedText) notebookText.value = savedText;
});

// ===== NEVE ANIMADA =====
let flocoCount = parseInt(snowAmountSlider.value);
let flakes = [];

function createFlakes(count) {
    snowContainer.innerHTML = "";
    flakes = [];

    for (let i = 0; i < count; i++) {
        const flake = document.createElement("img");
        flake.src = "assets/neve.png";
        flake.classList.add("flake");

        const size = Math.random() * 20 + 10;
        flake.style.width = `${size}px`;
        flake.style.position = "absolute";
        flake.style.top = `${Math.random() * window.innerHeight}px`;
        flake.style.left = `${Math.random() * window.innerWidth}px`;

        flake.speed = Math.random() * 1 + 0.5;
        flake.angle = Math.random() * 360;
        flake.angleSpeed = (Math.random() - 0.5) * 0.5;

        snowContainer.appendChild(flake);
        flakes.push(flake);
    }
}

createFlakes(flocoCount);

function animateSnow() {
    for (let flake of flakes) {
        let top = parseFloat(flake.style.top);
        let left = parseFloat(flake.style.left);

        top += flake.speed;
        left += Math.sin(flake.angle * Math.PI / 180) * 0.5;
        flake.angle += flake.angleSpeed;

        if (top > window.innerHeight) {
            top = -50;
            left = Math.random() * window.innerWidth;
        }

        if (left > window.innerWidth) left = 0;
        if (left < 0) left = window.innerWidth;

        flake.style.top = `${top}px`;
        flake.style.left = `${left}px`;
        flake.style.transform = `rotate(${flake.angle}deg)`;
    }
    requestAnimationFrame(animateSnow);
}

animateSnow();

window.addEventListener("resize", () => {
    flakes.forEach(flake => {
        if (parseFloat(flake.style.left) > window.innerWidth) {
            flake.style.left = Math.random() * window.innerWidth + "px";
        }
    });
});

// ===== CONTROLES DOS SLIDERS =====

// Quantidade de neve
snowAmountSlider.addEventListener("input", () => {
    flocoCount = parseInt(snowAmountSlider.value);
    createFlakes(flocoCount);
});

// Brilho (SOMENTE NO WALLPAPER)
brightnessSlider.addEventListener("input", () => {
    wallpaper.style.filter = `brightness(${brightnessSlider.value})`;
});

// Largura da sidebar (SEM QUEBRAR)
sidebarWidthSlider.addEventListener("input", () => {
    sidebar.style.width = sidebarWidthSlider.value + "px";
});
