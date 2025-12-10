<template>
  <div class="account-settings">
    <div class="section-header">
      <h2>Настройки аккаунта</h2>
      <p>Управление профилем, безопасностью и приватностью</p>
    </div>

    <div class="settings-sections">
      <!-- Профиль пользователя -->
      <div class="settings-section">
        <h3>👤 Профиль</h3>
        
        <div class="profile-header">
          <div class="avatar-section">
            <div class="current-avatar" :style="{ backgroundColor: profile.avatarColor }">
              {{ profile.initials }}
            </div>
            <div class="avatar-actions">
              <button @click="changeAvatar" class="btn btn-small">Изменить</button>
              <button @click="removeAvatar" class="btn btn-small btn-secondary">Удалить</button>
            </div>
          </div>
          
          <div class="profile-info">
            <h4>{{ profile.name }}</h4>
            <p>{{ profile.email }}</p>
            <span class="profile-status" :class="profile.status">
              {{ statusLabels[profile.status] }}
            </span>
          </div>
        </div>

        <div class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Имя</label>
              <input 
                id="firstName"
                v-model="profile.firstName" 
                type="text" 
                class="form-input"
                :disabled="!editingProfile"
              >
            </div>
            
            <div class="form-group">
              <label for="lastName" class="form-label">Фамилия</label>
              <input 
                id="lastName"
                v-model="profile.lastName" 
                type="text" 
                class="form-input"
                :disabled="!editingProfile"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="profile.email" 
              type="email" 
              class="form-input"
              :disabled="!editingProfile"
            >
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Телефон</label>
            <input 
              id="phone"
              v-model="profile.phone" 
              type="tel" 
              class="form-input"
              :disabled="!editingProfile"
            >
          </div>
          
          <div class="form-group">
            <label for="bio" class="form-label">О себе</label>
            <textarea 
              id="bio"
              v-model="profile.bio" 
              class="form-input"
              rows="3"
              :disabled="!editingProfile"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button 
              v-if="!editingProfile"
              @click="startEditProfile" 
              class="btn"
            >
              ✏️ Редактировать профиль
            </button>
            
            <template v-else>
              <button @click="saveProfile" class="btn">
                💾 Сохранить
              </button>
              <button @click="cancelEditProfile" class="btn btn-secondary">
                ❌ Отменить
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- Безопасность -->
      <div class="settings-section">
        <h3>🔒 Безопасность</h3>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Пароль</h4>
            <p>Последнее изменение: {{ formatDate(security.passwordChanged) }}</p>
          </div>
          <button @click="changePassword" class="btn btn-secondary">
            Изменить пароль
          </button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Двухфакторная аутентификация</h4>
            <p>{{ security.twoFactorEnabled ? 'Включена' : 'Отключена' }}</p>
          </div>
          <button 
            @click="toggleTwoFactor" 
            class="btn"
            :class="security.twoFactorEnabled ? 'btn-danger' : ''"
          >
            {{ security.twoFactorEnabled ? 'Отключить' : 'Включить' }}
          </button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Активные сессии</h4>
            <p>{{ security.activeSessions }} активных сессий</p>
          </div>
          <button @click="viewSessions" class="btn btn-secondary">
            Управление сессиями
          </button>
        </div>
        
        <div class="security-item">
          <div class="security-info">
            <h4>Резервные коды</h4>
            <p>Коды для восстановления доступа</p>
          </div>
          <button @click="generateBackupCodes" class="btn btn-secondary">
            Сгенерировать коды
          </button>
        </div>
      </div>

      <!-- Приватность -->
      <div class="settings-section">
        <h3>🛡️ Приватность</h3>
        
        <div class="privacy-item">
          <div class="privacy-info">
            <label class="privacy-label">Публичный профиль</label>
            <p>Разрешить другим пользователям видеть ваш профиль</p>
          </div>
          <label class="toggle-switch">
            <input v-model="privacy.publicProfile" type="checkbox">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="privacy-item">
          <div class="privacy-info">
            <label class="privacy-label">Показывать статус онлайн</label>
            <p>Другие пользователи смогут видеть, когда вы в сети</p>
          </div>
          <label class="toggle-switch">
            <input v-model="privacy.showOnlineStatus" type="checkbox">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="privacy-item">
          <div class="privacy-info">
            <label class="privacy-label">Аналитика и телеметрия</label>
            <p>Помочь улучшить приложение, отправляя анонимные данные</p>
          </div>
          <label class="toggle-switch">
            <input v-model="privacy.analytics" type="checkbox">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="privacy-item">
          <div class="privacy-info">
            <label class="privacy-label">Персонализированная реклама</label>
            <p>Показывать рекламу на основе ваших интересов</p>
          </div>
          <label class="toggle-switch">
            <input v-model="privacy.personalizedAds" type="checkbox">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- Управление данными -->
      <div class="settings-section">
        <h3>📊 Управление данными</h3>
        
        <div class="data-item">
          <div class="data-info">
            <h4>Экспорт данных</h4>
            <p>Скачать копию всех ваших данных</p>
          </div>
          <button @click="exportData" class="btn btn-secondary">
            📤 Экспортировать
          </button>
        </div>
        
        <div class="data-item">
          <div class="data-info">
            <h4>Удаление аккаунта</h4>
            <p>Безвозвратно удалить аккаунт и все данные</p>
          </div>
          <button @click="deleteAccount" class="btn btn-danger">
            🗑️ Удалить аккаунт
          </button>
        </div>
      </div>
    </div>

    <!-- Статистика аккаунта -->
    <div class="account-stats">
      <h3>📈 Статистика аккаунта</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatDate(accountStats.created) }}</div>
            <div class="stat-label">Дата регистрации</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🕐</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatDate(accountStats.lastLogin) }}</div>
            <div class="stat-label">Последний вход</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💾</div>
          <div class="stat-content">
            <div class="stat-value">{{ accountStats.dataSize }}</div>
            <div class="stat-label">Размер данных</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔐</div>
          <div class="stat-content">
            <div class="stat-value">{{ accountStats.loginAttempts }}</div>
            <div class="stat-label">Попыток входа</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Реактивные данные профиля
const profile = reactive({
  firstName: 'Иван',
  lastName: 'Петров',
  email: 'ivan.petrov@example.com',
  phone: '+7 (999) 123-45-67',
  bio: 'Frontend разработчик с опытом работы в Vue.js и современных веб-технологиях.',
  avatarColor: '#667eea',
  status: 'active'
})

const originalProfile = reactive({ ...profile })
const editingProfile = ref(false)

// Данные безопасности
const security = reactive({
  passwordChanged: new Date('2024-01-15'),
  twoFactorEnabled: false,
  activeSessions: 3,
  backupCodes: []
})

// Настройки приватности
const privacy = reactive({
  publicProfile: true,
  showOnlineStatus: true,
  analytics: false,
  personalizedAds: false
})

// Статистика аккаунта
const accountStats = reactive({
  created: new Date('2023-06-15'),
  lastLogin: new Date(),
  dataSize: '2.3 MB',
  loginAttempts: 0
})

// Вычисляемые свойства
const statusLabels = {
  active: 'Активный',
  inactive: 'Неактивный',
  suspended: 'Заблокирован'
}

const initials = computed(() => {
  return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
})

const name = computed(() => {
  return `${profile.firstName} ${profile.lastName}`
})

// Обновляем вычисляемые свойства в профиле
profile.initials = initials
profile.name = name

// Методы
const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const changeAvatar = () => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b']
  const currentIndex = colors.indexOf(profile.avatarColor)
  const nextIndex = (currentIndex + 1) % colors.length
  profile.avatarColor = colors[nextIndex]
}

const removeAvatar = () => {
  if (confirm('Вы уверены, что хотите удалить аватар?')) {
    profile.avatarColor = '#ccc'
  }
}

const startEditProfile = () => {
  editingProfile.value = true
  Object.assign(originalProfile, profile)
}

const saveProfile = () => {
  editingProfile.value = false
  alert('Профиль успешно сохранен!')
}

const cancelEditProfile = () => {
  editingProfile.value = false
  Object.assign(profile, originalProfile)
}

const changePassword = () => {
  const newPassword = prompt('Введите новый пароль:')
  if (newPassword && newPassword.length >= 6) {
    security.passwordChanged = new Date()
    alert('Пароль успешно изменен!')
  } else if (newPassword) {
    alert('Пароль должен содержать минимум 6 символов')
  }
}

const toggleTwoFactor = () => {
  if (security.twoFactorEnabled) {
    if (confirm('Вы уверены, что хотите отключить двухфакторную аутентификацию?')) {
      security.twoFactorEnabled = false
      alert('Двухфакторная аутентификация отключена')
    }
  } else {
    security.twoFactorEnabled = true
    alert('Двухфакторная аутентификация включена! Сохраните резервные коды.')
  }
}

const viewSessions = () => {
  alert(`Активные сессии:\n1. Текущая сессия (Chrome, Windows)\n2. Мобильное приложение (Android)\n3. Планшет (Safari, iPad)`)
}

const generateBackupCodes = () => {
  const codes = Array.from({ length: 8 }, () => 
    Math.random().toString(36).substring(2, 8).toUpperCase()
  )
  security.backupCodes = codes
  alert(`Резервные коды сгенерированы:\n${codes.join('\n')}\n\nСохраните их в безопасном месте!`)
}

const exportData = () => {
  const data = {
    profile: profile,
    privacy: privacy,
    exportDate: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = 'account-data.json'
  link.click()
  
  URL.revokeObjectURL(url)
}

const deleteAccount = () => {
  const confirmation = prompt('Для подтверждения удаления аккаунта введите "УДАЛИТЬ":')
  if (confirmation === 'УДАЛИТЬ') {
    alert('Аккаунт будет удален в течение 30 дней. Вы можете отменить удаление, войдя в систему.')
  } else if (confirmation !== null) {
    alert('Неверное подтверждение. Аккаунт не удален.')
  }
}
</script>

<style scoped>
.account-settings {
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
  border-left: 4px solid #667eea;
}

.settings-section h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Профиль */
.profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.current-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.avatar-actions {
  display: flex;
  gap: 0.5rem;
}

.profile-info {
  flex: 1;
}

.profile-info h4 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.profile-info p {
  color: #666;
  margin-bottom: 0.5rem;
}

.profile-status {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.profile-status.active {
  background: #d4edda;
  color: #155724;
}

.profile-status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.profile-form {
  max-width: 500px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  min-width: auto;
}

/* Безопасность */
.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.security-item:last-child {
  margin-bottom: 0;
}

.security-info h4 {
  margin-bottom: 0.25rem;
  color: #333;
}

.security-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

/* Приватность */
.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.privacy-item:last-child {
  margin-bottom: 0;
}

.privacy-info {
  flex: 1;
}

.privacy-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.privacy-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
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
  background-color: #667eea;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Управление данными */
.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.data-item:last-child {
  margin-bottom: 0;
}

.data-info h4 {
  margin-bottom: 0.25rem;
  color: #333;
}

.data-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

/* Статистика аккаунта */
.account-stats {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.account-stats h3 {
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .security-item,
  .privacy-item,
  .data-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>