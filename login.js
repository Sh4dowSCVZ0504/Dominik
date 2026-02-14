// ============================
// IMPORTS FIREBASE (MODULE)
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
// CONFIG DO SEU FIREBASE
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
const openLoginBtn = document.getElementById("openLogin");
const closeLoginBtn = document.getElementById("closeLogin");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const emailInput = document.getElementById("username"); // usa como email
const passwordInput = document.getElementById("password");

const userDisplay = document.getElementById("userDisplay");

// ============================
// ABRIR / FECHAR MODAL
// ============================

if (openLoginBtn) {
    openLoginBtn.onclick = () => {
        loginModal.style.display = "flex";
    };
}

if (closeLoginBtn) {
    closeLoginBtn.onclick = () => {
        loginModal.style.display = "none";
    };
}

// ============================
// REGISTRAR
// ============================

if (registerBtn) {
    registerBtn.onclick = async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Conta criada com sucesso!");
            loginModal.style.display = "none";
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };
}

// ============================
// LOGIN
// ============================

if (loginBtn) {
    loginBtn.onclick = async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            loginModal.style.display = "none";
        } catch (error) {
            alert("Erro: " + error.message);
        }
    };
}

// ============================
// LOGOUT
// ============================

if (logoutBtn) {
    logoutBtn.onclick = async () => {
        await signOut(auth);
    };
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
