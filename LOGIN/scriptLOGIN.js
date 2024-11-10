document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    
    document.getElementById('login-btn').addEventListener('click', function() {
        document.getElementById('login-form').classList.add('active');
        document.getElementById('signup-form').classList.remove('active');
    });
    
    document.getElementById('signup-btn').addEventListener('click', function() {
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    });
    

    // Elements to toggle between forms
    const goToSignup = document.getElementById("go-to-signup");
    const goToLogin = document.getElementById("go-to-login");

    // Initially show login form and hide signup form
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    loginBtn.classList.add("active");

    // Handle the login/signup form switching
    loginBtn.addEventListener("click", () => {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
    });

    signupBtn.addEventListener("click", () => {
        loginForm.classList.remove("active");
        signupForm.classList.add("active");
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
    });

    // Switch to the signup form when the user clicks "Sign up" in login form
    goToSignup.addEventListener("click", () => {
        loginForm.classList.remove("active");
        signupForm.classList.add("active");
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
    });

    // Switch to the login form when the user clicks "Login" in signup form
    goToLogin.addEventListener("click", () => {
        signupForm.classList.remove("active");
        loginForm.classList.add("active");
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
    });
});
