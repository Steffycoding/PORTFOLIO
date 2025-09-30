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
              <span class="highlight">* Hi, I'm an aspiring web developer</span>. <br> * I love tackling projects that push me to learn more and create <span class="highlight">clean, intuitive interfaces</span> is my jam. <br>* I often experiment with new ideas just to see where they lead.  
              <br> * Lately, I’ve been exploring <span class="highlight">UI/UX design with FIGMA</span>, because even the smallest shift in layout or color can change how something feels to a user. <br> * I’m always learning, tweaking, and refining.  
              <br> * Beyond coding, I’m drawn to <span class="highlight">human-centered design</span>, thinking about how technology truly connects with people. <br> * My goal is simple: keep growing, exploring, and creating things that matter.  
              <br> * If you’re curious, you’ll find all my personal and professional details right on the <span class="highlight">sidebar</span> to the left.
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
  justify-content: flex-start;
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  overflow: hidden;
}

.theme-toggle {
  position: fixed;
  top: 1.5vh;
  left: 1.5vw;
  width: clamp(50px, 6vw, 90px);
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

.about-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
}

.sidebar {
  width: clamp(250px, 22%, 330px); /* fluid width for small to XL */
  min-height: 100vh;
  background: rgba(var(--v-theme-background-rgb), 0.25);
  backdrop-filter: blur(10px);
  border-radius: 0 1.5rem 1.5rem 0;
  box-shadow: 2px 0 20px rgba(0,0,0,0.15);
  padding: clamp(8rem, 10%, 12rem) 2rem 2rem 2rem; /* fluid top padding */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 2.5%, 3.5rem); /* fluid gap scaling */
}

.sidebar-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1rem, 1.5vw, 1.7rem) 0;
  font-size: clamp(1.3rem, 1.5vw, 1.7rem);
  font-weight: 500;
  color: var(--v-theme-surface);
  background: rgba(var(--v-theme-background-rgb), 0.15);
  border-left: 4px solid transparent;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease, box-shadow 0.3s ease, transform 0.2s ease;
}
.sidebar-btn:hover {
  background: rgba(231, 143, 10, 0.15);
  border-left: 4px solid #E78F0A;
  transform: translateX(3px);
  box-shadow: 1px 3px 12px rgba(0,0,0,0.25);
}
.sidebar-btn.active {
  background: rgba(231, 143, 10, 0.2);
  border-left: 4px solid #E78F0A;
  color: #fff;
  box-shadow: 1px 3px 15px rgba(0,0,0,0.3);
}

.main-content {
  margin-left: clamp(280px, 25%, 350px); /* fluid margin for different screens */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.5%, 1.5rem);
  padding: clamp(1.5rem, 2vw, 3rem) clamp(2rem, 3vw, 4rem);
  align-items: flex-start;
  text-align: left;
  min-height: 100vh;
  overflow-y: auto;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.title {
  font-size: clamp(2.5rem, 5vw, 4.8rem);
  font-weight: 900;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  font-family: 'Poppins', 'Inter', sans-serif;
  background: linear-gradient(90deg, #E78F0A, #13AEFB, #E78F0A);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  animation: gradientAnimation 6s ease infinite;
}

.intro-text {
  font-size: clamp(1.2rem, 1.5vw, 2rem);
  line-height: clamp(1.6, 2vw, 2.2);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  max-width: 1100px;
  margin: 0 auto;
  text-align: left;
}

.intro-text p {
  letter-spacing: 0.3px;
  word-spacing: 1.4px;
}

.highlight {
  color: #E78F0A;
  font-weight: 600;
  font-size: clamp(1em, 1.02vw, 1.03em);
}

/* Small adjustments for tiny screens */
@media (max-width: 480px) {
  .sidebar {
    width: 250px;
    padding-top: 6rem;
  }
  .main-content {
    margin-left: 250px;
    padding: 1rem 1.5rem;
  }
  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .intro-text {
    font-size: 1.1rem;
    line-height: 1.5;
  }
  .sidebar-btn {
    font-size: 1.2rem;
    padding: 0.8rem 0;
  }
}
</style>
