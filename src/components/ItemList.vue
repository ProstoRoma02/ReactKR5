<template>
  <div class="item-list">
    <!-- Форма добавления нового элемента -->
    <div class="add-item-form">
      <div class="input-group">
        <input
          v-model="newItemText"
          @keyup.enter="addItem"
          type="text"
          placeholder="Добавить новый элемент..."
          class="form-input"
        >
        <button
          @click="addItem"
          :disabled="!newItemText.trim()"
          class="btn add-btn"
        >
          Добавить
        </button>
      </div>
    </div>

    <!-- Фильтры и сортировка -->
    <div class="controls">
      <div class="filter-group">
        <label>Фильтр:</label>
        <input
          v-model="filterText"
          type="text"
          placeholder="Поиск элементов..."
          class="form-input filter-input"
        >
      </div>
      
      <div class="sort-group">
        <label>Сортировка:</label>
        <select v-model="sortBy" class="form-input sort-select">
          <option value="id">По ID</option>
          <option value="text">По тексту</option>
          <option value="created">По дате создания</option>
        </select>
        
        <button
          @click="toggleSortOrder"
          class="btn sort-btn"
          :title="sortOrder === 'asc' ? 'Сортировать по убыванию' : 'Сортировать по возрастанию'"
        >
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <!-- Статистика -->
    <div class="stats">
      <span class="stat-item">Всего: {{ items.length }}</span>
      <span class="stat-item">Показано: {{ filteredAndSortedItems.length }}</span>
      <span class="stat-item">Выполнено: {{ completedCount }}</span>
    </div>

    <!-- Список элементов -->
    <div class="items-container">
      <transition-group name="list" tag="div" class="items-list">
        <div
          v-for="item in filteredAndSortedItems"
          :key="item.id"
          class="item"
          :class="{ 'completed': item.completed }"
        >
          <div class="item-content">
            <input
              v-model="item.completed"
              type="checkbox"
              class="item-checkbox"
            >
            
            <span
              v-if="!item.editing"
              @dblclick="startEdit(item)"
              class="item-text"
              :class="{ 'completed-text': item.completed }"
            >
              {{ item.text }}
            </span>
            
            <input
              v-else
              v-model="item.editText"
              @keyup.enter="saveEdit(item)"
              @keyup.escape="cancelEdit(item)"
              @blur="saveEdit(item)"
              class="form-input edit-input"
              ref="editInput"
            >
          </div>
          
          <div class="item-actions">
            <button
              v-if="!item.editing"
              @click="startEdit(item)"
              class="btn btn-small edit-btn"
              title="Редактировать"
            >
              ✏️
            </button>
            
            <button
              v-if="item.editing"
              @click="saveEdit(item)"
              class="btn btn-small save-btn"
              title="Сохранить"
            >
              ✅
            </button>
            
            <button
              v-if="item.editing"
              @click="cancelEdit(item)"
              class="btn btn-small cancel-btn"
              title="Отменить"
            >
              ❌
            </button>
            
            <button
              @click="removeItem(item.id)"
              class="btn btn-small remove-btn"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
          
          <div class="item-meta">
            <small>ID: {{ item.id }} | Создан: {{ formatDate(item.created) }}</small>
          </div>
        </div>
      </transition-group>
      
      <!-- Сообщение о пустом списке -->
      <div v-if="filteredAndSortedItems.length === 0" class="empty-state">
        <div v-if="items.length === 0">
          <p>📝 Список пуст</p>
          <p>Добавьте первый элемент выше</p>
        </div>
        <div v-else>
          <p>🔍 Ничего не найдено</p>
          <p>Попробуйте изменить фильтр</p>
        </div>
      </div>
    </div>

    <!-- Массовые действия -->
    <div class="bulk-actions" v-if="items.length > 0">
      <button
        @click="toggleAllItems"
        class="btn btn-secondary"
      >
        {{ allCompleted ? 'Снять все' : 'Выбрать все' }}
      </button>
      
      <button
        @click="removeCompleted"
        :disabled="completedCount === 0"
        class="btn btn-danger"
      >
        Удалить выполненные ({{ completedCount }})
      </button>
      
      <button
        @click="clearAll"
        class="btn btn-danger"
      >
        Очистить все
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

// Реактивные данные
const items = ref([
  { id: 1, text: 'Изучить Vue 3 Composition API', completed: true, created: new Date('2024-01-01'), editing: false },
  { id: 2, text: 'Настроить Vue Router', completed: true, created: new Date('2024-01-02'), editing: false },
  { id: 3, text: 'Создать компоненты', completed: false, created: new Date('2024-01-03'), editing: false },
  { id: 4, text: 'Добавить стилизацию', completed: false, created: new Date('2024-01-04'), editing: false }
])

const newItemText = ref('')
const filterText = ref('')
const sortBy = ref('id')
const sortOrder = ref('asc')
const nextId = ref(5)

// Вычисляемые свойства
const filteredAndSortedItems = computed(() => {
  let filtered = items.value

  // Фильтрация
  if (filterText.value.trim()) {
    filtered = filtered.filter(item =>
      item.text.toLowerCase().includes(filterText.value.toLowerCase())
    )
  }

  // Сортировка
  filtered = [...filtered].sort((a, b) => {
    let aValue, bValue

    switch (sortBy.value) {
      case 'text':
        aValue = a.text.toLowerCase()
        bValue = b.text.toLowerCase()
        break
      case 'created':
        aValue = a.created
        bValue = b.created
        break
      default:
        aValue = a.id
        bValue = b.id
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

const completedCount = computed(() => {
  return items.value.filter(item => item.completed).length
})

const allCompleted = computed(() => {
  return items.value.length > 0 && items.value.every(item => item.completed)
})

// Методы
const addItem = () => {
  const text = newItemText.value.trim()
  if (!text) return

  items.value.push({
    id: nextId.value++,
    text,
    completed: false,
    created: new Date(),
    editing: false
  })

  newItemText.value = ''
}

const removeItem = (id) => {
  const index = items.value.findIndex(item => item.id === id)
  if (index > -1) {
    items.value.splice(index, 1)
  }
}

const startEdit = async (item) => {
  item.editing = true
  item.editText = item.text
  
  // Фокус на поле ввода после рендеринга
  await nextTick()
  const editInputs = document.querySelectorAll('.edit-input')
  const targetInput = Array.from(editInputs).find(input => 
    input.closest('.item').querySelector('.item-text')?.textContent.trim() === item.text
  )
  if (targetInput) {
    targetInput.focus()
    targetInput.select()
  }
}

const saveEdit = (item) => {
  const newText = item.editText?.trim()
  if (newText && newText !== item.text) {
    item.text = newText
  }
  item.editing = false
  delete item.editText
}

const cancelEdit = (item) => {
  item.editing = false
  delete item.editText
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const toggleAllItems = () => {
  const newState = !allCompleted.value
  items.value.forEach(item => {
    item.completed = newState
  })
}

const removeCompleted = () => {
  items.value = items.value.filter(item => !item.completed)
}

const clearAll = () => {
  if (confirm('Вы уверены, что хотите удалить все элементы?')) {
    items.value = []
  }
}

const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.item-list {
  max-width: 600px;
  margin: 0 auto;
}

/* Форма добавления */
.add-item-form {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group .form-input {
  flex: 1;
}

.add-btn {
  white-space: nowrap;
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Контролы */
.controls {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-input {
  width: 200px;
}

.sort-select {
  width: 150px;
}

.sort-btn {
  min-width: 40px;
  padding: 0.5rem;
}

/* Статистика */
.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 5px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

/* Список элементов */
.items-container {
  margin-bottom: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s;
}

.item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.item.completed {
  background: #f8f9fa;
  opacity: 0.8;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.item-checkbox {
  transform: scale(1.2);
}

.item-text {
  flex: 1;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.item-text:hover {
  background-color: #f8f9fa;
}

.completed-text {
  text-decoration: line-through;
  color: #999;
}

.edit-input {
  flex: 1;
  margin: 0;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  min-width: auto;
}

.item-meta {
  color: #999;
  font-size: 0.8rem;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-state p:first-child {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

/* Массовые действия */
.bulk-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Анимации */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group,
  .sort-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-input,
  .sort-select {
    width: 100%;
  }
  
  .stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .bulk-actions {
    flex-direction: column;
  }
  
  .item-actions {
    flex-wrap: wrap;
  }
}
</style>