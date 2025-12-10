<template>
  <div class="settings">
    <div class="settings-header">
      <h1>Настройки</h1>
      <p>Управление параметрами приложения</p>
    </div>

    <div class="settings-layout">
      <!-- Боковое меню -->
      <nav class="settings-nav">
        <div class="nav-title">Разделы</div>
        <ul class="nav-list">
          <li>
            <router-link 
              to="/settings/general" 
              class="nav-item"
              active-class="active"
            >
              ⚙️ Общие настройки
            </router-link>
          </li>
          <li>
            <router-link 
              to="/settings/account" 
              class="nav-item"
              active-class="active"
            >
              👤 Аккаунт
            </router-link>
          </li>
        </ul>
        
        <!-- Быстрые действия -->
        <div class="quick-actions">
          <div class="action-title">Быстрые действия</div>
          <button @click="exportSettings" class="action-btn">
            📤 Экспорт настроек
          </button>
          <button @click="importSettings" class="action-btn">
            📥 Импорт настроек
          </button>
          <button @click="resetSettings" class="action-btn danger">
            🔄 Сброс настроек
          </button>
        </div>
      </nav>

      <!-- Основной контент -->
      <main class="settings-content">
        <!-- Хлебные крошки -->
        <div class="breadcrumbs">
          <router-link to="/" class="breadcrumb-item">Главная</router-link>
          <span class="breadcrumb-separator">→</span>
          <router-link to="/settings" class="breadcrumb-item">Настройки</router-link>
          <span v-if="currentSection" class="breadcrumb-separator">→</span>
          <span v-if="currentSection" class="breadcrumb-item current">{{ currentSection }}</span>
        </div>

        <!-- Контент вложенных маршрутов -->
        <div class="settings-view">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          
          <!-- Контент по умолчанию, если нет активного маршрута -->
          <div v-if="!$route.matched.some(record => record.children?.length)" class="default-content">
            <div class="welcome-card">
              <div class="welcome-icon">⚙️</div>
              <h2>Добро пожаловать в настройки</h2>
              <p>Выберите раздел из меню слева для настройки приложения</p>
              
              <div class="settings-overview">
                <div class="overview-item">
                  <div class="overview-icon">🎨</div>
                  <div class="overview-content">
                    <h4>Общие настройки</h4>
                    <p>Тема, язык, уведомления</p>
                  </div>
                </div>
                
                <div class="overview-item">
                  <div class="overview-icon">👤</div>
                  <div class="overview-content">
                    <h4>Настройки аккаунта</h4>
                    <p>Профиль, безопасность, приватность</p>
                  </div>
                </div>
              </div>
              
              <div class="quick-start">
                <router-link to="/settings/general" class="btn">
                  Начать с общих настроек
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Навигация -->
    <div class="settings-navigation">
      <button @click="$router.go(-1)" class="btn btn-secondary">
        ← Назад
      </button>
      <router-link to="/" class="btn">
        🏠 На главную
      </router-link>
    </div>

    <!-- Модальное окно подтверждения -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ confirmModal.title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ confirmModal.message }}</p>
        </div>
        <div class="modal-actions">
          <button @click="confirmAction" class="btn btn-danger">
            Подтвердить
          </button>
          <button @click="closeModal" class="btn btn-secondary">
            Отменить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Реактивные данные
const showConfirmModal = ref(false)
const confirmModal = ref({
  title: '',
  message: '',
  action: null
})

// Вычисляемые свойства
const currentSection = computed(() => {
  const sectionMap = {
    'general': 'Общие настройки',
    'account': 'Настройки аккаунта'
  }
  
  const childRoute = route.matched[route.matched.length - 1]
  const sectionName = childRoute?.name?.replace('Settings', '').toLowerCase()
  
  return sectionMap[sectionName] || null
})

// Методы
const exportSettings = () => {
  // Имитация экспорта настроек
  const settings = {
    theme: 'light',
    language: 'ru',
    notifications: true,
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(settings, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'settings.json'
  link.click()
  
  URL.revokeObjectURL(url)
}

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result)
          console.log('Импортированные настройки:', settings)
          alert('Настройки успешно импортированы!')
        } catch (error) {
          alert('Ошибка при импорте настроек: неверный формат файла')
        }
      }
      reader.readAsText(file)
    }
  }
  
  input.click()
}

const resetSettings = () => {
  showConfirmModal.value = true
  confirmModal.value = {
    title: 'Сброс настроек',
    message: 'Вы уверены, что хотите сбросить все настройки к значениям по умолчанию? Это действие нельзя отменить.',
    action: () => {
      // Имитация сброса настроек
      console.log('Настройки сброшены')
      alert('Настройки успешно сброшены!')
      closeModal()
    }
  }
}

const confirmAction = () => {
  if (confirmModal.value.action) {
    confirmModal.value.action()
  }
}

const closeModal = () => {
  showConfirmModal.value = false
  confirmModal.value = {
    title: '',
    message: '',
    action: null
  }
}

// Автоматическое перенаправление на общие настройки, если находимся на базовом маршруте
watch(() => route.path, (newPath) => {
  if (newPath === '/settings') {
    router.push('/settings/general')
  }
}, { immediate: true })
</script>

<style scoped>
.settings {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.settings-header p {
  color: #666;
  font-size: 1.1rem;
}

.settings-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Боковое меню */
.settings-nav {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.nav-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 2rem;
}

.nav-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  margin-bottom: 0.25rem;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #333;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Быстрые действия */
.quick-actions {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.action-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-align: left;
}

.action-btn:hover {
  background-color: #f8f9fa;
}

.action-btn.danger {
  color: #dc3545;
  border-color: #dc3545;
}

.action-btn.danger:hover {
  background-color: #dc3545;
  color: white;
}

/* Основной контент */
.settings-content {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

/* Хлебные крошки */
.breadcrumbs {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.breadcrumb-item {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #333;
}

.breadcrumb-item.current {
  color: #333;
  font-weight: 600;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #999;
}

/* Контент по умолчанию */
.default-content {
  text-align: center;
}

.welcome-card {
  max-width: 600px;
  margin: 0 auto;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.welcome-card h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.welcome-card p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.settings-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: left;
}

.overview-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.overview-content h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.overview-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.quick-start {
  margin-top: 2rem;
}

/* Переходы */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Навигация */
.settings-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-top: 1px solid #eee;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 15px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.modal-actions {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

/* Адаптивность */
@media (max-width: 768px) {
  .settings-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .settings-nav {
    position: static;
  }
  
  .settings-overview {
    grid-template-columns: 1fr;
  }
  
  .overview-item {
    flex-direction: column;
    text-align: center;
  }
  
  .settings-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>