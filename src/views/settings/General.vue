<template>
  <div class="general-settings">
    <div class="section-header">
      <h2>Общие настройки</h2>
      <p>Настройка внешнего вида и поведения приложения</p>
    </div>

    <div class="settings-sections">
      <!-- Тема приложения -->
      <div class="settings-section">
        <h3>🎨 Внешний вид</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Тема приложения</label>
            <p class="setting-description">Выберите светлую или темную тему</p>
          </div>
          <div class="setting-control">
            <div class="theme-selector">
              <label class="theme-option" :class="{ active: theme === 'light' }">
                <input v-model="theme" type="radio" value="light" name="theme">
                <div class="theme-preview light">
                  <div class="preview-header"></div>
                  <div class="preview-content"></div>
                </div>
                <span>Светлая</span>
              </label>
              
              <label class="theme-option" :class="{ active: theme === 'dark' }">
                <input v-model="theme" type="radio" value="dark" name="theme">
                <div class="theme-preview dark">
                  <div class="preview-header"></div>
                  <div class="preview-content"></div>
                </div>
                <span>Темная</span>
              </label>
              
              <label class="theme-option" :class="{ active: theme === 'auto' }">
                <input v-model="theme" type="radio" value="auto" name="theme">
                <div class="theme-preview auto">
                  <div class="preview-header"></div>
                  <div class="preview-content"></div>
                </div>
                <span>Авто</span>
              </label>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Цветовая схема</label>
            <p class="setting-description">Основной цвет интерфейса</p>
          </div>
          <div class="setting-control">
            <div class="color-palette">
              <label 
                v-for="color in colorOptions" 
                :key="color.name"
                class="color-option"
                :class="{ active: primaryColor === color.value }"
              >
                <input v-model="primaryColor" type="radio" :value="color.value" name="color">
                <div class="color-circle" :style="{ backgroundColor: color.value }"></div>
                <span>{{ color.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Язык и регион -->
      <div class="settings-section">
        <h3>🌍 Язык и регион</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <label for="language" class="setting-label">Язык интерфейса</label>
            <p class="setting-description">Язык отображения элементов интерфейса</p>
          </div>
          <div class="setting-control">
            <select id="language" v-model="language" class="form-input">
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label for="timezone" class="setting-label">Часовой пояс</label>
            <p class="setting-description">Используется для отображения времени</p>
          </div>
          <div class="setting-control">
            <select id="timezone" v-model="timezone" class="form-input">
              <option value="Europe/Moscow">Москва (UTC+3)</option>
              <option value="Europe/London">Лондон (UTC+0)</option>
              <option value="America/New_York">Нью-Йорк (UTC-5)</option>
              <option value="Asia/Tokyo">Токио (UTC+9)</option>
              <option value="Australia/Sydney">Сидней (UTC+10)</option>
            </select>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label for="dateFormat" class="setting-label">Формат даты</label>
            <p class="setting-description">Как отображать даты в приложении</p>
          </div>
          <div class="setting-control">
            <select id="dateFormat" v-model="dateFormat" class="form-input">
              <option value="DD.MM.YYYY">ДД.ММ.ГГГГ ({{ formatDateExample('DD.MM.YYYY') }})</option>
              <option value="MM/DD/YYYY">ММ/ДД/ГГГГ ({{ formatDateExample('MM/DD/YYYY') }})</option>
              <option value="YYYY-MM-DD">ГГГГ-ММ-ДД ({{ formatDateExample('YYYY-MM-DD') }})</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Уведомления -->
      <div class="settings-section">
        <h3>🔔 Уведомления</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Браузерные уведомления</label>
            <p class="setting-description">Показывать уведомления в браузере</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input v-model="browserNotifications" type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Звуковые уведомления</label>
            <p class="setting-description">Воспроизводить звуки при уведомлениях</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input v-model="soundNotifications" type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Email уведомления</label>
            <p class="setting-description">Получать уведомления на email</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input v-model="emailNotifications" type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Производительность -->
      <div class="settings-section">
        <h3>⚡ Производительность</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Анимации</label>
            <p class="setting-description">Включить анимации интерфейса</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input v-model="animations" type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label class="setting-label">Автосохранение</label>
            <p class="setting-description">Автоматически сохранять изменения</p>
          </div>
          <div class="setting-control">
            <label class="toggle-switch">
              <input v-model="autoSave" type="checkbox">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label for="cacheSize" class="setting-label">Размер кэша</label>
            <p class="setting-description">Максимальный размер кэша: {{ cacheSize }}MB</p>
          </div>
          <div class="setting-control">
            <input 
              id="cacheSize"
              v-model="cacheSize" 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              class="range-slider"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="settings-actions">
      <button @click="saveSettings" class="btn" :disabled="!hasChanges">
        💾 Сохранить изменения
      </button>
      <button @click="resetToDefaults" class="btn btn-secondary">
        🔄 Сбросить к умолчанию
      </button>
      <button @click="previewChanges" class="btn btn-secondary">
        👁️ Предварительный просмотр
      </button>
    </div>

    <!-- Предварительный просмотр -->
    <div v-if="showPreview" class="preview-section">
      <h3>Предварительный просмотр настроек</h3>
      <div class="preview-content">
        <div class="preview-item">
          <strong>Тема:</strong> {{ themeLabels[theme] }}
        </div>
        <div class="preview-item">
          <strong>Цвет:</strong> 
          <span class="color-indicator" :style="{ backgroundColor: primaryColor }"></span>
          {{ getColorName(primaryColor) }}
        </div>
        <div class="preview-item">
          <strong>Язык:</strong> {{ languageLabels[language] }}
        </div>
        <div class="preview-item">
          <strong>Уведомления:</strong> 
          {{ browserNotifications ? 'Включены' : 'Отключены' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// Реактивные данные настроек
const theme = ref('light')
const primaryColor = ref('#667eea')
const language = ref('ru')
const timezone = ref('Europe/Moscow')
const dateFormat = ref('DD.MM.YYYY')
const browserNotifications = ref(true)
const soundNotifications = ref(false)
const emailNotifications = ref(true)
const animations = ref(true)
const autoSave = ref(true)
const cacheSize = ref(100)
const showPreview = ref(false)

// Исходные значения для отслеживания изменений
const originalSettings = reactive({
  theme: 'light',
  primaryColor: '#667eea',
  language: 'ru',
  timezone: 'Europe/Moscow',
  dateFormat: 'DD.MM.YYYY',
  browserNotifications: true,
  soundNotifications: false,
  emailNotifications: true,
  animations: true,
  autoSave: true,
  cacheSize: 100
})

// Опции для выбора
const colorOptions = ref([
  { name: 'Синий', value: '#667eea' },
  { name: 'Фиолетовый', value: '#764ba2' },
  { name: 'Розовый', value: '#f093fb' },
  { name: 'Красный', value: '#f5576c' },
  { name: 'Голубой', value: '#4facfe' },
  { name: 'Зеленый', value: '#43e97b' }
])

const themeLabels = {
  light: 'Светлая',
  dark: 'Темная',
  auto: 'Автоматическая'
}

const languageLabels = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch'
}

// Вычисляемые свойства
const hasChanges = computed(() => {
  return theme.value !== originalSettings.theme ||
         primaryColor.value !== originalSettings.primaryColor ||
         language.value !== originalSettings.language ||
         timezone.value !== originalSettings.timezone ||
         dateFormat.value !== originalSettings.dateFormat ||
         browserNotifications.value !== originalSettings.browserNotifications ||
         soundNotifications.value !== originalSettings.soundNotifications ||
         emailNotifications.value !== originalSettings.emailNotifications ||
         animations.value !== originalSettings.animations ||
         autoSave.value !== originalSettings.autoSave ||
         cacheSize.value !== originalSettings.cacheSize
})

// Методы
const formatDateExample = (format) => {
  const now = new Date()
  const day = now.getDate().toString().padStart(2, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const year = now.getFullYear()
  
  switch (format) {
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    default:
      return `${day}.${month}.${year}`
  }
}

const getColorName = (colorValue) => {
  const color = colorOptions.value.find(c => c.value === colorValue)
  return color ? color.name : 'Неизвестный'
}

const saveSettings = () => {
  // Имитация сохранения настроек
  Object.assign(originalSettings, {
    theme: theme.value,
    primaryColor: primaryColor.value,
    language: language.value,
    timezone: timezone.value,
    dateFormat: dateFormat.value,
    browserNotifications: browserNotifications.value,
    soundNotifications: soundNotifications.value,
    emailNotifications: emailNotifications.value,
    animations: animations.value,
    autoSave: autoSave.value,
    cacheSize: cacheSize.value
  })
  
  // Применение темы
  document.documentElement.style.setProperty('--primary-color', primaryColor.value)
  
  alert('Настройки успешно сохранены!')
}

const resetToDefaults = () => {
  if (confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
    theme.value = 'light'
    primaryColor.value = '#667eea'
    language.value = 'ru'
    timezone.value = 'Europe/Moscow'
    dateFormat.value = 'DD.MM.YYYY'
    browserNotifications.value = true
    soundNotifications.value = false
    emailNotifications.value = true
    animations.value = true
    autoSave.value = true
    cacheSize.value = 100
  }
}

const previewChanges = () => {
  showPreview.value = !showPreview.value
}

// Наблюдатели для автоматического применения некоторых настроек
watch(theme, (newTheme) => {
  document.body.className = `theme-${newTheme}`
})

watch(primaryColor, (newColor) => {
  document.documentElement.style.setProperty('--preview-color', newColor)
})
</script>

<style scoped>
.general-settings {
  max-width: 800px;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #666;
  font-size: 1.1rem;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.settings-section {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  border-left: 4px solid var(--preview-color, #667eea);
}

.settings-section h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-info {
  flex: 1;
}

.setting-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.setting-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.setting-control {
  flex-shrink: 0;
}

/* Селектор темы */
.theme-selector {
  display: flex;
  gap: 1rem;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  transition: all 0.3s;
}

.theme-option:hover {
  border-color: #c3cfe2;
}

.theme-option.active {
  border-color: var(--preview-color, #667eea);
  background: rgba(102, 126, 234, 0.1);
}

.theme-option input {
  display: none;
}

.theme-preview {
  width: 60px;
  height: 40px;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.theme-preview.light {
  background: white;
}

.theme-preview.dark {
  background: #333;
}

.theme-preview.auto {
  background: linear-gradient(45deg, white 50%, #333 50%);
}

.preview-header {
  height: 12px;
  background: #f0f0f0;
}

.theme-preview.dark .preview-header {
  background: #555;
}

.preview-content {
  height: 28px;
  background: white;
}

.theme-preview.dark .preview-content {
  background: #444;
}

/* Цветовая палитра */
.color-palette {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.color-option:hover {
  background: rgba(0,0,0,0.05);
}

.color-option.active {
  background: rgba(102, 126, 234, 0.1);
}

.color-option input {
  display: none;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.color-option span {
  font-size: 0.8rem;
  color: #666;
}

/* Переключатели */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--preview-color, #667eea);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Слайдер диапазона */
.range-slider {
  width: 200px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--preview-color, #667eea);
  cursor: pointer;
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--preview-color, #667eea);
  cursor: pointer;
  border: none;
}

/* Действия */
.settings-actions {
  display: flex;
  gap: 1rem;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
}

/* Предварительный просмотр */
.preview-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
  border-left: 4px solid var(--preview-color, #667eea);
}

.preview-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

/* Адаптивность */
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .theme-selector {
    justify-content: center;
  }
  
  .color-palette {
    justify-content: center;
  }
  
  .settings-actions {
    flex-direction: column;
  }
  
  .range-slider {
    width: 100%;
  }
}
</style>