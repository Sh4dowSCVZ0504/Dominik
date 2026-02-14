// ============================
// SISTEMA DE LOGIN - DOMINIK
// ============================

// Elementos
const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLogin");
const closeLoginBtn = document.getElementById("closeLogin");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const usernameInput = document.getElementById("username");
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
// REGISTRO
// ============================

if (registerBtn) {
    registerBtn.onclick = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Preencha todos os campos.");
            return;
        }

        if (localStorage.getItem("user_" + username)) {
            alert("Usuário já existe.");
            return;
        }

        localStorage.setItem(
            "user_" + username,
            JSON.stringify({ password: password })
        );

        alert("Conta criada com sucesso!");
    };
}

// ============================
// LOGIN
// ============================

if (loginBtn) {
    loginBtn.onclick = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const userData = localStorage.getItem("user_" + username);

        if (!userData) {
            alert("Usuário não encontrado.");
            return;
        }

        const parsedData = JSON.parse(userData);

        if (parsedData.password !== password) {
            alert("Senha incorreta.");
            return;
        }

        localStorage.setItem("loggedUser", username);
        updateUserUI();
        loginModal.style.display = "none";
    };
}

// ============================
// LOGOUT
// ============================

if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("loggedUser");
        updateUserUI();
    };
}

// ============================
// ATUALIZAR UI
// ============================

function updateUserUI() {
    const loggedUser = localStorage.getItem("loggedUser");

    if (loggedUser) {
        if (userDisplay) userDisplay.textContent = "👤 " + loggedUser;
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (userDisplay) userDisplay.textContent = "Não logado";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

// ============================
// INICIAR
// ============================

document.addEventListener("DOMContentLoaded", () => {
    updateUserUI();
});
