<template>
  <div class="profile">
    <div class="profile-header">
      <h1>Профиль пользователя</h1>
      <p v-if="id">ID пользователя: {{ id }}</p>
      <p v-else>Общий профиль</p>
    </div>

    <div class="profile-content">
      <!-- Карточка пользователя -->
      <div class="user-card">
        <div class="user-avatar">
          <div class="avatar-circle" :style="{ backgroundColor: user.color }">
            {{ user.initials }}
          </div>
          <button @click="changeAvatar" class="change-avatar-btn">📷</button>
        </div>
        
        <div class="user-info">
          <h2 class="user-name">{{ user.name }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <div class="user-status" :class="user.status">
            <span class="status-indicator"></span>
            {{ statusText }}
          </div>
        </div>
        
        <div class="user-actions">
          <button @click="toggleStatus" class="btn">
            {{ user.status === 'online' ? 'Перейти в офлайн' : 'Перейти в онлайн' }}
          </button>
          <button @click="editProfile" class="btn btn-secondary">
            Редактировать
          </button>
        </div>
      </div>

      <!-- Статистика пользователя -->
      <div class="user-stats">
        <h3>Статистика</h3>
        <div class="stats-grid">
          <div class="stat-card" v-for="stat in userStats" :key="stat.key">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Активность пользователя -->
      <div class="user-activity">
        <h3>Последняя активность</h3>
        <div class="activity-list">
          <div 
            v-for="activity in userActivity" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.text }}</div>
              <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Настройки профиля -->
      <div class="profile-settings">
        <h3>Настройки профиля</h3>
        <div class="settings-form">
          <div class="form-group">
            <label class="form-label">Имя отображения</label>
            <input 
              v-model="editableUser.name" 
              type="text" 
              class="form-input"
              :disabled="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              v-model="editableUser.email" 
              type="email" 
              class="form-input"
              :disabled="!isEditing"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Описание</label>
            <textarea 
              v-model="editableUser.bio" 
              class="form-input"
              rows="3"
              :disabled="!isEditing"
              placeholder="Расскажите о себе..."
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="editableUser.notifications" 
                type="checkbox"
                :disabled="!isEditing"
              >
              <span>Получать уведомления</span>
            </label>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="editableUser.publicProfile" 
                type="checkbox"
                :disabled="!isEditing"
              >
              <span>Публичный профиль</span>
            </label>
          </div>
          
          <div class="form-actions" v-if="isEditing">
            <button @click="saveProfile" class="btn">Сохранить</button>
            <button @click="cancelEdit" class="btn btn-secondary">Отменить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Навигация -->
    <div class="profile-navigation">
      <button @click="$router.go(-1)" class="btn btn-secondary">
        ← Назад
      </button>
      <router-link to="/" class="btn">
        🏠 На главную
      </router-link>
      <router-link 
        :to="id ? `/profile/${parseInt(id) + 1}` : '/profile/2'" 
        class="btn"
      >
        Следующий профиль →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Props от роутера
const props = defineProps({
  id: {
    type: String,
    default: null
  }
})

const route = useRoute()

// Реактивные данные
const user = reactive({
  name: 'Иван Петров',
  email: 'ivan.petrov@example.com',
  bio: 'Frontend разработчик с опытом работы в Vue.js',
  status: 'online',
  color: '#667eea',
  initials: 'ИП',
  notifications: true,
  publicProfile: true
})

const editableUser = reactive({ ...user })
const isEditing = ref(false)

const userStats = ref([
  { key: 'projects', icon: '📁', label: 'Проектов', value: 12 },
  { key: 'commits', icon: '💾', label: 'Коммитов', value: 247 },
  { key: 'reviews', icon: '👀', label: 'Ревью', value: 89 },
  { key: 'stars', icon: '⭐', label: 'Звезд', value: 156 }
])

const userActivity = ref([
  {
    id: 1,
    icon: '💾',
    text: 'Сделал коммит в проект "Vue Interactive App"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 минут назад
  },
  {
    id: 2,
    icon: '👀',
    text: 'Оставил ревью на pull request',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 часа назад
  },
  {
    id: 3,
    icon: '🌟',
    text: 'Поставил звезду репозиторию "awesome-vue"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 часов назад
  },
  {
    id: 4,
    icon: '📝',
    text: 'Создал новый issue в проекте',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 день назад
  }
])

// Вычисляемые свойства
const statusText = computed(() => {
  const statuses = {
    online: 'В сети',
    offline: 'Не в сети',
    away: 'Отошел',
    busy: 'Занят'
  }
  return statuses[user.status] || 'Неизвестно'
})

// Методы
const changeAvatar = () => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
  const currentIndex = colors.indexOf(user.color)
  const nextIndex = (currentIndex + 1) % colors.length
  user.color = colors[nextIndex]
}

const toggleStatus = () => {
  const statuses = ['online', 'offline', 'away', 'busy']
  const currentIndex = statuses.indexOf(user.status)
  const nextIndex = (currentIndex + 1) % statuses.length
  user.status = statuses[nextIndex]
}

const editProfile = () => {
  isEditing.value = true
  Object.assign(editableUser, user)
}

const saveProfile = () => {
  Object.assign(user, editableUser)
  isEditing.value = false
  
  // Имитация сохранения на сервере
  setTimeout(() => {
    alert('Профиль успешно сохранен!')
  }, 500)
}

const cancelEdit = () => {
  isEditing.value = false
  Object.assign(editableUser, user)
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} мин. назад`
  } else if (hours < 24) {
    return `${hours} ч. назад`
  } else {
    return `${days} дн. назад`
  }
}

// Обновление данных пользователя на основе ID
const updateUserData = () => {
  if (props.id) {
    const userId = parseInt(props.id)
    
    // Генерация данных на основе ID
    const names = ['Иван Петров', 'Мария Сидорова', 'Алексей Козлов', 'Елена Волкова']
    const emails = ['ivan@example.com', 'maria@example.com', 'alexey@example.com', 'elena@example.com']
    const colors = ['#667eea', '#f093fb', '#4facfe', '#ff6b6b']
    
    const index = (userId - 1) % names.length
    
    user.name = names[index]
    user.email = emails[index]
    user.color = colors[index]
    user.initials = user.name.split(' ').map(n => n[0]).join('')
    
    // Обновляем статистику
    userStats.value.forEach(stat => {
      stat.value = Math.floor(Math.random() * 200) + userId * 10
    })
  }
}

// Наблюдатели
watch(() => props.id, updateUserData, { immediate: true })

// Хуки жизненного цикла
onMounted(() => {
  updateUserData()
})
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.profile-header p {
  color: #666;
  font-size: 1.1rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Карточка пользователя */
.user-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: flex;
  gap: 2rem;
  align-items: center;
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.change-avatar-btn:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.user-email {
  color: #666;
  margin-bottom: 1rem;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
}

.user-status.online .status-indicator {
  background: #4CAF50;
}

.user-status.offline .status-indicator {
  background: #999;
}

.user-status.away .status-indicator {
  background: #ff9800;
}

.user-status.busy .status-indicator {
  background: #f44336;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Статистика */
.user-stats h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* Активность */
.user-activity h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.activity-list {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background-color: #f8f9fa;
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 0.25rem;
  color: #333;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}

/* Настройки профиля */
.profile-settings {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.profile-settings h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.settings-form {
  max-width: 500px;
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

.form-input:disabled {
  background-color: #f8f9fa;
  color: #999;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
}

.checkbox-label input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* Навигация */
.profile-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  margin-top: 2rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    text-align: center;
  }
  
  .user-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>