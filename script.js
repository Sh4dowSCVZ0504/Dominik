// ===== ELEMENTOS =====
const openSidebarBtn = document.getElementById("openSidebar");
const sidebar = document.getElementById("sidebar");
const openNotebookBtn = document.getElementById("openNotebook");
const notebook = document.getElementById("notebook");
const notebookText = document.getElementById("notebookText");
const snowContainer = document.getElementById("snowContainer");

// Elementos do menu de configurações
const configBtn = document.getElementById("openConfig"); // botão de config na sidebar
const configMenu = document.getElementById("configMenu");
const configBackdrop = document.getElementById("configBackdrop");

// Sliders de Configurações
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

// ===== ABRIR / FECHAR CONFIGURAÇÕES =====
configBtn.addEventListener("click", () => {
    configMenu.classList.add("active");
    configBackdrop.classList.add("active");
});

// Fechar config clicando no backdrop
configBackdrop.addEventListener("click", () => {
    configMenu.classList.remove("active");
    configBackdrop.classList.remove("active");
});

// ===== SALVAR TEXTO AUTOMATICAMENTE =====
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

// Função para criar flocos
function createFlakes(count) {
    snowContainer.innerHTML = "";
    flakes = [];

    for (let i = 0; i < count; i++) {
        const flake = document.createElement("img");
        flake.src = "assets/neve.png";
        flake.classList.add("flake");

        const size = Math.random() * 20 + 10; // 10px a 30px
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

// Inicializar flocos
createFlakes(flocoCount);

// Animar flocos
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

// Ajustar flocos ao redimensionar
window.addEventListener("resize", () => {
    for (let flake of flakes) {
        let left = parseFloat(flake.style.left);
        if (left > window.innerWidth) flake.style.left = Math.random() * window.innerWidth + "px";
    }
});

// ===== CONTROLES DOS SLIDERS =====

// Ajustar quantidade de neve
snowAmountSlider.addEventListener("input", () => {
    flocoCount = parseInt(snowAmountSlider.value);
    createFlakes(flocoCount);
});

// Ajustar brilho do wallpaper
brightnessSlider.addEventListener("input", () => {
    document.body.style.filter = `brightness(${brightnessSlider.value})`;
});

// Ajustar largura da sidebar
sidebarWidthSlider.addEventListener("input", () => {
    sidebar.style.width = `${sidebarWidthSlider.value}px`;
});
