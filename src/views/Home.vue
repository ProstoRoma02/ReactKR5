<template>
  <div class="home">
    <!-- Герой секция -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Vue Interactive App</h1>
        <p class="hero-subtitle">
          Интерактивное веб-приложение, демонстрирующее возможности Vue 3 с Composition API
        </p>
        <div class="hero-buttons">
          <router-link to="/demo" class="btn btn-primary">Посмотреть демо</router-link>
          <a href="#features" class="btn btn-secondary">Узнать больше</a>
        </div>
      </div>
    </section>

    <!-- Особенности -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">Особенности проекта</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Технологии -->
    <section class="technologies">
      <div class="container">
        <h2 class="section-title">Используемые технологии</h2>
        <div class="tech-grid">
          <div 
            class="tech-item" 
            v-for="tech in technologies" 
            :key="tech.name"
            :class="{ active: tech.active }"
            @click="toggleTech(tech)"
          >
            <div class="tech-logo">{{ tech.logo }}</div>
            <h4>{{ tech.name }}</h4>
            <p>{{ tech.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Статистика -->
    <section class="stats">
      <div class="container">
        <h2 class="section-title">Статистика проекта</h2>
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-number">{{ animatedStats[stat.key] }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Реактивные данные
const features = ref([
  {
    id: 1,
    icon: '⚡',
    title: 'Реактивность',
    description: 'Использование ref, reactive и computed для создания отзывчивого интерфейса'
  },
  {
    id: 2,
    icon: '🧩',
    title: 'Компоненты',
    description: 'Модульная архитектура с переиспользуемыми компонентами'
  },
  {
    id: 3,
    icon: '🛣️',
    title: 'Маршрутизация',
    description: 'Vue Router 4 для навигации между страницами'
  },
  {
    id: 4,
    icon: '🎨',
    title: 'Современный дизайн',
    description: 'Адаптивный интерфейс с градиентами и анимациями'
  }
])

const technologies = reactive([
  {
    name: 'Vue 3',
    logo: '🟢',
    description: 'Composition API',
    active: false
  },
  {
    name: 'Vite',
    logo: '⚡',
    description: 'Быстрая сборка',
    active: false
  },
  {
    name: 'Vue Router',
    logo: '🛣️',
    description: 'Маршрутизация',
    active: false
  },
  {
    name: 'JavaScript',
    logo: '📜',
    description: 'ES6+ синтаксис',
    active: false
  }
])

const stats = ref([
  { key: 'components', label: 'Компонентов', value: 8 },
  { key: 'pages', label: 'Страниц', value: 5 },
  { key: 'features', label: 'Функций', value: 12 },
  { key: 'lines', label: 'Строк кода', value: 500 }
])

const animatedStats = reactive({
  components: 0,
  pages: 0,
  features: 0,
  lines: 0
})

// Методы
const toggleTech = (tech) => {
  tech.active = !tech.active
}

// Анимация счетчиков
const animateStats = () => {
  stats.value.forEach(stat => {
    let current = 0
    const increment = stat.value / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= stat.value) {
        animatedStats[stat.key] = stat.value
        clearInterval(timer)
      } else {
        animatedStats[stat.key] = Math.floor(current)
      }
    }, 30)
  })
}

// Хуки жизненного цикла
onMounted(() => {
  // Запускаем анимацию статистики через небольшую задержку
  setTimeout(animateStats, 500)
})

// Вычисляемые свойства
const activeTechnologies = computed(() => {
  return technologies.filter(tech => tech.active)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Герой секция */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin: -2rem -2rem 0 -2rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.3);
}

.btn-secondary {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.5);
}

/* Секции */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.features {
  padding: 4rem 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 15px;
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}

/* Технологии */
.technologies {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.tech-item {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid transparent;
}

.tech-item:hover {
  transform: scale(1.05);
}

.tech-item.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tech-logo {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* Статистика */
.stats {
  padding: 4rem 0;
  background: #333;
  color: white;
}

.stats .section-title {
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.8;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>