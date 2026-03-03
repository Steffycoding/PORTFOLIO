<template>
  <div class="theme-toggle" @click="toggleTheme">
    <img :src="currentIcon" alt="Toggle Theme" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import lightIcon from '~/assets/light.svg'
import darkIcon from '~/assets/dark.svg'

const theme = useTheme()
const currentTheme = ref('light') // default

// Apply saved theme immediately to prevent white flash
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  document.body.classList.add(savedTheme + '-mode')
}

// Only access localStorage in browser
onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedTheme = localStorage.getItem('theme') || 'light'
    currentTheme.value = savedTheme

    // new Vuetify API
    theme.change(savedTheme)

    document.body.classList.toggle('dark-mode', savedTheme === 'dark')
  }
})


const currentIcon = computed(() => (currentTheme.value === 'dark' ? darkIcon : lightIcon))

function toggleTheme() {
  if (typeof window === 'undefined') return
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  currentTheme.value = newTheme
  theme.change(newTheme)       // ✅ new API
  localStorage.setItem('theme', newTheme)
  document.body.classList.remove('light-mode', 'dark-mode')
  document.body.classList.add(newTheme + '-mode')
}

</script>



<style>
.theme-toggle {
  position: fixed;
  top: 2.2vh;
  left: 1.2vw;
  width: clamp(22px, 3vw, 40px); 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.theme-toggle img {
  width: 100%;
  height: auto;
  display: block;
}

/* 🟠 Orange tint in light mode */
body.light-mode .theme-toggle img {
  filter: invert(55%) sepia(90%) saturate(600%) hue-rotate(360deg) brightness(105%);
}

/* 🩵 Teal tint in dark mode */
body.dark-mode .theme-toggle img {
  filter: invert(65%) sepia(40%) saturate(500%) hue-rotate(140deg) brightness(95%);
}

.theme-toggle:hover {
  transform: scale(1.12);
  filter: drop-shadow(0 0 8px #40748f);
  transition: transform 0.2s ease, filter 0.2s ease;
}

/* Responsiveness */
@media (max-width: 480px) {
  .theme-toggle {
    width: clamp(20px, 7vw, 35px); /* ⬅ also reduced */
  }
}
</style>