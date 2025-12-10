<template>
  <div class="search-input">
    <div class="input-wrapper" :class="{ 'focused': isFocused, 'has-value': hasValue }">
      <div class="input-icon">
        <span v-if="!isLoading">🔍</span>
        <span v-else class="loading-spinner">⏳</span>
      </div>
      
      <input
        ref="inputRef"
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        type="text"
        class="search-field"
        :placeholder="placeholder"
        :disabled="disabled"
      >
      
      <button
        v-if="hasValue && !disabled"
        @click="clearInput"
        class="clear-button"
        type="button"
        title="Очистить"
      >
        ❌
      </button>
    </div>
    
    <!-- Предложения автодополнения -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        @mouseenter="highlightedIndex = index"
        class="suggestion-item"
        :class="{ 'highlighted': index === highlightedIndex }"
      >
        <span class="suggestion-text" v-html="highlightMatch(suggestion)"></span>
      </div>
    </div>
    
    <!-- Сообщение о отсутствии результатов -->
    <div v-if="showNoResults" class="no-results">
      Ничего не найдено для "{{ modelValue }}"
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Поиск...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  debounceDelay: {
    type: Number,
    default: 300
  },
  minLength: {
    type: Number,
    default: 1
  },
  maxSuggestions: {
    type: Number,
    default: 10
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'search', 'select', 'focus', 'blur'])

// Реактивные данные
const inputRef = ref(null)
const isFocused = ref(false)
const isLoading = ref(false)
const highlightedIndex = ref(-1)
const showSuggestions = ref(false)
const debounceTimer = ref(null)

// Встроенные предложения для демонстрации
const defaultSuggestions = ref([
  'Vue.js',
  'React',
  'Angular',
  'Svelte',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'Vite',
  'Webpack',
  'Nuxt.js',
  'Next.js',
  'Express.js'
])

// Вычисляемые свойства
const hasValue = computed(() => {
  return props.modelValue && props.modelValue.length > 0
})

const filteredSuggestions = computed(() => {
  if (!props.modelValue || props.modelValue.length < props.minLength) {
    return []
  }
  
  const searchTerm = props.modelValue.toLowerCase()
  const suggestions = props.suggestions.length > 0 ? props.suggestions : defaultSuggestions.value
  
  return suggestions
    .filter(item => item.toLowerCase().includes(searchTerm))
    .slice(0, props.maxSuggestions)
})

const showNoResults = computed(() => {
  return isFocused.value && 
         props.modelValue.length >= props.minLength && 
         filteredSuggestions.value.length === 0 &&
         !isLoading.value
})

// Методы
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  
  // Сброс выделения при вводе
  highlightedIndex.value = -1
  
  // Debounced поиск
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    if (value.length >= props.minLength) {
      performSearch(value)
    } else {
      showSuggestions.value = false
    }
  }, props.debounceDelay)
}

const performSearch = async (query) => {
  isLoading.value = true
  showSuggestions.value = true
  
  // Имитация асинхронного поиска
  await new Promise(resolve => setTimeout(resolve, 200))
  
  isLoading.value = false
  emit('search', query)
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
  
  if (props.modelValue.length >= props.minLength) {
    showSuggestions.value = true
  }
}

const handleBlur = () => {
  // Задержка для обработки клика по предложению
  setTimeout(() => {
    isFocused.value = false
    showSuggestions.value = false
    highlightedIndex.value = -1
    emit('blur')
  }, 150)
}

const handleKeydown = (event) => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) {
    return
  }
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredSuggestions.value.length - 1
      )
      break
      
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
      
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectSuggestion(filteredSuggestions.value[highlightedIndex.value])
      }
      break
      
    case 'Escape':
      showSuggestions.value = false
      highlightedIndex.value = -1
      inputRef.value?.blur()
      break
  }
}

const selectSuggestion = (suggestion) => {
  emit('update:modelValue', suggestion)
  emit('select', suggestion)
  showSuggestions.value = false
  highlightedIndex.value = -1
  
  // Фокус обратно на поле ввода
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const clearInput = () => {
  emit('update:modelValue', '')
  showSuggestions.value = false
  highlightedIndex.value = -1
  
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const highlightMatch = (text) => {
  if (!props.modelValue) return text
  
  const regex = new RegExp(`(${props.modelValue})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Обработка клика вне компонента
const handleClickOutside = (event) => {
  if (!inputRef.value?.contains(event.target)) {
    showSuggestions.value = false
  }
}

// Наблюдатели
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    showSuggestions.value = false
    highlightedIndex.value = -1
  }
})

// Хуки жизненного цикла
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

// Публичные методы
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

// Экспорт методов для родительского компонента
defineExpose({
  focus,
  blur
})
</script>

<style scoped>
.search-input {
  position: relative;
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper:hover {
  border-color: #c3cfe2;
}

.input-wrapper.focused {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-wrapper.has-value {
  border-color: #4CAF50;
}

.input-icon {
  padding: 0 1rem;
  color: #999;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.search-field {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 0;
  font-size: 1rem;
  background: transparent;
  color: #333;
}

.search-field::placeholder {
  color: #999;
}

.search-field:disabled {
  color: #999;
  cursor: not-allowed;
}

.clear-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #999;
  font-size: 0.8rem;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.clear-button:hover {
  color: #f44336;
}

/* Предложения */
.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 10px 10px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.highlighted {
  background-color: #f8f9fa;
}

.suggestion-item.highlighted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.suggestion-text {
  display: block;
}

.suggestion-text :deep(mark) {
  background-color: #ffeb3b;
  color: #333;
  padding: 0 2px;
  border-radius: 2px;
}

.suggestion-item.highlighted .suggestion-text :deep(mark) {
  background-color: rgba(255,255,255,0.3);
  color: white;
}

/* Сообщение об отсутствии результатов */
.no-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 1rem;
  text-align: center;
  color: #999;
  font-style: italic;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Адаптивность */
@media (max-width: 768px) {
  .input-wrapper {
    border-radius: 20px;
  }
  
  .search-field {
    font-size: 16px; /* Предотвращает зум на iOS */
  }
  
  .suggestions {
    max-height: 150px;
  }
}
</style>