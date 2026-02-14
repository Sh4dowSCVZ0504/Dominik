// ============================
// FIREBASE IMPORTS (MODULE)
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
// CONFIG FIREBASE
// ============================

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// ============================
// INICIALIZAR FIREBASE
// ============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ============================
// ELEMENTOS HTML
// ============================

const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginMenu"); // 🔥 CORRIGIDO
const closeLoginBtn = document.getElementById("closeLogin");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const emailInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const userDisplay = document.getElementById("userDisplay");

// ============================
// ABRIR / FECHAR MODAL
// ============================

if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });
}

if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener("click", () => {
        loginModal.style.display = "none";
    });
}

// ============================
// REGISTRAR
// ============================

if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Conta criada com sucesso!");
            clearInputs();
            loginModal.style.display = "none";
        } catch (error) {
            alert("Erro: " + error.message);
        }
    });
}

// ============================
// LOGIN
// ============================

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            clearInputs();
            loginModal.style.display = "none";
        } catch (error) {
            alert("Erro: " + error.message);
        }
    });
}

// Login com Enter
if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            loginBtn.click();
        }
    });
}

// ============================
// LOGOUT
// ============================

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
    });
}

// ============================
// OBSERVAR ESTADO DO USUÁRIO
// ============================

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (userDisplay) userDisplay.textContent = "👤 " + user.email;
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (userDisplay) userDisplay.textContent = "Não logado";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});

// ============================
// FUNÇÃO AUXILIAR
// ============================

function clearInputs() {
    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
}
