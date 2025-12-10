<template>
  <div id="app">
    <!-- Хедер с навигацией -->
    <header class="header">
      <nav class="nav">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">Vue Interactive App</router-link>
        </div>
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link">Главная</router-link></li>
          <li><router-link to="/demo" class="nav-link">Демо</router-link></li>
          <li><router-link to="/profile" class="nav-link">Профиль</router-link></li>
          <li><router-link to="/settings" class="nav-link">Настройки</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- Основной контент -->
    <main class="main">
      <router-view />
    </main>

    <!-- Футер -->
    <footer class="footer">
      <p>&copy; 2024 Vue Interactive App. Создано с использованием Vue 3 + Vite</p>
    </footer>
  </div>
</template>

<script setup>
// Импорты и логика компонента
</script>

<style>
/* Глобальные стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Хедер */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.brand-link:hover {
  opacity: 0.8;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255,255,255,0.2);
  font-weight: bold;
}

/* Основной контент */
.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

/* Футер */
.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .main {
    padding: 1rem;
  }
}

/* Утилитарные классы */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.btn-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success {
  color: #27ae60;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>