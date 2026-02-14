// ============================
// FIREBASE IMPORTS
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
  apiKey: "AIzaSyD63vPgXEBns6E2P_c7L6NSSQrBe-krB_s",
  authDomain: "dominik-52ca9.firebaseapp.com",
  projectId: "dominik-52ca9",
  storageBucket: "dominik-52ca9.firebasestorage.app",
  messagingSenderId: "521924294228",
  appId: "1:521924294228:web:3796f8c925c1bb37cb5fc1",
  measurementId: "G-VV8WXGMK1V"
};

// ============================
// INICIALIZAR
// ============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ============================
// ELEMENTOS HTML
// ============================

const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const userStatus = document.getElementById("userStatus");
const loginModal = document.getElementById("loginModal");
const openLoginMenu = document.getElementById("openLoginMenu");

// ============================
// REGISTRO
// ============================

if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const email = emailInput.value;
        const senha = senhaInput.value;

        createUserWithEmailAndPassword(auth, email, senha)
            .then(() => {
                alert("Conta criada com sucesso!");
            })
            .catch(error => {
                alert("Erro: " + error.message);
            });
    });
}

// ============================
// LOGIN
// ============================

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const email = emailInput.value;
        const senha = senhaInput.value;

        signInWithEmailAndPassword(auth, email, senha)
            .then(() => {
                loginModal.style.display = "none";
            })
            .catch(error => {
                alert("Erro: " + error.message);
            });
    });
}

// ============================
// LOGOUT
// ============================

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        signOut(auth);
    });
}

// ============================
// DETECTAR USUÁRIO
// ============================

onAuthStateChanged(auth, (user) => {
    if (user) {
        userStatus.textContent = "Logado como: " + user.email;
        logoutBtn.style.display = "block";
    } else {
        userStatus.textContent = "Não logado";
        logoutBtn.style.display = "none";
    }
});

// ============================
// ABRIR LOGIN
// ============================

if (openLoginMenu) {
    openLoginMenu.addEventListener("click", () => {
        loginModal.style.display = "flex";
    });
}

