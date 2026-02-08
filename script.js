// ===== ELEMENTOS =====
const openSidebarBtn = document.getElementById("openSidebar");
const sidebar = document.getElementById("sidebar");
const openNotebookBtn = document.getElementById("openNotebook");
const notebook = document.getElementById("notebook");
const notebookText = document.getElementById("notebookText");
const snowContainer = document.getElementById("snowContainer");
const openConfigBtn = document.getElementById("openConfig");
const wallpaper = document.getElementById("wallpaper");

// ===== MODO DESENHO =====
const toggleDrawMode = document.getElementById("toggleDrawMode");
const drawContainer = document.getElementById("drawContainer");
const drawCanvas = document.getElementById("drawCanvas");
const drawColor = document.getElementById("drawColor");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraserBtn");
const clearCanvas = document.getElementById("clearCanvas");

let isDrawing = false;
let isEraser = false;
const ctx = drawCanvas.getContext("2d");

// ===== ÁUDIO =====
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const musicVolume = document.getElementById("musicVolume");
const toggleClickSound = document.getElementById("toggleClickSound");
const compactMode = document.getElementById("compactMode");
const toggleMusicBtn = document.getElementById("toggleMusicBtn");

// ===== NEXUS =====
const openNexusMenu = document.getElementById("openNexusMenu");
const nexusModal = document.getElementById("nexusModal");
const nexusModalBackdrop = document.getElementById("nexusModalBackdrop");
const confirmNexus = document.getElementById("confirmNexus");
const launchNexus = document.getElementById("launchNexus");

// ===== CONFIG =====
const configBackdrop = document.getElementById("configBackdrop");
const configMenu = document.getElementById("configMenu");

// ===== SLIDERS =====
const snowAmountSlider = document.getElementById("snowAmount");
const brightnessSlider = document.getElementById("brightness");
const sidebarWidthSlider = document.getElementById("sidebarWidth");

// ===== SIDEBAR =====
openSidebarBtn.addEventListener("click", () => sidebar.classList.toggle("active"));

// ===== CADERNO =====
openNotebookBtn.addEventListener("click", () => notebook.classList.toggle("active"));

notebookText.addEventListener("input", () => {
    localStorage.setItem("dominik-notebook", notebookText.value);
});

// ===== CONFIG =====
openConfigBtn.addEventListener("click", () => {
    configMenu.classList.add("active");
    configBackdrop.style.opacity = "1";
    configBackdrop.style.pointerEvents = "auto";
});

configBackdrop.addEventListener("click", () => {
    configMenu.classList.remove("active");
    configBackdrop.style.opacity = "0";
    configBackdrop.style.pointerEvents = "none";
});

// ===== CARREGAR DADOS =====
window.addEventListener("load", () => {

    const savedText = localStorage.getItem("dominik-notebook");
    if (savedText) notebookText.value = savedText;

    const savedVolume = localStorage.getItem("dominik-musicVolume");
    bgMusic.volume = savedVolume !== null ? savedVolume : musicVolume.value;
    musicVolume.value = bgMusic.volume;

    const savedClick = localStorage.getItem("dominik-clickSound");
    if (savedClick !== null) toggleClickSound.checked = savedClick === "true";

    const savedCompact = localStorage.getItem("dominik-compact");
    if (savedCompact === "true") {
        compactMode.checked = true;
        document.body.classList.add("compact-mode");
    }

    const savedMusic = localStorage.getItem("dominik-musicON");
    if (savedMusic === "true") {
        toggleMusicBtn.textContent = "ON";
    } else {
        toggleMusicBtn.textContent = "OFF";
        bgMusic.pause();
    }

    resizeCanvas();

    const savedDrawing = localStorage.getItem("dominik-drawing");
    if (savedDrawing) {
        const img = new Image();
        img.src = savedDrawing;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
});

// ===== MÚSICA =====
toggleMusicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            toggleMusicBtn.textContent = "ON";
            localStorage.setItem("dominik-musicON", "true");
        });
    } else {
        bgMusic.pause();
        toggleMusicBtn.textContent = "OFF";
        localStorage.setItem("dominik-musicON", "false");
    }
});

musicVolume.addEventListener("input", () => {
    bgMusic.volume = musicVolume.value;
    localStorage.setItem("dominik-musicVolume", musicVolume.value);
});

document.addEventListener("click", e => {
    if (e.target.closest(".play-click") && toggleClickSound.checked) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
});

toggleClickSound.addEventListener("change", () => {
    localStorage.setItem("dominik-clickSound", toggleClickSound.checked);
});

compactMode.addEventListener("change", () => {
    document.body.classList.toggle("compact-mode", compactMode.checked);
    localStorage.setItem("dominik-compact", compactMode.checked);
});

// ===== NEXUS =====
openNexusMenu.addEventListener("click", () => {
    nexusModal.classList.add("active");
    nexusModalBackdrop.classList.add("active");
});

nexusModalBackdrop.addEventListener("click", () => {
    nexusModal.classList.remove("active");
    nexusModalBackdrop.classList.remove("active");
    confirmNexus.checked = false;
    launchNexus.disabled = true;
});

confirmNexus.addEventListener("change", () => {
    launchNexus.disabled = !confirmNexus.checked;
});

launchNexus.addEventListener("click", () => {
    window.open(
        "https://sh4dowscvz0504.github.io/Dominik/tower-defense/",
        "_blank"
    );
});

// ===== MODO DESENHO LÓGICA =====
function resizeCanvas() {
    const imageData = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    drawCanvas.width = drawCanvas.offsetWidth;
    drawCanvas.height = drawCanvas.offsetHeight;
    ctx.putImageData(imageData, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

toggleDrawMode.addEventListener("click", () => {
    const isHidden = drawContainer.style.display === "none";
    drawContainer.style.display = isHidden ? "block" : "none";
    notebookText.style.display = isHidden ? "none" : "block";
    toggleDrawMode.textContent = isHidden ? "📝 Modo Texto" : "🎨 Modo Desenho";
    if (isHidden) resizeCanvas();
});

function getPosition(e) {
    const rect = drawCanvas.getBoundingClientRect();
    if (e.touches) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.beginPath();
    saveCanvas();
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getPosition(e);

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";

    if (isEraser) {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = drawColor.value;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

drawCanvas.addEventListener("mousedown", startDrawing);
drawCanvas.addEventListener("mouseup", stopDrawing);
drawCanvas.addEventListener("mousemove", draw);
drawCanvas.addEventListener("mouseleave", stopDrawing);

drawCanvas.addEventListener("touchstart", startDrawing, { passive: false });
drawCanvas.addEventListener("touchend", stopDrawing);
drawCanvas.addEventListener("touchmove", draw, { passive: false });

eraserBtn.addEventListener("click", () => {
    isEraser = !isEraser;
    eraserBtn.textContent = isEraser ? "🖌️ Pincel" : "🧽 Borracha";
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    localStorage.removeItem("dominik-drawing");
});

function saveCanvas() {
    const dataURL = drawCanvas.toDataURL("image/png");
    localStorage.setItem("dominik-drawing", dataURL);
}

// ===== NEVE =====
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
        if (top > window.innerHeight) top = -50, left = Math.random() * window.innerWidth;
        if (left > window.innerWidth) left = 0;
        if (left < 0) left = window.innerWidth;
        flake.style.top = `${top}px`;
        flake.style.left = `${left}px`;
        flake.style.transform = `rotate(${flake.angle}deg)`;
    }
    requestAnimationFrame(animateSnow);
}

animateSnow();

snowAmountSlider.addEventListener("input", () => {
    flocoCount = parseInt(snowAmountSlider.value);
    createFlakes(flocoCount);
});

brightnessSlider.addEventListener("input", () => {
    wallpaper.style.filter = `brightness(${brightnessSlider.value})`;
});

sidebarWidthSlider.addEventListener("input", () => {
    sidebar.style.width = sidebarWidthSlider.value + "px";
});
