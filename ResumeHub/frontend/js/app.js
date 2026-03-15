document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('login-tab');
  const registerTab = document.getElementById('register-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const errorEl = document.getElementById('error');

  // If this script is loaded on non-auth pages, skip auth wiring.
  if (!loginTab || !registerTab || !loginForm || !registerForm || !errorEl) {
    return;
  }

  loginTab.onclick = () => switchTab('login');
  registerTab.onclick = () => switchTab('register');

  loginForm.onsubmit = handleLoginLocal;
  registerForm.onsubmit = handleRegisterLocal;

  function switchTab(tab) {
    loginTab.classList.toggle('active', tab === 'login');
    registerTab.classList.toggle('active', tab === 'register');
    loginForm.style.display = tab === 'login' ? 'block' : 'none';
    registerForm.style.display = tab === 'register' ? 'block' : 'none';
    errorEl.textContent = '';
  }

  function handleLoginLocal(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      showError('Email and password are required.');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('resumehubUser') || '{}');
    localStorage.setItem('resumehubUser', JSON.stringify({
      ...existing,
      email,
      lastLoginAt: new Date().toISOString()
    }));

    window.location.href = 'frontend/dashboard.html';
  }

  function handleRegisterLocal(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
      showError('Name, email, and password are required.');
      return;
    }

    localStorage.setItem('resumehubUser', JSON.stringify({
      name,
      email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }));

    window.location.href = 'frontend/dashboard.html';
  }

  function showError(msg) {
    errorEl.textContent = msg;
  }
});

