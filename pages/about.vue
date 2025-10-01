<template>
  <v-app>
    <v-main class="about-page">
      <!-- Theme Toggle Icon -->
      <div class="theme-toggle" @click="toggleTheme">
        <img :src="currentIcon" alt="Toggle Theme" />
      </div>

      <v-container class="about-container" fluid>
        <!-- Sidebar / Footer Nav -->
        <div class="sidebar">
          <nav class="sidebar-nav">
            <router-link to="/" class="sidebar-btn">Home</router-link>
            <router-link to="/about" class="sidebar-btn active">About</router-link>
            <router-link to="/cv" class="sidebar-btn">CV</router-link>
            <router-link to="/playground" class="sidebar-btn">Playground</router-link>
            <router-link to="/contact" class="sidebar-btn">Contact</router-link>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <h1 class="title">About Me</h1>
          <div class="intro-text">
            <p>
              <span class="highlight">* Hi, I'm an aspiring web developer</span>. <br>
              * I love tackling projects that push me to learn and create
              <span class="highlight">clean, intuitive interfaces</span>. <br>
              * I often experiment with new ideas just to see where they lead.  
              <br> * Recently, I’ve been exploring <span class="highlight">UI/UX design with FIGMA</span>, because even the smallest layout or color shift can change how something feels to a user. <br>
              * I’m always learning, tweaking, and refining.  
              <br> * Beyond coding, I’m drawn to <span class="highlight">human-centered design</span>—thinking about how technology connects with people. <br>
              * My goal: keep growing, exploring, and creating things that matter.  
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
  width: clamp(40px, 6vw, 70px);
  z-index: 1100;
  cursor: pointer;
}
.theme-toggle img {
  width: 100%;
}
.theme-toggle:hover {
  transform: scale(1.12);
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

/* Sidebar (desktop default) */
.sidebar {
  width: clamp(200px, 18%, 280px);
  min-height: 100vh;
  background: rgba(var(--v-theme-background-rgb), 0.25);
  backdrop-filter: blur(10px);
  border-radius: 0 1.2rem 1.2rem 0;
  box-shadow: 2px 0 15px rgba(0,0,0,0.15);
  padding: 6rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .8rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--v-theme-surface);
  background: rgba(var(--v-theme-background-rgb), 0.15);
  border-left: 4px solid transparent;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.25s ease;
}
.sidebar-btn:hover {
  background: rgba(231, 143, 10, 0.15);
  border-left: 4px solid #E78F0A;
  transform: translateX(3px);
}
.sidebar-btn.active {
  background: rgba(231, 143, 10, 0.2);
  border-left: 4px solid #E78F0A;
  color: #fff;
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
}

.highlight {
  color: #E78F0A;
  font-weight: 600;
}


/* --- Fully Responsive Layout --- */


/* 📱 Mobile/Small screens: Sidebar becomes footer */
@media (max-width: 768px) {
  .about-container {
    flex-direction: column;
  }

  .sidebar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    min-height: auto;
    height: 70px;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    padding: 0.5rem 1rem;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -3px 15px rgba(0,0,0,0.15);
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
    justify-content: space-around;
  }

  .sidebar-btn {
    flex: 1;
    font-size: 0.9rem;
    padding: 0.5rem;
    border-left: none;
    border-bottom: 3px solid transparent;
    border-radius: 8px;
  }
  .sidebar-btn.active {
    border-bottom: 3px solid #E78F0A;
    background: rgba(231, 143, 10, 0.15);
  }

  .main-content {
    margin-left: 0;
    padding: 1.5rem;
    padding-bottom: 90px; /* space for footer nav */
  }
}

/* --- Medium screens: tablets / small laptops (768px–1280px) --- */
@media (min-width: 768px) and (max-width: 1280px) {
  .sidebar-btn {
    font-size: 1.2rem;
    padding: 1rem 0;
  }

  .sidebar-nav {
    gap: 1.8rem;
  }

  .title {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  .intro-text {
    font-size: 1.4rem;
    line-height: 1.8;
    max-width: 900px;
    margin: 0 auto;
  }
}

/* --- Large screens: desktops (1280px–1600px) --- */
@media (min-width: 1280px) and (max-width: 1600px) {
  .sidebar-btn {
    font-size: 1.3rem;
    padding: 1.2rem 0;
  }

  .sidebar-nav {
    gap: 2rem;
  }

  .title {
    font-size: 3.5rem;
    margin-bottom: 2.2rem;
  }

  .intro-text {
    font-size: 1.55rem;
    line-height: 1.9;
    max-width: 1000px;
    padding: 1rem 0;
  }
}

/* --- Extra-large screens: 1600px+ --- */
@media (min-width: 1600px) {
  .sidebar-btn {
    font-size: 1.4rem;
    padding: 1.3rem 0;
  }

  .sidebar-nav {
    gap: 2.2rem;
  }

  .title {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }

  .intro-text {
    font-size: 1.7rem;
    line-height: 2;
    max-width: 1200px;
    padding: 2rem 0;
  }
}

/* --- Custom: 300px–1000px (move down + increase sizes a bit) --- */
@media (min-width: 300px) and (max-width: 1000px) {
  .title {
    font-size: clamp(2.4rem, 7vw, 3.2rem);
    margin-top: 2rem;
    margin-bottom: 1.8rem;
  }

  .intro-text {
    font-size: clamp(1.1rem, 1.5vw, 1.4rem);
    line-height: 1.8;
    margin-top: 1.2rem;
  }

  .main-content {
    padding-top: 3rem;
  }
}

/* --- Custom: 1024px exact (decrease text a bit) --- */
@media (width: 1024px) {
  .title {
    font-size: 2.8rem;
  }

  .intro-text {
    font-size: 1.2rem;
    line-height: 1.7;
  }
}

/* --- Custom: Very small screens (≤400px like iPhone SE) --- */
@media (max-width: 400px) {
  .title {
    font-size: 1.8rem;
    margin-top: 1rem;
    margin-bottom: 1.2rem;
  }

  .intro-text {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .main-content {
    padding: 1rem;
  }
}

/* --- Custom: Very small screens (≤400px like iPhone SE) --- */
@media (max-width: 400px) {
  .title {
    font-size: 1.7rem; /* smaller, avoids scroll */
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .intro-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .sidebar-btn {
    font-size: 0.85rem;
    padding: 0.4rem;
  }

  .main-content {
    padding: 1rem;
  }
}

/* --- Microsoft Surface Pro / Duo (~540–912px width, high DPI) --- */
@media (min-width: 540px) and (max-width: 912px) {
  .title {
    font-size: clamp(2.2rem, 6vw, 2.8rem);
  }

  .intro-text {
    font-size: 1.25rem;
    line-height: 1.7;
  }

  .sidebar-btn {
    font-size: 1.1rem;
    padding: 0.8rem;
  }
}

/* --- Asus Zenbook (common 1366px–1536px widths) --- */
@media (min-width: 1366px) and (max-width: 1536px) and (max-width: 853px){
  .title {
    font-size: 3.5rem;
  }

  .intro-text {
    font-size: 2rem; /* boosted for readability */
    line-height: 1.9;
  }

  .sidebar-btn {
    font-size: 1.35rem; /* slightly bigger */
    padding: 1.1rem 0;
  }
}

.error-text {
  color: red;
  font-size: 0.9rem;
}
</style>
