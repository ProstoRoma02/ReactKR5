<template>
  <div class="demo">
    <div class="demo-header">
      <h1>Демонстрация компонентов</h1>
      <p>Интерактивные примеры основных возможностей Vue 3</p>
    </div>

    <div class="demo-grid">
      <!-- Реактивная форма -->
      <div class="demo-section">
        <h2>Реактивная форма</h2>
        <ReactiveForm />
      </div>

      <!-- Список элементов -->
      <div class="demo-section">
        <h2>Динамический список</h2>
        <ItemList />
      </div>

      <!-- Таймер -->
      <div class="demo-section">
        <h2>Интерактивный таймер</h2>
        <Timer />
      </div>

      <!-- Поиск с кастомным v-model -->
      <div class="demo-section">
        <h2>Поиск с фильтрацией</h2>
        <SearchInput v-model="searchQuery" placeholder="Поиск по элементам..." />
        <div class="search-results">
          <p v-if="searchQuery">Результаты поиска для: "{{ searchQuery }}"</p>
          <div v-if="filteredItems.length" class="results-list">
            <div 
              v-for="item in filteredItems" 
              :key="item.id" 
              class="result-item"
            >
              {{ item.name }}
            </div>
          </div>
          <p v-else-if="searchQuery" class="no-results">Ничего не найдено</p>
        </div>
      </div>

      <!-- Слоты демо -->
      <div class="demo-section">
        <h2>Компонент со слотами</h2>
        <SlotDemo>
          <template #header>
            <h3>Заголовок через слот</h3>
          </template>
          
          <p>Основной контент компонента</p>
          <p>Может содержать любые элементы</p>
          
          <template #footer>
            <button class="btn">Кнопка в футере</button>
          </template>
        </SlotDemo>
      </div>

      <!-- Динамические стили -->
      <div class="demo-section">
        <h2>Динамические стили и классы</h2>
        <div class="style-demo">
          <div 
            class="color-box"
            :style="{ 
              backgroundColor: selectedColor,
              transform: `scale(${scale})`,
              borderRadius: `${borderRadius}px`
            }"
            :class="{ 
              'animated': isAnimated,
              'shadow': hasShadow 
            }"
          ></div>
          
          <div class="controls">
            <div class="control-group">
              <label>Цвет:</label>
              <input type="color" v-model="selectedColor">
            </div>
            
            <div class="control-group">
              <label>Масштаб: {{ scale }}</label>
              <input 
                type="range" 
                v-model="scale" 
                min="0.5" 
                max="2" 
                step="0.1"
              >
            </div>
            
            <div class="control-group">
              <label>Скругление: {{ borderRadius }}px</label>
              <input 
                type="range" 
                v-model="borderRadius" 
                min="0" 
                max="50" 
                step="1"
              >
            </div>
            
            <div class="control-group">
              <label>
                <input type="checkbox" v-model="isAnimated">
                Анимация
              </label>
            </div>
            
            <div class="control-group">
              <label>
                <input type="checkbox" v-model="hasShadow">
                Тень
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Навигационные кнопки -->
    <div class="demo-navigation">
      <button @click="$router.go(-1)" class="btn btn-secondary">
        ← Назад
      </button>
      <router-link to="/" class="btn">
        🏠 На главную
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ReactiveForm from '../components/ReactiveForm.vue'
import ItemList from '../components/ItemList.vue'
import Timer from '../components/Timer.vue'
import SearchInput from '../components/SearchInput.vue'
import SlotDemo from '../components/SlotDemo.vue'

// Реактивные данные для поиска
const searchQuery = ref('')

// Тестовые данные для поиска
const items = ref([
  { id: 1, name: 'Vue.js' },
  { id: 2, name: 'React' },
  { id: 3, name: 'Angular' },
  { id: 4, name: 'Svelte' },
  { id: 5, name: 'JavaScript' },
  { id: 6, name: 'TypeScript' },
  { id: 7, name: 'Node.js' },
  { id: 8, name: 'Vite' }
])

// Данные для демо стилей
const selectedColor = ref('#667eea')
const scale = ref(1)
const borderRadius = ref(10)
const isAnimated = ref(false)
const hasShadow = ref(true)

// Вычисляемые свойства
const filteredItems = computed(() => {
  if (!searchQuery.value) return []
  
  return items.value.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.demo {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.demo-header p {
  font-size: 1.2rem;
  color: #666;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.demo-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.demo-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

/* Поиск */
.search-results {
  margin-top: 1rem;
}

.results-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.result-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.no-results {
  color: #999;
  font-style: italic;
  margin-top: 1rem;
}

/* Демо стилей */
.style-demo {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.color-box {
  width: 100px;
  height: 100px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.color-box.animated {
  animation: pulse 2s infinite;
}

.color-box.shadow {
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.controls {
  flex: 1;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.control-group input[type="color"],
.control-group input[type="range"] {
  width: 100%;
}

.control-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

/* Навигация */
.demo-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-top: 1px solid #eee;
}

/* Адаптивность */
@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .style-demo {
    flex-direction: column;
    align-items: center;
  }
  
  .demo-navigation {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>