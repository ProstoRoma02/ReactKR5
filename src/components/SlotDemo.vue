<template>
  <div class="slot-demo">
    <!-- Заголовок через именованный слот -->
    <header class="demo-header" v-if="$slots.header">
      <slot name="header">
        <!-- Fallback контент для заголовка -->
        <h3>Заголовок по умолчанию</h3>
      </slot>
    </header>

    <!-- Основной контент через default слот -->
    <main class="demo-content">
      <div class="content-wrapper">
        <slot>
          <!-- Fallback контент для основного содержимого -->
          <p>Здесь должен быть основной контент компонента.</p>
          <p>Этот текст отображается, если слот не заполнен.</p>
        </slot>
      </div>
      
      <!-- Дополнительная информация -->
      <div class="demo-info">
        <div class="info-item">
          <span class="info-label">Слотов использовано:</span>
          <span class="info-value">{{ usedSlotsCount }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Доступные слоты:</span>
          <span class="info-value">{{ availableSlots.join(', ') }}</span>
        </div>
      </div>
    </main>

    <!-- Боковая панель через scoped слот -->
    <aside class="demo-sidebar" v-if="$slots.sidebar">
      <div class="sidebar-title">Боковая панель</div>
      <slot 
        name="sidebar" 
        :data="sidebarData"
        :toggleItem="toggleSidebarItem"
        :addItem="addSidebarItem"
      >
        <!-- Fallback для боковой панели -->
        <p>Боковая панель пуста</p>
      </slot>
    </aside>

    <!-- Футер через именованный слот -->
    <footer class="demo-footer" v-if="$slots.footer">
      <slot name="footer">
        <!-- Fallback контент для футера -->
        <p>Футер по умолчанию</p>
      </slot>
    </footer>

    <!-- Демонстрация scoped слотов -->
    <div class="scoped-demo">
      <h4>Демонстрация Scoped слотов</h4>
      
      <!-- Слот с данными пользователя -->
      <div class="user-slot">
        <slot 
          name="user" 
          :user="currentUser"
          :isOnline="isUserOnline"
          :updateUser="updateUser"
        >
          <!-- Fallback для пользователя -->
          <div class="default-user">
            <div class="user-avatar">👤</div>
            <div class="user-info">
              <div class="user-name">{{ currentUser.name }}</div>
              <div class="user-status" :class="{ online: isUserOnline }">
                {{ isUserOnline ? 'В сети' : 'Не в сети' }}
              </div>
            </div>
          </div>
        </slot>
      </div>

      <!-- Слот со списком элементов -->
      <div class="items-slot">
        <slot 
          name="items" 
          :items="demoItems"
          :selectedItems="selectedItems"
          :toggleSelection="toggleItemSelection"
          :selectAll="selectAllItems"
          :clearSelection="clearSelection"
        >
          <!-- Fallback для списка элементов -->
          <div class="default-items">
            <div class="items-header">
              <span>Элементы ({{ demoItems.length }})</span>
              <button @click="selectAllItems" class="btn btn-small">
                {{ selectedItems.length === demoItems.length ? 'Снять все' : 'Выбрать все' }}
              </button>
            </div>
            <div class="items-list">
              <div 
                v-for="item in demoItems" 
                :key="item.id"
                @click="toggleItemSelection(item.id)"
                class="item"
                :class="{ selected: selectedItems.includes(item.id) }"
              >
                <span class="item-icon">{{ item.icon }}</span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-check">{{ selectedItems.includes(item.id) ? '✓' : '' }}</span>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- Динамические слоты -->
    <div class="dynamic-slots" v-if="dynamicSlots.length > 0">
      <h4>Динамические слоты</h4>
      <div 
        v-for="slotName in dynamicSlots" 
        :key="slotName"
        class="dynamic-slot"
      >
        <div class="slot-header">Слот: {{ slotName }}</div>
        <slot :name="slotName">
          <p>Динамический слот "{{ slotName }}" не заполнен</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// Props
const props = defineProps({
  theme: {
    type: String,
    default: 'default'
  },
  showSidebar: {
    type: Boolean,
    default: false
  }
})

// Реактивные данные
const currentUser = reactive({
  id: 1,
  name: 'Иван Петров',
  email: 'ivan@example.com',
  avatar: '👨‍💻'
})

const isUserOnline = ref(true)

const sidebarData = ref([
  { id: 1, title: 'Элемент 1', active: true },
  { id: 2, title: 'Элемент 2', active: false },
  { id: 3, title: 'Элемент 3', active: true }
])

const demoItems = ref([
  { id: 1, name: 'Vue.js', icon: '🟢' },
  { id: 2, name: 'React', icon: '🔵' },
  { id: 3, name: 'Angular', icon: '🔴' },
  { id: 4, name: 'Svelte', icon: '🟠' }
])

const selectedItems = ref([1, 3])

const dynamicSlots = ref(['custom1', 'custom2'])

// Вычисляемые свойства
const usedSlotsCount = computed(() => {
  const slots = ['header', 'default', 'footer', 'sidebar', 'user', 'items']
  return slots.filter(slot => {
    // Проверяем наличие слота через $slots
    return true // Упрощенная проверка для демо
  }).length
})

const availableSlots = computed(() => {
  return ['header', 'default', 'footer', 'sidebar', 'user', 'items', ...dynamicSlots.value]
})

// Методы для scoped слотов
const updateUser = (updates) => {
  Object.assign(currentUser, updates)
}

const toggleSidebarItem = (id) => {
  const item = sidebarData.value.find(item => item.id === id)
  if (item) {
    item.active = !item.active
  }
}

const addSidebarItem = (title) => {
  const newId = Math.max(...sidebarData.value.map(item => item.id)) + 1
  sidebarData.value.push({
    id: newId,
    title,
    active: false
  })
}

const toggleItemSelection = (id) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

const selectAllItems = () => {
  if (selectedItems.value.length === demoItems.value.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = demoItems.value.map(item => item.id)
  }
}

const clearSelection = () => {
  selectedItems.value = []
}

// Переключение статуса пользователя каждые 5 секунд для демонстрации
setInterval(() => {
  isUserOnline.value = !isUserOnline.value
}, 5000)
</script>

<style scoped>
.slot-demo {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

/* Заголовок */
.demo-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.demo-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

/* Основной контент */
.demo-content {
  padding: 2rem;
}

.content-wrapper {
  margin-bottom: 2rem;
}

.demo-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #555;
}

.info-value {
  color: #333;
  font-family: monospace;
}

/* Боковая панель */
.demo-sidebar {
  background: #f8f9fa;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.sidebar-title {
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

/* Футер */
.demo-footer {
  background: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

/* Scoped слоты демо */
.scoped-demo {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.scoped-demo h4 {
  margin-bottom: 1.5rem;
  color: #333;
}

.user-slot,
.items-slot {
  margin-bottom: 2rem;
}

/* Пользователь по умолчанию */
.default-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid #e1e5e9;
}

.user-avatar {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.user-status {
  font-size: 0.9rem;
  color: #999;
  transition: color 0.3s;
}

.user-status.online {
  color: #4CAF50;
}

/* Элементы по умолчанию */
.default-items {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e1e5e9;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.items-list {
  padding: 0.5rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.25rem;
}

.item:hover {
  background: white;
}

.item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.item-icon {
  font-size: 1.2rem;
}

.item-name {
  flex: 1;
}

.item-check {
  font-weight: bold;
  color: #4CAF50;
}

.item.selected .item-check {
  color: white;
}

/* Динамические слоты */
.dynamic-slots {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.dynamic-slots h4 {
  margin-bottom: 1.5rem;
  color: #333;
}

.dynamic-slot {
  margin-bottom: 1rem;
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 1rem;
}

.slot-header {
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

/* Утилитарные классы */
.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  min-width: auto;
}

/* Адаптивность */
@media (max-width: 768px) {
  .demo-content {
    padding: 1rem;
  }
  
  .info-item {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .default-user {
    flex-direction: column;
    text-align: center;
  }
  
  .items-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}
</style>