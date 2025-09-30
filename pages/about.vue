<template>
  <v-app>
    <v-main class="about-page">
      <!-- Theme Toggle Icon -->
      <div class="theme-toggle" @click="toggleTheme">
        <img :src="currentIcon" alt="Toggle Theme" />
      </div>

      <v-container class="about-container" fluid>
        <!-- Sidebar (left) -->
        <div class="sidebar">
          <nav class="sidebar-nav">
            <router-link to="/" class="sidebar-btn">Home</router-link>
            <router-link to="/about" class="sidebar-btn active">About</router-link>
            <router-link to="/cv" class="sidebar-btn">CV</router-link>
            <router-link to="/playground" class="sidebar-btn">Playground</router-link>
            <router-link to="/contact" class="sidebar-btn">Contact Information</router-link>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <h1 class="title">About Me</h1>
          <div class="intro-text">
            <p>
              <span class="highlight">Hi, I'm an aspiring web developer</span> who thrives on <span class="highlight">challenges</span>.
            </p>
            <p>
              I love crafting <span class="highlight">clean, intuitive, and user-friendly interfaces</span> that make a <span class="highlight">real impact</span>.
            </p>
            <p>
              Currently, I’m exploring <span class="highlight">UI/UX design with FIGMA</span> to enhance my <span class="highlight">creative workflow</span>.
            </p>
            <p>
              My goal is to continuously grow, gain knowledge, and sharpen both my <span class="highlight">technical and soft skills</span>.
            </p>
            <p>
              Please find my personal information conveniently on the <span class="highlight">sidebar</span> to the left.
            </p>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
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
  theme.global.current.value.dark
    ? theme.change('light')
    : theme.change('dark')
}
</script>

<style scoped>
/* Overall page */
.about-page {
  display: flex;
  justify-content: flex-start;
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  padding-top: 6vh;
  overflow-x: hidden;
}

/* Theme toggle */
.theme-toggle {
  position: fixed;
  top: 1.5vh;
  left: 1.5vw;
  width: clamp(50px, 6vw, 90px);
  z-index: 1100; /* above sidebar */
  cursor: pointer;
}
.theme-toggle img {
  width: 100%;
}
.theme-toggle:hover {
  transform: scale(1.12);
  transition: transform 0.2s ease;
}

/* Container */
.about-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  align-items: flex-start;
  justify-content: center;
}

/* Sidebar */
.sidebar {
  width: 320px;
  min-height: 100vh;
  background: var(--v-theme-surface);
  border-radius: 0 1.5rem 1.5rem 0;
  box-shadow: 4px 0 25px rgba(0,0,0,0.15);
  padding: 6rem 2rem 2rem 2rem; /* extra top space to avoid toggle overlap */
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

/* Sidebar buttons */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.sidebar-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.6rem 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #f0f0f0;
  background: #2a2a2a;
  border-left: 5px solid transparent;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease;
}
.sidebar-btn:hover {
  background: #1f1f1f;
  border-left: 5px solid #E78F0A;
  transform: translateX(4px);
}
.sidebar-btn.active {
  background: #1f1f1f;
  border-left: 5px solid #E78F0A;
  color: #fff;
}

/* Main content */
.main-content {
  margin-left: 340px; /* offset for wider sidebar */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
  padding: 4rem;
  justify-content: center;
  text-align: center;
}

/* Titles & text */
.title {
  font-size: clamp(4rem, 6vw, 5.2rem);
  font-weight: 900;
  color: #E78F0A;
  margin-bottom: 2rem;
  font-family: 'Poppins', 'Inter', sans-serif;
}

.intro-text p {
  font-size: clamp(1.55rem, 1.85vw, 1.9rem);
  line-height: 2.1;
  margin-bottom: 1.8rem;
  font-family: 'Inter', sans-serif;
}

.highlight {
  color: #E78F0A;
  font-weight: 800;
  font-size: 1.15em;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    position: relative;
    width: 90%;
    border-radius: 1.5rem;
    padding: 3rem 1.5rem;
    top: 0;
  }
  .main-content {
    margin-left: 0;
    padding: 2rem;
  }
}
</style>
