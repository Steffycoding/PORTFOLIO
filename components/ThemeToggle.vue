<template>
  <div class="theme-toggle" @click="toggleTheme">
    <img :src="currentIcon" alt="Toggle Theme" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import lightIcon from '~/assets/light.svg'
import darkIcon from '~/assets/dark.svg'

const theme = useTheme()

const currentIcon = computed(() =>
  theme.global.current.value.dark ? darkIcon : lightIcon
)

function toggleTheme() {
  theme.global.current.value.dark ? theme.change('light') : theme.change('dark')
}
</script>

<style scoped>
.theme-toggle {
  position: absolute;
  top: 1.5vh;
  left: 1.5vw;
  width: clamp(50px, 6vw, 90px);
  height: auto;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s ease;
}
.theme-toggle img {
  width: 100%;
  height: auto;
}
.theme-toggle:hover {
  transform: scale(1.12);
}
</style>
