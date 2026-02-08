// ===== ELEMENTOS =====
const openSidebarBtn = document.getElementById("openSidebar");
const sidebar = document.getElementById("sidebar");
const openNotebookBtn = document.getElementById("openNotebook");
const notebook = document.getElementById("notebook");
const notebookText = document.getElementById("notebookText");
const snowContainer = document.getElementById("snowContainer");
const openConfigBtn = document.getElementById("openConfig");
const wallpaper = document.getElementById("wallpaper");

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

// ===== BACKDROP E MENU DE CONFIG =====
const configBackdrop = document.getElementById("configBackdrop");
const configMenu = document.getElementById("configMenu");

// ===== SLIDERS =====
const snowAmountSlider = document.getElementById("snowAmount");
const brightnessSlider = document.getElementById("brightness");
const sidebarWidthSlider = document.getElementById("sidebarWidth");

// ===== SIDEBAR =====
openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// ===== CADERNO =====
openNotebookBtn.addEventListener("click", () => {
    notebook.classList.toggle("active");
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

// ===== SALVAR CADERNO =====
notebookText.addEventListener("input", () => {
    localStorage.setItem("dominik-notebook", notebookText.value);
});

// ===== CARREGAR DADOS =====
window.addEventListener("load", () => {
    const savedText = localStorage.getItem("dominik-notebook");
    if (savedText) notebookText.value = savedText;

    const savedVolume = localStorage.getItem("dominik-musicVolume");
    if (savedVolume) {
        musicVolume.value = savedVolume;
        bgMusic.volume = savedVolume;
    }

    const savedClick = localStorage.getItem("dominik-clickSound");
    if (savedClick !== null) {
        toggleClickSound.checked = savedClick === "true";
    }

    const savedCompact = localStorage.getItem("dominik-compact");
    if (savedCompact === "true") {
        compactMode.checked = true;
        document.body.classList.add("compact-mode");
    }
});

// ===== BOTÃO ON/OFF MÚSICA =====
toggleMusicBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.volume = musicVolume.value;
        bgMusic.play().then(() => {
            toggleMusicBtn.textContent = "OFF";
            console.log("Música ligada");
        }).catch(err => console.error("Erro ao tocar música:", err));
    } else {
        bgMusic.pause();
        toggleMusicBtn.textContent = "ON";
        console.log("Música pausada");
    }
});

// ===== SOM DE CLIQUE =====
document.addEventListener("click", (e) => {
    if (e.target.closest(".play-click") && toggleClickSound.checked) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
});

// ===== AJUSTAR VOLUME =====
musicVolume.addEventListener("input", () => {
    bgMusic.volume = musicVolume.value;
    localStorage.setItem("dominik-musicVolume", musicVolume.value);
});

// ===== TOGGLE CLICK =====
toggleClickSound.addEventListener("change", () => {
    localStorage.setItem("dominik-clickSound", toggleClickSound.checked);
});

// ===== COMPACT MODE =====
compactMode.addEventListener("change", () => {
    document.body.classList.toggle("compact-mode", compactMode.checked);
    localStorage.setItem("dominik-compact", compactMode.checked);
});

// ===== NEXUS MODAL =====
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

// ===== SLIDERS =====
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

