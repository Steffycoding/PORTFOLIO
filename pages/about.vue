<template>
  <v-app>
    <v-main class="about-page">
      <!-- Theme Toggle Component -->
      <ThemeToggle class="theme-toggle" />

      <v-container class="about-container" fluid>
        <!-- Sidebar component -->
        <Sidebar />

        <!-- Main Content -->
        <div class="main-content">
          <h1 class="title">About Me</h1>
          <!-- About text from composable -->
          <div class="intro-text" v-html="aboutText"></div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { useAbout } from '../composables/useAbout'

// Use composable for reactive about text
const { aboutText } = useAbout()
</script>

<style>
.about-page {
  display: flex;
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
}

/* Theme toggle */
.theme-toggle {
  position: fixed;
  top: 1.5vh;
  left: 1.5vw;
  width: clamp(35px, 5.5vw, 60px);
  z-index: 1100;
  cursor: pointer;
}
.theme-toggle img {
  width: 100%;
}
.theme-toggle:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Layout container */
.about-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
}

/* Main content */
.main-content {
  margin-left: clamp(220px, 20%, 300px);
  flex: 1;
  padding: 2rem 3rem;
  text-align: left;
}

/* Title */
.title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 1rem;
  font-family: 'Poppins', 'Inter', sans-serif;
  background: linear-gradient(90deg, #E78F0A, #13AEFB, #E78F0A);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientAnimation 6s ease infinite;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.intro-text {
  font-size: clamp(1rem, 1.4vw, 1.6rem);
  line-height: 1.7;
  max-width: 1000px;
  margin: 0 auto;
  color: var(--v-theme-surface);
}


.highlight {
  color: #E78F0A !important;
  font-weight: 600;
}

/* Fully Responsive Layout */
@media (max-width: 768px) {
  .about-container { flex-direction: column; }
  .main-content { margin-left: 0; padding: 1.5rem; padding-bottom: 90px; }
}

@media (min-width: 768px) and (max-width: 1280px) {
  .title { font-size: 3rem; margin-bottom: 2rem; }
  .intro-text { font-size: 1.4rem; line-height: 1.8; max-width: 900px; }
}

@media (min-width: 1280px) and (max-width: 1600px) {
  .title { font-size: 3.5rem; margin-bottom: 2.2rem; }
  .intro-text { font-size: 1.55rem; line-height: 1.9; max-width: 1000px; padding: 1rem 0; }
}

@media (min-width: 1600px) {
  .title { font-size: 4rem; margin-bottom: 2.5rem; }
  .intro-text { font-size: 1.7rem; line-height: 2; max-width: 1200px; padding: 2rem 0; }
}

@media (min-width: 300px) and (max-width: 1000px) {
  .title { font-size: clamp(2.4rem, 7vw, 3.2rem); margin-top: 2rem; margin-bottom: 1.8rem; }
  .intro-text { font-size: clamp(1.1rem, 1.5vw, 1.4rem); line-height: 1.8; margin-top: 1.2rem; }
  .main-content { padding-top: 3rem; }
}

@media (width: 1024px) {
  .title { font-size: 2.8rem; }
  .intro-text { font-size: 1.2rem; line-height: 1.7; }
}

@media (max-width: 400px) {
  .title { font-size: 1.7rem; margin-top: 1rem; margin-bottom: 1rem; }
  .intro-text { font-size: 0.9rem; line-height: 1.5; }
  .main-content { padding: 1rem; }
}

.error-text { color: red; font-size: 0.9rem; }
</style>
