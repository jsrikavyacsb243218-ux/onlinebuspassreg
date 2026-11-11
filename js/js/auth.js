
// ======================================
// CITYRIDE - AUTHENTICATION SYSTEM
// ======================================

const ADMIN_EMAIL = "admin@cityride.com";
const ADMIN_PASSWORD = "Admin@123";

// Get data from Local Storage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function getApplications() {
    return JSON.parse(localStorage.getItem("applications")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function saveApplications(applications) {
    localStorage.setItem("applications", JSON.stringify(applications));
}

// ======================================
// USER REGISTRATION
// ======================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const category = document.getElementById("category").value;

        const message = document.getElementById("registerMessage");

        if (name.length < 2) {
            message.textContent = "Please enter a valid name.";
            message.dataset.tone = "error";
            return;
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            message.textContent = "Enter a valid 10-digit mobile number.";
            message.dataset.tone = "error";
            return;
        }

        if (password.length < 6) {
            message.textContent = "Password must contain at least 6 characters.";
            message.dataset.tone = "error";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.dataset.tone = "error";
            return;
        }

        let users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            message.textContent = "Email is already registered!";
            message.dataset.tone = "error";
            return;
        }

        const newUser = {
            id: "USER" + Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password,
            category: category
        };

        users.push(newUser);
        saveUsers(users);

        message.dataset.tone = "success";
        message.textContent = "Registration successful! Redirecting to login...";

        registerForm.reset();

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1200);
    });
}

// ======================================
// USER LOGIN
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        const users = getUsers();

        const user = users.find(function(item) {
            return item.email === email && item.password === password;
        });

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));

            message.dataset.tone = "success";
            message.textContent = "Login successful!";

            setTimeout(function() {
                window.location.href = "dashboard.html";
            }, 700);
        } else {
            message.dataset.tone = "error";
            message.textContent = "Invalid email or password!";
        }
    });
}

// ======================================
// ADMIN LOGIN
// ======================================

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("adminEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("adminPassword").value;

        const message = document.getElementById("adminMessage");

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem("adminSession", "true");

            message.dataset.tone = "success";
            message.textContent = "Admin login successful!";

            setTimeout(function() {
                window.location.href = "admin_dashboard.html";
            }, 700);
        } else {
            message.dataset.tone = "error";
            message.textContent = "Invalid admin credentials!";
        }
    });
}

// ======================================
// SESSION CHECKING
// ======================================

function requireUser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}

function requireAdmin() {
    if (localStorage.getItem("adminSession") !== "true") {
        window.location.href = "admin-login.html";
        return false;
    }

    return true;
}

// ======================================
// LOGOUT
// ======================================

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function adminLogout() {
    localStorage.removeItem("adminSession");
    window.location.href = "admin-login.html";
}
