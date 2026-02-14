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
// INICIALIZAR FIREBASE
// ============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ============================
// ELEMENTOS HTML
// ============================

const loginModal = document.getElementById("loginModal");
const loginBackdrop = document.getElementById("loginModalBackdrop");
const openLoginMenu = document.getElementById("openLoginMenu");

// ============================
// ABRIR / FECHAR MODAL
// ============================

if (openLoginMenu) {
    openLoginMenu.addEventListener("click", () => {
        loginModal.classList.add("active");
        loginBackdrop.classList.add("active");
    });
}

if (loginBackdrop) {
    loginBackdrop.addEventListener("click", () => {
        loginModal.classList.remove("active");
        loginBackdrop.classList.remove("active");
    });
}

// ============================
// FUNÇÃO REGISTRAR (usada no HTML)
// ============================

window.register = function(email, senha) {

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
            alert("Conta criada com sucesso!");
        })
        .catch(error => {
            alert("Erro: " + error.message);
        });
};

// ============================
// FUNÇÃO LOGIN (usada no HTML)
// ============================

window.login = function(email, senha) {

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            loginModal.classList.remove("active");
            loginBackdrop.classList.remove("active");
        })
        .catch(error => {
            alert("Erro: " + error.message);
        });
};

// ============================
// FUNÇÃO LOGOUT (usada no HTML)
// ============================

window.logout = function() {
    signOut(auth);
};

// ============================
// DETECTAR USUÁRIO LOGADO
// ============================

onAuthStateChanged(auth, (user) => {

    const loginIcon = document.getElementById("openLoginMenu");

    if (user) {

        console.log("Logado como:", user.email);

        if (loginIcon) {
            loginIcon.src = "assets/user.png";
            loginIcon.title = user.email;
        }

    } else {

        console.log("Não logado");

        if (loginIcon) {
            loginIcon.src = "assets/login.png";
            loginIcon.title = "Login";
        }
    }
});
