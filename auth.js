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
// ELEMENTOS
// ============================

const loginModal = document.getElementById("loginModal");
const loginBackdrop = document.getElementById("loginModalBackdrop");
const openLoginMenu = document.getElementById("openLoginMenu");

const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");

// ============================
// ABRIR MODAL
// ============================

if (openLoginMenu) {
    openLoginMenu.addEventListener("click", () => {
        loginModal.classList.add("active");
        loginBackdrop.classList.add("active");
    });
}

// ============================
// FECHAR MODAL
// ============================

if (loginBackdrop) {
    loginBackdrop.addEventListener("click", () => {
        fecharModal();
    });
}

function fecharModal() {
    loginModal.classList.remove("active");
    loginBackdrop.classList.remove("active");
}

// ============================
// REGISTER (usado no HTML)
// ============================

window.register = async function(email, senha) {

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, senha);
        alert("Conta criada com sucesso!");
        limparCampos();
        fecharModal();
    } catch (error) {
        alert(traduzirErro(error.code));
    }
};

// ============================
// LOGIN (usado no HTML)
// ============================

window.login = async function(email, senha) {

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        limparCampos();
        fecharModal();
    } catch (error) {
        alert(traduzirErro(error.code));
    }
};

// ============================
// LOGOUT (usado no HTML)
// ============================

window.logout = async function() {
    await signOut(auth);
};

// ============================
// OBSERVAR USUÁRIO
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

// ============================
// FUNÇÕES AUXILIARES
// ============================

function limparCampos() {
    if (emailInput) emailInput.value = "";
    if (senhaInput) senhaInput.value = "";
}

function traduzirErro(code) {
    switch(code) {
        case "auth/email-already-in-use":
            return "Esse email já está em uso.";
        case "auth/invalid-email":
            return "Email inválido.";
        case "auth/weak-password":
            return "A senha precisa ter pelo menos 6 caracteres.";
        case "auth/user-not-found":
            return "Usuário não encontrado.";
        case "auth/wrong-password":
            return "Senha incorreta.";
        default:
            return "Erro: " + code;
    }
}
