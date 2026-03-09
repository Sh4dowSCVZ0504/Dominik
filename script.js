// ================= ELEMENTOS =================

const sidebar = document.getElementById("sidebar");
const notebookText = document.getElementById("notebookText");
const snowContainer = document.getElementById("snowContainer");
const wallpaper = document.getElementById("wallpaper");

// ================= DRAW =================

const toggleDrawMode = document.getElementById("toggleDrawMode");
const drawContainer = document.getElementById("drawContainer");
const drawCanvas = document.getElementById("drawCanvas");
const drawColor = document.getElementById("drawColor");
const brushSize = document.getElementById("brushSize");
const eraserBtn = document.getElementById("eraserBtn");
const clearCanvas = document.getElementById("clearCanvas");

const ctx = drawCanvas.getContext("2d");

let isDrawing = false;
let isEraser = false;

// ================= AUDIO =================

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const musicVolume = document.getElementById("musicVolume");
const toggleClickSound = document.getElementById("toggleClickSound");

// ================= SLIDERS =================

const snowAmountSlider = document.getElementById("snowAmount");
const brightnessSlider = document.getElementById("brightness");

// ================= USER PROFILE =================

const usernameInput = document.getElementById("usernameInput");
const avatarInput = document.getElementById("avatarInput");
const saveProfileBtn = document.getElementById("saveProfile");

const usernameDisplay = document.getElementById("usernameDisplay");
const userAvatar = document.getElementById("userAvatar");

const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminTabBtn = document.getElementById("adminTabBtn");

const ADMIN_PASSWORD = "87236512";

// ================= NOTEBOOK SAVE =================

if (notebookText) {
notebookText.addEventListener("input", () => {
localStorage.setItem("dominik-notebook", notebookText.value);
});
}

// ================= LOAD =================

window.addEventListener("load", () => {

loadNotebook();
loadAudio();
loadSettings();
loadUser();
loadDrawing();

resizeCanvas();

});

// ================= LOAD FUNCTIONS =================

function loadNotebook(){

const savedText = localStorage.getItem("dominik-notebook");
if(savedText && notebookText) notebookText.value = savedText;

}

function loadAudio(){

const savedVolume = localStorage.getItem("dominik-musicVolume");

bgMusic.volume = savedVolume !== null ? savedVolume : musicVolume.value;

musicVolume.value = bgMusic.volume;

const savedClick = localStorage.getItem("dominik-clickSound");

if(savedClick !== null)
toggleClickSound.checked = savedClick === "true";

}

function loadSettings(){

const savedBrightness = localStorage.getItem("dominik-brightness");

if(savedBrightness){

brightnessSlider.value = savedBrightness;
wallpaper.style.filter = `brightness(${savedBrightness})`;

}

const savedSnow = localStorage.getItem("dominik-snow");

if(savedSnow) snowAmountSlider.value = savedSnow;

}

function loadUser(){

const savedName = localStorage.getItem("dominik-username");
const savedAvatar = localStorage.getItem("dominik-avatar");

if(savedName && usernameDisplay)
usernameDisplay.textContent = savedName;

if(savedAvatar && userAvatar)
userAvatar.src = savedAvatar;

}

function loadDrawing(){

const savedDrawing = localStorage.getItem("dominik-drawing");

if(savedDrawing){

const img = new Image();
img.src = savedDrawing;

img.onload = () => ctx.drawImage(img,0,0);

}

}

// ================= CLICK SOUND =================

document.addEventListener("click", () => {

if(!toggleClickSound.checked) return;

clickSound.currentTime = 0;

clickSound.play().catch(()=>{});

});

// ================= MUSIC =================

musicVolume.addEventListener("input", () => {

bgMusic.volume = musicVolume.value;

localStorage.setItem(
"dominik-musicVolume",
musicVolume.value
);

});

// ================= CANVAS =================

function resizeCanvas(){

const temp = document.createElement("canvas");

temp.width = drawCanvas.width;
temp.height = drawCanvas.height;

temp.getContext("2d").drawImage(drawCanvas,0,0);

drawCanvas.width = drawCanvas.offsetWidth;
drawCanvas.height = drawCanvas.offsetHeight;

ctx.drawImage(temp,0,0);

}

window.addEventListener("resize", resizeCanvas);

// ================= DRAW MODE =================

toggleDrawMode.addEventListener("click", () => {

const isHidden =
drawContainer.style.display === "none" ||
drawContainer.style.display === "";

drawContainer.style.display = isHidden ? "block" : "none";
notebookText.style.display = isHidden ? "none" : "block";

toggleDrawMode.textContent =
isHidden ? "📝 Modo Texto" : "🎨 Modo Desenho";

if(isHidden) setTimeout(resizeCanvas,50);

});

// ================= DRAW SYSTEM =================

function getPosition(e){

const rect = drawCanvas.getBoundingClientRect();

if(e.touches){

return{
x:e.touches[0].clientX-rect.left,
y:e.touches[0].clientY-rect.top
};

}

return{
x:e.clientX-rect.left,
y:e.clientY-rect.top
};

}

function startDrawing(e){

e.preventDefault();

isDrawing = true;

const pos = getPosition(e);

ctx.beginPath();
ctx.moveTo(pos.x,pos.y);

}

function stopDrawing(){

if(!isDrawing) return;

isDrawing = false;

ctx.beginPath();

saveCanvas();

}

function draw(e){

if(!isDrawing) return;

e.preventDefault();

const pos = getPosition(e);

ctx.lineWidth = brushSize.value;
ctx.lineCap = "round";

if(isEraser){

ctx.globalCompositeOperation = "destination-out";

}else{

ctx.globalCompositeOperation = "source-over";
ctx.strokeStyle = drawColor.value;

}

ctx.lineTo(pos.x,pos.y);
ctx.stroke();

}

// Mouse

drawCanvas.addEventListener("mousedown", startDrawing);
drawCanvas.addEventListener("mouseup", stopDrawing);
drawCanvas.addEventListener("mousemove", draw);
drawCanvas.addEventListener("mouseleave", stopDrawing);

// Touch

drawCanvas.addEventListener("touchstart", startDrawing,{passive:false});
drawCanvas.addEventListener("touchend", stopDrawing);
drawCanvas.addEventListener("touchmove", draw,{passive:false});

// ================= DRAW TOOLS =================

eraserBtn.addEventListener("click", () => {

isEraser = !isEraser;

eraserBtn.textContent =
isEraser ? "🖌️ Pincel" : "🧽 Borracha";

});

clearCanvas.addEventListener("click", () => {

ctx.clearRect(0,0,drawCanvas.width,drawCanvas.height);

localStorage.removeItem("dominik-drawing");

});

function saveCanvas(){

const dataURL = drawCanvas.toDataURL("image/png");

localStorage.setItem(
"dominik-drawing",
dataURL
);

}

// ================= SNOW SYSTEM =================

let flakes = [];

function createFlakes(count){

snowContainer.innerHTML = "";
flakes = [];

for(let i=0;i<count;i++){

const flake = document.createElement("div");

flake.classList.add("flake");

const size = Math.random()*6+4;

flake.style.width = size+"px";
flake.style.height = size+"px";

flake.style.top = Math.random()*window.innerHeight+"px";
flake.style.left = Math.random()*window.innerWidth+"px";

flake.speed = Math.random()*1+0.5;

snowContainer.appendChild(flake);

flakes.push(flake);

}

}

function animateSnow(){

flakes.forEach(flake => {

let top = parseFloat(flake.style.top);

top += flake.speed;

if(top > window.innerHeight){

top = -10;

flake.style.left =
Math.random()*window.innerWidth+"px";

}

flake.style.top = top+"px";

});

requestAnimationFrame(animateSnow);

}

createFlakes(parseInt(snowAmountSlider.value));

animateSnow();

snowAmountSlider.addEventListener("input", () => {

const amount = parseInt(snowAmountSlider.value);

localStorage.setItem("dominik-snow", amount);

createFlakes(amount);

});

// ================= WALLPAPER =================

brightnessSlider.addEventListener("input", () => {

wallpaper.style.filter =
`brightness(${brightnessSlider.value})`;

localStorage.setItem(
"dominik-brightness",
brightnessSlider.value
);

});

// ================= USER PROFILE =================

if(saveProfileBtn){

saveProfileBtn.addEventListener("click", () => {

const name = usernameInput.value.trim();
const avatar = avatarInput.value.trim();

if(name){

localStorage.setItem("dominik-username",name);

if(usernameDisplay)
usernameDisplay.textContent = name;

}

if(avatar){

localStorage.setItem("dominik-avatar",avatar);

if(userAvatar)
userAvatar.src = avatar;

}

alert("Perfil salvo!");

});

}

// ================= ADMIN =================

if(adminLoginBtn){

adminLoginBtn.addEventListener("click", () => {

const pass = prompt("Digite a senha ADMIN");

if(pass === ADMIN_PASSWORD){

if(adminTabBtn)
adminTabBtn.style.display = "flex";

alert("Acesso ADMIN liberado!");

}else{

alert("Senha incorreta");

}

});

}
