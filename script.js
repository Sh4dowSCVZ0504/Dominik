// ===== ELEMENTOS =====
const openSidebarBtn = document.getElementById("openSidebar");
const sidebar = document.getElementById("sidebar");
const openNotebookBtn = document.getElementById("openNotebook");
const notebook = document.getElementById("notebook");
const notebookText = document.getElementById("notebookText");
const snowContainer = document.getElementById("snowContainer");
const openConfigBtn = document.getElementById("openConfig");

// ===== BACKDROP E MENU DE CONFIG =====
const body = document.body;
let configBackdrop = document.getElementById("configBackdrop");
let configMenu = document.getElementById("configMenu");

// Criar backdrop se não existir
if (!configBackdrop) {
    configBackdrop = document.createElement("div");
    configBackdrop.id = "configBackdrop";
    document.body.appendChild(configBackdrop);
}

// Sliders
const snowAmountSlider = document.getElementById("snowAmount");
const brightnessSlider = document.getElementById("brightness");
const sidebarWidthSlider = document.getElementById("sidebarWidth");

// ===== ABRIR / FECHAR SIDEBAR =====
openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// ===== ABRIR / FECHAR CADERNO =====
openNotebookBtn.addEventListener("click", () => {
    notebook.classList.toggle("active");
});

// ===== ABRIR / FECHAR MENU DE CONFIGURAÇÕES =====
openConfigBtn.addEventListener("click", () => {
    configMenu.classList.add("active");
    configBackdrop.style.opacity = "1";
    configBackdrop.style.pointerEvents = "auto";
});

// Fechar menu ao clicar no backdrop
configBackdrop.addEventListener("click", () => {
    configMenu.classList.remove("active");
    configBackdrop.style.opacity = "0";
    configBackdrop.style.pointerEvents = "none";
});

// ===== SALVAR TEXTO AUTOMATICAMENTE =====
notebookText.addEventListener("input", () => {
    localStorage.setItem("dominik-notebook", notebookText.value);
});

// ===== CARREGAR TEXTO SALVO =====
window.addEventListener("load", () => {
    const savedText = localStorage.getItem("dominik-notebook");
    if (savedText) {
        notebookText.value = savedText;
    }
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
        flake.style.height = "auto";

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
        left += Math.sin(flake.angle * (Math.PI / 180)) * 0.5;
        flake.angle += flake.angleSpeed;
        flake.style.transform = `rotate(${flake.angle}deg)`;

        if (top > window.innerHeight) {
            top = -50;
            left = Math.random() * window.innerWidth;
        }
        if (left > window.innerWidth) left = 0;
        if (left < 0) left = window.innerWidth;

        flake.style.top = `${top}px`;
        flake.style.left = `${left}px`;
    }
    requestAnimationFrame(animateSnow);
}

animateSnow();

window.addEventListener("resize", () => {
    for (let flake of flakes) {
        let left = parseFloat(flake.style.left);
        if (left > window.innerWidth) flake.style.left = Math.random() * window.innerWidth + "px";
    }
});

// ===== CONTROLES DOS SLIDERS =====
snowAmountSlider.addEventListener("input", () => {
    flocoCount = parseInt(snowAmountSlider.value);
    createFlakes(flocoCount);
});

brightnessSlider.addEventListener("input", () => {
    document.body.style.filter = `brightness(${brightnessSlider.value})`;
});

sidebarWidthSlider.addEventListener("input", () => {
    sidebar.style.width = `${sidebarWidthSlider.value}px`;
});
