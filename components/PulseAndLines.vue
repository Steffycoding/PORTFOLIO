<template>
  <div class="pulse-and-lines">
    <span class="center-pulse"></span>
    <div class="screen-digital-lines"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentTheme = ref('light')

// Apply saved theme immediately
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  currentTheme.value = savedTheme
  document.body.classList.add(savedTheme + '-mode')
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedTheme = localStorage.getItem('theme') || 'light'
    currentTheme.value = savedTheme
    document.body.classList.toggle('dark-mode', savedTheme === 'dark')
  }
})
</script>

<style scoped>
.pulse-and-lines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -10;
  overflow: hidden;
}

/* Center dim pulse */
.center-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  z-index: -1;
  animation: centerPulse 3s infinite ease-in-out;
  opacity: 0.3;
}

/* Pulse colors based on theme */
.light-mode .center-pulse {
  background: radial-gradient(circle, rgba(231,143,10,0.25) 0%, transparent 70%);
}

.dark-mode .center-pulse {
  background: radial-gradient(circle, rgba(19,174,251,0.2) 0%, transparent 70%);
}

@keyframes centerPulse {
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.2; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.2; }
}

/* Screen-wide subtle digital lines */
.screen-digital-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -2;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.03) 0px,
    rgba(255,255,255,0.03) 1px,
    transparent 1px,
    transparent 6px
  );
  animation: moveScreenLines 10s linear infinite;
}

/* Dark mode digital lines */
.dark-mode .screen-digital-lines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(19,174,251,0.03) 0px,
    rgba(19,174,251,0.03) 1px,
    transparent 1px,
    transparent 6px
  );
}

@keyframes moveScreenLines {
  0% { background-position: 0 0; }
  100% { background-position: 0 30px; }
}
</style>
