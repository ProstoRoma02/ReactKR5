<template>
  <form @submit.prevent="handleSubmit" class="reactive-form">
    <!-- Имя -->
    <div class="form-group">
      <label for="name" class="form-label">Имя *</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        class="form-input"
        :class="{ 'error-input': errors.name }"
        placeholder="Введите ваше имя"
      >
      <div v-if="errors.name" class="error">{{ errors.name }}</div>
    </div>

    <!-- Email -->
    <div class="form-group">
      <label for="email" class="form-label">Email *</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="form-input"
        :class="{ 'error-input': errors.email }"
        placeholder="example@email.com"
      >
      <div v-if="errors.email" class="error">{{ errors.email }}</div>
    </div>

    <!-- Технология -->
    <div class="form-group">
      <label for="technology" class="form-label">Любимая технология</label>
      <select
        id="technology"
        v-model="form.technology"
        class="form-input"
      >
        <option value="">Выберите технологию</option>
        <option value="vue">Vue.js</option>
        <option value="react">React</option>
        <option value="angular">Angular</option>
        <option value="svelte">Svelte</option>
        <option value="vanilla">Vanilla JS</option>
      </select>
    </div>

    <!-- Опыт работы -->
    <div class="form-group">
      <label class="form-label">Опыт работы</label>
      <div class="radio-group">
        <label class="radio-label">
          <input
            v-model="form.experience"
            type="radio"
            value="junior"
            name="experience"
          >
          <span class="radio-text">Junior (0-2 года)</span>
        </label>
        <label class="radio-label">
          <input
            v-model="form.experience"
            type="radio"
            value="middle"
            name="experience"
          >
          <span class="radio-text">Middle (2-5 лет)</span>
        </label>
        <label class="radio-label">
          <input
            v-model="form.experience"
            type="radio"
            value="senior"
            name="experience"
          >
          <span class="radio-text">Senior (5+ лет)</span>
        </label>
      </div>
    </div>

    <!-- Подписка на новости -->
    <div class="form-group">
      <label class="checkbox-label">
        <input
          v-model="form.newsletter"
          type="checkbox"
        >
        <span class="checkbox-text">Подписаться на новости</span>
      </label>
    </div>

    <!-- Кнопки -->
    <div class="form-actions">
      <button
        type="submit"
        class="btn"
        :disabled="!isFormValid"
        :class="{ 'btn-disabled': !isFormValid }"
      >
        Отправить
      </button>
      <button
        type="button"
        @click="resetForm"
        class="btn btn-secondary"
      >
        Сбросить
      </button>
    </div>

    <!-- Предварительный просмотр данных -->
    <div v-if="showPreview" class="form-preview">
      <h4>Предварительный просмотр:</h4>
      <div class="preview-content">
        <p><strong>Имя:</strong> {{ form.name }}</p>
        <p><strong>Email:</strong> {{ form.email }}</p>
        <p><strong>Технология:</strong> {{ technologyLabel }}</p>
        <p><strong>Опыт:</strong> {{ experienceLabel }}</p>
        <p><strong>Подписка:</strong> {{ form.newsletter ? 'Да' : 'Нет' }}</p>
      </div>
    </div>

    <!-- Сообщение об успехе -->
    <div v-if="submitMessage" class="submit-message" :class="submitMessageType">
      {{ submitMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// Реактивные данные формы
const form = reactive({
  name: '',
  email: '',
  technology: '',
  experience: '',
  newsletter: false
})

// Ошибки валидации
const errors = reactive({
  name: '',
  email: ''
})

// Состояние компонента
const showPreview = ref(false)
const submitMessage = ref('')
const submitMessageType = ref('')

// Вычисляемые свойства
const isFormValid = computed(() => {
  return form.name.trim() !== '' && 
         form.email.trim() !== '' && 
         isValidEmail(form.email) &&
         !errors.name && 
         !errors.email
})

const technologyLabel = computed(() => {
  const technologies = {
    vue: 'Vue.js',
    react: 'React',
    angular: 'Angular',
    svelte: 'Svelte',
    vanilla: 'Vanilla JS'
  }
  return technologies[form.technology] || 'Не выбрана'
})

const experienceLabel = computed(() => {
  const experiences = {
    junior: 'Junior (0-2 года)',
    middle: 'Middle (2-5 лет)',
    senior: 'Senior (5+ лет)'
  }
  return experiences[form.experience] || 'Не указан'
})

// Методы валидации
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateName = () => {
  if (!form.name.trim()) {
    errors.name = 'Имя обязательно для заполнения'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа'
  } else {
    errors.name = ''
  }
}

const validateEmail = () => {
  if (!form.email.trim()) {
    errors.email = 'Email обязателен для заполнения'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Введите корректный email адрес'
  } else {
    errors.email = ''
  }
}

// Методы компонента
const handleSubmit = () => {
  validateName()
  validateEmail()
  
  if (isFormValid.value) {
    // Имитация отправки данных
    submitMessage.value = 'Форма успешно отправлена!'
    submitMessageType.value = 'success'
    
    // Показываем предварительный просмотр
    showPreview.value = true
    
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  } else {
    submitMessage.value = 'Пожалуйста, исправьте ошибки в форме'
    submitMessageType.value = 'error'
    
    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
  }
}

const resetForm = () => {
  // Сброс данных формы
  Object.assign(form, {
    name: '',
    email: '',
    technology: '',
    experience: '',
    newsletter: false
  })
  
  // Сброс ошибок
  Object.assign(errors, {
    name: '',
    email: ''
  })
  
  // Скрытие предварительного просмотра
  showPreview.value = false
  submitMessage.value = ''
}

// Наблюдатели для валидации в реальном времени
watch(() => form.name, validateName)
watch(() => form.email, validateEmail)
</script>

<style scoped>
.reactive-form {
  max-width: 500px;
  margin: 0 auto;
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

.error-input {
  border-color: #e74c3c;
}

.error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Radio группа */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.radio-label:hover {
  background-color: #f8f9fa;
}

.radio-label input[type="radio"] {
  margin-right: 0.5rem;
}

.radio-text {
  font-size: 0.95rem;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.checkbox-label:hover {
  background-color: #f8f9fa;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 0.5rem;
}

.checkbox-text {
  font-size: 0.95rem;
}

/* Кнопки */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Предварительный просмотр */
.form-preview {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #667eea;
  margin-bottom: 1rem;
}

.form-preview h4 {
  margin-bottom: 1rem;
  color: #333;
}

.preview-content p {
  margin-bottom: 0.5rem;
  color: #555;
}

/* Сообщения */
.submit-message {
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  font-weight: 600;
}

.submit-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Адаптивность */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .radio-group {
    gap: 0.25rem;
  }
}
</style>