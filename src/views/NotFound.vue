<template>
  <div class="not-found">
    <div class="error-container">
      <!-- Анимированная 404 -->
      <div class="error-number">
        <span class="digit" :class="{ animate: animate }">4</span>
        <span class="digit zero" :class="{ animate: animate }">0</span>
        <span class="digit" :class="{ animate: animate }">4</span>
      </div>
      
      <!-- Основное сообщение -->
      <div class="error-message">
        <h1>Страница не найдена</h1>
        <p>К сожалению, запрашиваемая страница не существует или была перемещена.</p>
      </div>
      
      <!-- Интерактивный элемент -->
      <div class="interactive-element">
        <div 
          class="lost-astronaut"
          :class="{ floating: isFloating }"
          @click="toggleFloat"
        >
          🚀
        </div>
        <p class="astronaut-text">Кликните на ракету!</p>
      </div>
      
      <!-- Предложения -->
      <div class="suggestions">
        <h3>Что вы можете сделать:</h3>
        <div class="suggestion-list">
          <div class="suggestion-item">
            <span class="suggestion-icon">🏠</span>
            <div class="suggestion-content">
              <h4>Вернуться на главную</h4>
              <p>Перейти на главную страницу приложения</p>
            </div>
            <router-link to="/" class="btn">Главная</router-link>
          </div>
          
          <div class="suggestion-item">
            <span class="suggestion-icon">🎮</span>
            <div class="suggestion-content">
              <h4>Посмотреть демо</h4>
              <p>Изучить возможности приложения</p>
            </div>
            <router-link to="/demo" class="btn">Демо</router-link>
          </div>
          
          <div class="suggestion-item">
            <span class="suggestion-icon">👤</span>
            <div class="suggestion-content">
              <h4>Перейти в профиль</h4>
              <p>Управление вашим профилем</p>
            </div>
            <router-link to="/profile" class="btn">Профиль</router-link>
          </div>
          
          <div class="suggestion-item">
            <span class="suggestion-icon">⚙️</span>
            <div class="suggestion-content">
              <h4>Открыть настройки</h4>
              <p>Настроить приложение под себя</p>
            </div>
            <router-link to="/settings" class="btn">Настройки</router-link>
          </div>
        </div>
      </div>
      
      <!-- Поиск -->
      <div class="search-section">
        <h3>Или найдите то, что ищете:</h3>
        <div class="search-form">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Поиск по сайту..."
            class="search-input"
          >
          <button @click="performSearch" class="search-btn">
            🔍 Найти
          </button>
        </div>
        
        <div v-if="searchResults.length > 0" class="search-results">
          <h4>Результаты поиска:</h4>
          <div class="results-list">
            <router-link
              v-for="result in searchResults"
              :key="result.path"
              :to="result.path"
              class="result-item"
            >
              <span class="result-icon">{{ result.icon }}</span>
              <div class="result-content">
                <div class="result-title">{{ result.title }}</div>
                <div class="result-description">{{ result.description }}</div>
              </div>
            </router-link>
          </div>
        </div>
        
        <div v-else-if="searchQuery && hasSearched" class="no-results">
          <p>Ничего не найдено по запросу "{{ searchQuery }}"</p>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      </div>
      
      <!-- Информация об ошибке -->
      <div class="error-details">
        <details>
          <summary>Техническая информация</summary>
          <div class="tech-info">
            <p><strong>URL:</strong> {{ currentPath }}</p>
            <p><strong>Время:</strong> {{ currentTime }}</p>
            <p><strong>User Agent:</strong> {{ userAgent }}</p>
            <p><strong>Referrer:</strong> {{ referrer || 'Прямой переход' }}</p>
          </div>
        </details>
      </div>
      
      <!-- Навигация -->
      <div class="navigation-buttons">
        <button @click="goBack" class="btn btn-secondary">
          ← Назад
        </button>
        <button @click="reload" class="btn btn-secondary">
          🔄 Обновить
        </button>
        <router-link to="/" class="btn">
          🏠 На главную
        </router-link>
      </div>
    </div>
    
    <!-- Фоновая анимация -->
    <div class="background-animation">
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Реактивные данные
const animate = ref(false)
const isFloating = ref(false)
const searchQuery = ref('')
const hasSearched = ref(false)
const searchResults = ref([])

// Звезды для фоновой анимации
const stars = ref([])

// Доступные страницы для поиска
const availablePages = [
  {
    path: '/',
    title: 'Главная страница',
    description: 'Основная страница приложения',
    icon: '🏠',
    keywords: ['главная', 'home', 'основная', 'начало']
  },
  {
    path: '/demo',
    title: 'Демонстрация',
    description: 'Интерактивные примеры компонентов',
    icon: '🎮',
    keywords: ['демо', 'demo', 'примеры', 'компоненты', 'показать']
  },
  {
    path: '/profile',
    title: 'Профиль пользователя',
    description: 'Управление профилем и настройками аккаунта',
    icon: '👤',
    keywords: ['профиль', 'profile', 'пользователь', 'аккаунт', 'личный']
  },
  {
    path: '/settings',
    title: 'Настройки',
    description: 'Конфигурация приложения',
    icon: '⚙️',
    keywords: ['настройки', 'settings', 'конфигурация', 'параметры']
  }
]

// Вычисляемые свойства
const currentPath = computed(() => route.fullPath)
const currentTime = computed(() => new Date().toLocaleString('ru-RU'))
const userAgent = computed(() => navigator.userAgent)
const referrer = computed(() => document.referrer)

// Методы
const toggleFloat = () => {
  isFloating.value = !isFloating.value
}

const performSearch = () => {
  hasSearched.value = true
  
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  const query = searchQuery.value.toLowerCase()
  
  searchResults.value = availablePages.filter(page => {
    return page.title.toLowerCase().includes(query) ||
           page.description.toLowerCase().includes(query) ||
           page.keywords.some(keyword => keyword.includes(query))
  })
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const reload = () => {
  window.location.reload()
}

const generateStars = () => {
  stars.value = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3
  }))
}

// Хуки жизненного цикла
onMounted(() => {
  // Запуск анимации 404
  setTimeout(() => {
    animate.value = true
  }, 500)
  
  // Генерация звезд
  generateStars()
  
  // Автоматический поиск, если в URL есть параметры
  const urlParams = new URLSearchParams(window.location.search)
  const searchParam = urlParams.get('search')
  if (searchParam) {
    searchQuery.value = searchParam
    performSearch()
  }
})
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.error-container {
  max-width: 800px;
  width: 90%;
  text-align: center;
  z-index: 10;
  position: relative;
}

/* Анимированная 404 */
.error-number {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.digit {
  font-size: 8rem;
  font-weight: bold;
  text-shadow: 4px 4px 8px rgba(0,0,0,0.3);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.8s ease;
}

.digit.animate {
  transform: translateY(0);
  opacity: 1;
}

.digit.zero {
  color: #f093fb;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.1) translateY(-10px); }
}

/* Основное сообщение */
.error-message {
  margin-bottom: 3rem;
}

.error-message h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.error-message p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Интерактивный элемент */
.interactive-element {
  margin-bottom: 3rem;
}

.lost-astronaut {
  font-size: 4rem;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.lost-astronaut:hover {
  transform: scale(1.1);
}

.lost-astronaut.floating {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(5deg); }
  50% { transform: translateY(-10px) rotate(-5deg); }
  75% { transform: translateY(-30px) rotate(3deg); }
}

.astronaut-text {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Предложения */
.suggestions {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.suggestions h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.suggestion-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.suggestion-item:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.suggestion-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
  text-align: left;
}

.suggestion-content h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.suggestion-content p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
}

/* Поиск */
.search-section {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.search-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.search-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background: rgba(255,255,255,0.9);
  color: #333;
}

.search-input::placeholder {
  color: #666;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 25px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-btn:hover {
  background: rgba(255,255,255,0.3);
}

/* Результаты поиска */
.search-results {
  text-align: left;
}

.search-results h4 {
  margin-bottom: 1rem;
  text-align: center;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
}

.result-item:hover {
  background: rgba(255,255,255,0.2);
  transform: translateX(10px);
}

.result-icon {
  font-size: 1.5rem;
}

.result-content {
  flex: 1;
}

.result-title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.result-description {
  font-size: 0.9rem;
  opacity: 0.8;
}

.no-results {
  text-align: center;
  opacity: 0.8;
}

/* Техническая информация */
.error-details {
  margin-bottom: 2rem;
}

.error-details details {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 1rem;
}

.error-details summary {
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
}

.tech-info {
  text-align: left;
  font-family: monospace;
  font-size: 0.9rem;
  opacity: 0.8;
}

.tech-info p {
  margin-bottom: 0.5rem;
  word-break: break-all;
}

/* Навигация */
.navigation-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 25px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-block;
}

.btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
}

/* Фоновая анимация */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .digit {
    font-size: 4rem;
  }
  
  .error-message h1 {
    font-size: 2rem;
  }
  
  .error-message p {
    font-size: 1rem;
  }
  
  .suggestion-list {
    grid-template-columns: 1fr;
  }
  
  .suggestion-item {
    flex-direction: column;
    text-align: center;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .navigation-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .result-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>