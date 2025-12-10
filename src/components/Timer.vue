<template>
  <div class="timer">
    <!-- Основной дисплей таймера -->
    <div class="timer-display">
      <div class="time-circle" :class="{ 'running': isRunning, 'paused': isPaused }">
        <div class="time-text">{{ formattedTime }}</div>
        <div class="time-label">{{ timeLabel }}</div>
      </div>
    </div>

    <!-- Контролы таймера -->
    <div class="timer-controls">
      <button
        @click="startTimer"
        :disabled="isRunning"
        class="btn control-btn start-btn"
        title="Запустить таймер"
      >
        ▶️ Старт
      </button>
      
      <button
        @click="pauseTimer"
        :disabled="!isRunning"
        class="btn control-btn pause-btn"
        title="Приостановить таймер"
      >
        ⏸️ Пауза
      </button>
      
      <button
        @click="resetTimer"
        class="btn control-btn reset-btn"
        title="Сбросить таймер"
      >
        ⏹️ Сброс
      </button>
    </div>

    <!-- Настройки таймера -->
    <div class="timer-settings">
      <div class="setting-group">
        <label>Режим:</label>
        <select v-model="timerMode" @change="resetTimer" class="form-input mode-select">
          <option value="stopwatch">Секундомер</option>
          <option value="countdown">Обратный отсчет</option>
        </select>
      </div>
      
      <div v-if="timerMode === 'countdown'" class="setting-group">
        <label>Время (минуты):</label>
        <input
          v-model.number="countdownMinutes"
          @change="resetTimer"
          type="number"
          min="1"
          max="60"
          class="form-input time-input"
        >
      </div>
    </div>

    <!-- Статистика -->
    <div class="timer-stats">
      <div class="stat-item">
        <span class="stat-label">Сессий:</span>
        <span class="stat-value">{{ sessionCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Общее время:</span>
        <span class="stat-value">{{ formatTime(totalTime) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Лучшая сессия:</span>
        <span class="stat-value">{{ formatTime(bestSession) }}</span>
      </div>
    </div>

    <!-- Лапы (для секундомера) -->
    <div v-if="timerMode === 'stopwatch' && laps.length > 0" class="laps-section">
      <h4>Промежуточные результаты:</h4>
      <div class="laps-list">
        <div
          v-for="(lap, index) in laps"
          :key="index"
          class="lap-item"
          :class="{ 'best-lap': lap === bestLap, 'worst-lap': lap === worstLap }"
        >
          <span class="lap-number">{{ index + 1 }}</span>
          <span class="lap-time">{{ formatTime(lap) }}</span>
          <span class="lap-diff" v-if="index > 0">
            {{ getDiffString(lap, laps[index - 1]) }}
          </span>
        </div>
      </div>
      <button @click="addLap" :disabled="!isRunning" class="btn lap-btn">
        ⏱️ Круг
      </button>
    </div>

    <!-- Уведомления -->
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'

// Реактивные данные
const currentTime = ref(0) // в миллисекундах
const isRunning = ref(false)
const isPaused = ref(false)
const timerMode = ref('stopwatch') // 'stopwatch' или 'countdown'
const countdownMinutes = ref(5)
const startTime = ref(0)
const intervalId = ref(null)

// Статистика
const sessionCount = ref(0)
const totalTime = ref(0)
const bestSession = ref(0)
const laps = ref([])
const notification = ref(null)

// Вычисляемые свойства
const formattedTime = computed(() => {
  if (timerMode.value === 'countdown') {
    const remaining = Math.max(0, (countdownMinutes.value * 60 * 1000) - currentTime.value)
    return formatTime(remaining)
  }
  return formatTime(currentTime.value)
})

const timeLabel = computed(() => {
  if (timerMode.value === 'countdown') {
    return currentTime.value >= (countdownMinutes.value * 60 * 1000) ? 'Время вышло!' : 'Осталось'
  }
  return isRunning.value ? 'Идет отсчет' : isPaused.value ? 'Пауза' : 'Готов к запуску'
})

const bestLap = computed(() => {
  return laps.value.length > 0 ? Math.min(...laps.value) : 0
})

const worstLap = computed(() => {
  return laps.value.length > 0 ? Math.max(...laps.value) : 0
})

// Методы
const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const ms = Math.floor((milliseconds % 1000) / 10)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true
    isPaused.value = false
    startTime.value = Date.now() - currentTime.value
    
    intervalId.value = setInterval(() => {
      currentTime.value = Date.now() - startTime.value
      
      // Проверка завершения обратного отсчета
      if (timerMode.value === 'countdown' && currentTime.value >= (countdownMinutes.value * 60 * 1000)) {
        completeTimer()
      }
    }, 10)
    
    showNotification('Таймер запущен', 'success')
  }
}

const pauseTimer = () => {
  if (isRunning.value) {
    isRunning.value = false
    isPaused.value = true
    clearInterval(intervalId.value)
    showNotification('Таймер приостановлен', 'info')
  }
}

const resetTimer = () => {
  isRunning.value = false
  isPaused.value = false
  clearInterval(intervalId.value)
  
  // Сохранение статистики перед сбросом
  if (currentTime.value > 0) {
    sessionCount.value++
    totalTime.value += currentTime.value
    
    if (timerMode.value === 'stopwatch') {
      if (bestSession.value === 0 || currentTime.value > bestSession.value) {
        bestSession.value = currentTime.value
      }
    }
  }
  
  currentTime.value = 0
  laps.value = []
  showNotification('Таймер сброшен', 'info')
}

const completeTimer = () => {
  isRunning.value = false
  isPaused.value = false
  clearInterval(intervalId.value)
  
  sessionCount.value++
  totalTime.value += currentTime.value
  
  if (timerMode.value === 'countdown') {
    showNotification('Время вышло! 🔔', 'warning')
    // Можно добавить звуковое уведомление
    playNotificationSound()
  }
}

const addLap = () => {
  if (isRunning.value && timerMode.value === 'stopwatch') {
    laps.value.push(currentTime.value)
    showNotification(`Круг ${laps.value.length}: ${formatTime(currentTime.value)}`, 'success')
  }
}

const getDiffString = (currentLap, previousLap) => {
  const diff = currentLap - previousLap
  const sign = diff >= 0 ? '+' : ''
  return `${sign}${formatTime(Math.abs(diff))}`
}

const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

const playNotificationSound = () => {
  // Создание простого звукового сигнала
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('Звуковое уведомление недоступно')
  }
}

// Наблюдатели
watch(timerMode, () => {
  resetTimer()
})

// Очистка при размонтировании компонента
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>

<style scoped>
.timer {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

/* Дисплей таймера */
.timer-display {
  margin-bottom: 2rem;
}

.time-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border: 8px solid #e1e5e9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.time-circle.running {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  animation: pulse 2s infinite;
}

.time-circle.paused {
  border-color: #ff9800;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.time-text {
  font-size: 1.8rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.time-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

/* Контролы */
.timer-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.control-btn {
  min-width: 100px;
  font-size: 0.9rem;
}

.start-btn:not(:disabled) {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.pause-btn:not(:disabled) {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.reset-btn {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Настройки */
.timer-settings {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.setting-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: 600;
  color: #555;
}

.mode-select,
.time-input {
  width: 120px;
  text-align: center;
}

/* Статистика */
.timer-stats {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  font-family: 'Courier New', monospace;
}

/* Лапы */
.laps-section {
  margin-top: 2rem;
}

.laps-section h4 {
  margin-bottom: 1rem;
  color: #333;
}

.laps-list {
  max-height: 200px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-family: 'Courier New', monospace;
}

.lap-item:last-child {
  border-bottom: none;
}

.lap-item.best-lap {
  background: #d4edda;
  color: #155724;
  font-weight: bold;
}

.lap-item.worst-lap {
  background: #f8d7da;
  color: #721c24;
  font-weight: bold;
}

.lap-number {
  font-weight: bold;
  min-width: 30px;
}

.lap-time {
  flex: 1;
  text-align: center;
}

.lap-diff {
  font-size: 0.9rem;
  color: #666;
  min-width: 80px;
  text-align: right;
}

.lap-btn {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

/* Уведомления */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.notification.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.notification.warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .time-circle {
    width: 150px;
    height: 150px;
  }
  
  .time-text {
    font-size: 1.4rem;
  }
  
  .timer-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .timer-settings {
    flex-direction: column;
    align-items: center;
  }
  
  .timer-stats {
    flex-direction: column;
  }
  
  .notification {
    position: relative;
    top: auto;
    right: auto;
    margin: 1rem 0;
  }
}
</style>