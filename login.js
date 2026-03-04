// ============================
// 🔥 FIREBASE IMPORTS (MODULE)
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ============================
// ⚙ CONFIG FIREBASE
// ============================

const firebaseConfig = {
  apiKey: "AIzaSyD63vPgXEBns6E2P_c7L6NSSQrBe-krB_s",
  authDomain: "dominik-52ca9.firebaseapp.com",
  projectId: "dominik-52ca9",
  storageBucket: "dominik-52ca9.firebasestorage.app",
  messagingSenderId: "521924294228",
  appId: "1:521924294228:web:3796f8c925c1bb37cb5fc1",
  measurementId: "G-VV8WXGMK1V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ============================
// 🎯 ELEMENTOS
// ============================

const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginMenu");
const closeLoginBtn = document.getElementById("closeLogin");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const userDisplay = document.getElementById("userDisplay");

// ============================
// 🪟 MODAL CONTROL
// ============================

function openModal() {
    if (loginModal) loginModal.style.display = "flex";
}

function closeModal() {
    if (loginModal) loginModal.style.display = "none";
}

if (openLoginBtn) openLoginBtn.addEventListener("click", openModal);
if (closeLoginBtn) closeLoginBtn.addEventListener("click", closeModal);

// Fecha ao clicar fora
window.addEventListener("click", (e) => {
    if (e.target === loginModal) closeModal();
});

// ============================
// 🆕 REGISTRAR
// ============================

if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage("Preencha todos os campos.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            showMessage("Conta criada com sucesso! 🔥");
            clearInputs();
            closeModal();
        } catch (error) {
            showMessage("Erro: " + error.message);
        }
    });
}

// ============================
// 🔐 LOGIN
// ============================

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage("Preencha todos os campos.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showMessage("Login realizado com sucesso! 👑");
            clearInputs();
            closeModal();
        } catch (error) {
            showMessage("Erro: " + error.message);
        }
    });
}

// Enter para login
if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
}

// ============================
// 🚪 LOGOUT
// ============================

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        showMessage("Você saiu da conta.");
    });
}

// ============================
// 👁 OBSERVADOR DE SESSÃO
// ============================

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (userDisplay) {
            const username = user.email.split("@")[0];
            userDisplay.textContent = "👤 " + username;
        }

        if (logoutBtn) logoutBtn.style.display = "block";
    } else {
        if (userDisplay) userDisplay.textContent = "Não logado";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});

// ============================
// 🧼 UTILITÁRIOS
// ============================

function clearInputs() {
    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
}

function showMessage(message) {
    console.log(message);
    alert(message); // pode trocar por sistema visual depois
}
