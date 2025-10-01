<template>
  <v-app>
    <v-main class="cv-page">
      <!-- Theme Toggle -->
      <div class="theme-toggle" @click="toggleTheme">
        <img :src="currentIcon" alt="Toggle Theme" />
      </div>

      <v-container class="cv-wrapper" fluid>
        <!-- Sidebar / Footer Nav -->
        <div class="sidebar">
          <nav class="sidebar-nav">
            <router-link to="/" class="sidebar-btn" :class="{ active: isActive('/') }">Home</router-link>
            <router-link to="/about" class="sidebar-btn" :class="{ active: isActive('/about') }">About</router-link>
            <router-link to="/cv" class="sidebar-btn" :class="{ active: isActive('/cv') }">CV</router-link>
            <router-link to="/playground" class="sidebar-btn" :class="{ active: isActive('/playground') }">Playground</router-link>
            <router-link to="/contact" class="sidebar-btn" :class="{ active: isActive('/contact') }">Contact</router-link>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Header / Name -->
          <header class="cv-header">
            <h1 class="cv-name">Stephanie Poole</h1>
            <p class="cv-role">Aspiring Software Developer</p>
          </header>

          <!-- Summary -->
          <section class="cv-section">
            <h2 class="section-title">Summary</h2>
            <p class="summary">
              Driven by determination, I embarked on a programming journey despite my initial lack of knowledge in Python and Java. 
              I believe continuous learning and experimentation are keys to success. 
              Inspired by gaming and anime, I merge creativity with programming to spark unique ideas. 
              Approaching graduation, I’m eager to embrace opportunities, challenges, and growth in the programming world.
            </p>
          </section>

          <!-- Experience -->
          <section class="cv-section">
            <h2 class="section-title">Experience</h2>
            <div class="job">
              <h3>WeThinkCode — Student</h3>
              <span class="date">Sept 2022 – Dec 2023</span>
              <p>16-month course covering Python and Java. Completed both 1st and 2nd year as part of the program.</p>
            </div>
            <div class="job">
              <h3>ORT SA CAPE — Teaching Assistant</h3>
              <span class="date">Apr 2021 – Mar 2022</span>
              <p>Assisted teachers in reducing stress and workload, supporting both staff and students in their learning environment.</p>
            </div>
          </section>

          <!-- Education -->
          <section class="cv-section">
            <h2 class="section-title">Education</h2>
            <ul>
              <li><strong>WeThinkCode</strong> — NQF 5, Information Technology</li>
              <li><strong>Manenberg High School</strong> — Matric, Grade 12 (2020)</li>
            </ul>
          </section>

          <!-- Tech Stack + Professional Skills -->
          <section class="cv-section">
            <h2 class="section-title">Tech & Skills</h2>
            <div class="stack">
              <div>
                <h3>Languages</h3>
                <ul>
                  <li>Python</li>
                  <li>Java</li>
                  <li>JavaScript</li>
                  <li>HTML & CSS</li>
                  <li>SQL</li>
                </ul>
              </div>
              <div>
                <h3>Frameworks & Tools</h3>
                <ul>
                  <li>Vue.js (Nuxt, Vuetify)</li>
                  <li>React (basic)</li>
                  <li>Figma (UI/UX)</li>
                  <li>Git / GitHub</li>
                  <li>Linux / CLI</li>
                </ul>
              </div>
              <div>
                <h3>Professional Skills</h3>
                <ul class="skills">
                  <li>Project Planning & Organization</li>
                  <li>Teamwork & Collaboration</li>
                  <li>Problem Solving</li>
                  <li>Adaptability</li>
                  <li>Communication</li>
                  <li>Continuous Learning</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

import lightIcon from '~/assets/light.svg'
import darkIcon from '~/assets/dark.svg'

const theme = useTheme()
const route = useRoute()

const currentIcon = computed(() =>
  theme.global.current.value.dark ? darkIcon : lightIcon
)

function toggleTheme() {
  theme.global.current.value.dark
    ? theme.change('light')
    : theme.change('dark')
}

function isActive(path: string) {
  return route.path === path
}
</script>



<style scoped>
/* ----------------- Theme Toggle ----------------- */
.theme-toggle {
  position: fixed;
  top: 1.5vh;
  left: 1.5vw;
  width: clamp(40px, 6vw, 70px);
  z-index: 1100;
  cursor: pointer;
}
.theme-toggle img { width: 100%; }
.theme-toggle:hover {
  transform: scale(1.12);
  transition: transform 0.2s ease;
}

/* ----------------- Layout ----------------- */
.cv-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  padding-top: 2rem;
  overflow: hidden; /* prevent scrolling anywhere */
}

/* Sidebar */
.sidebar {
  width: clamp(200px, 18%, 280px);
  height: 100vh;
  background: rgba(var(--v-theme-background-rgb), 0.25);
  backdrop-filter: blur(10px);
  border-radius: 0 1.2rem 1.2rem 0;
  box-shadow: 2px 0 15px rgba(0,0,0,0.15);
  padding: 4rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

.sidebar-nav { display: flex; flex-direction: column; gap: 1.5rem; }

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
  padding: 1.5rem 2rem;
  text-align: left;
  overflow: hidden; /* prevent scrolling */
}

/* CV Styles */
.cv-page {
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  min-height: 100vh;
}

/* Sections & Typography */
.cv-header { text-align: center; margin-bottom: 1rem; }
.cv-name { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #E78F0A; }
.cv-role { font-size: 1rem; color: #13AEFB; font-weight: 500; }

.cv-section { margin-bottom: 1.2rem; }
.section-title { font-size: 1.35rem; font-weight: 700; color: #E78F0A; margin-bottom: 0.6rem; border-bottom: 2px solid rgba(231, 143, 10, 0.4); padding-bottom: 0.2rem; }

.job { margin-bottom: 1rem; }
.job h3 { font-size: 1.05rem; font-weight: 600; }
.date { font-size: 0.85rem; color: gray; display: block; margin-bottom: 0.2rem; }

.summary { font-size: 0.95rem; line-height: 1.5; text-align: justify; }

.skills, .cv-section ul { list-style: none; padding: 0; margin: 0; }
.skills li, .cv-section ul li { margin-bottom: 0.4rem; font-size: 0.95rem; }

.stack { display: flex; flex-wrap: wrap; gap: 1.2rem; }
.stack > div { flex: 1; min-width: 180px; }
.stack h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.3rem; }
.stack ul { padding-left: 1rem; }

/* ---------------- Responsive ---------------- */

/* Mobile (≤768px) */
@media (max-width: 768px) {
  .cv-wrapper { flex-direction: column; }

  .sidebar {
    position: fixed;
    bottom: 0;
    top: auto;
    width: 100%;
    height: 70px;
    border-radius: 1rem 1rem 0 0;
    padding: 0.5rem 1rem;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    backdrop-filter: blur(20px);
  }

  .sidebar-nav { flex-direction: row; width: 100%; justify-content: space-around; gap: 0.5rem; }
  .sidebar-btn {
    flex: 1;
    font-size: 0.85rem;
    padding: 0.4rem;
    border-left: none;
    border-bottom: 3px solid transparent;
    border-radius: 8px;
  }
  .sidebar-btn.active { border-bottom: 3px solid #E78F0A; background: rgba(231, 143, 10, 0.15); }

  .main-content { margin-left: 0; padding: 1rem; padding-bottom: 90px; }
}

/* Screens between 600px and 1050px */
@media (min-width: 600px) and (max-width: 1050px) {
  .cv-name { font-size: 2.2rem; }
  .cv-role { font-size: 0.95rem; }
  .section-title { font-size: 1.25rem; margin-bottom: 0.5rem; }
  .summary, .skills li, .cv-section ul li { font-size: 0.9rem; line-height: 1.4; }
  .job h3 { font-size: 1rem; }
  .date { font-size: 0.8rem; margin-bottom: 0.15rem; }
  .stack > div { min-width: 160px; gap: 1rem; }
  .stack h3 { font-size: 1rem; margin-bottom: 0.25rem; }
}

/* Medium screens: tablets / small laptops */
@media (min-width: 769px) and (max-width: 1280px) {
  .sidebar-btn { font-size: 1.1rem; padding: 0.85rem 0; }
  .sidebar-nav { gap: 1.5rem; }
  .cv-name { font-size: 2.5rem; }
  .cv-role { font-size: 1.05rem; }
  .section-title { font-size: 1.4rem; }
  .summary, .skills li, .cv-section ul li { font-size: 1.0rem; line-height: 1.6; }
  .stack > div { min-width: 200px; }
}

/* Nest Hub / fixed mid-size screens */
@media (min-width: 1024px) and (max-width: 1280px) {
  /* Header */
  .cv-name { font-size: 2.4rem; }
  .cv-role { font-size: 1rem; }

  /* Section titles */
  .section-title { font-size: 1.3rem; margin-bottom: 0.5rem; }

  /* Job & date */
  .job h3 { font-size: 1.05rem; }
  .date { font-size: 0.85rem; margin-bottom: 0.2rem; }

  /* Summary & lists */
  .summary, .skills li, .cv-section ul li { font-size: 0.95rem; line-height: 1.45; }

  /* Stack */
  .stack > div { min-width: 180px; gap: 1rem; }
  .stack h3 { font-size: 1rem; margin-bottom: 0.25rem; }
}


/* Large screens: desktops */
@media (min-width: 1281px) {
  .sidebar-btn { font-size: 1.25rem; padding: 1rem 0; }
  .sidebar-nav { gap: 1.8rem; }
  .cv-name { font-size: 2.8rem; }
  .cv-role { font-size: 1.1rem; }
  .section-title { font-size: 1.5rem; }
  .summary, .skills li, .cv-section ul li { font-size: 1.15rem; line-height: 1.7; }
  .stack > div { min-width: 210px; }
}

/* Extra-large screens */
@media (min-width: 1601px) {
  .sidebar-btn { font-size: 1.35rem; padding: 1.1rem 0; }
  .sidebar-nav { gap: 2rem; }
  .cv-name { font-size: 3rem; }
  .cv-role { font-size: 1.2rem; }
  .section-title { font-size: 1.6rem; }
  .summary, .skills li, .cv-section ul li { font-size: 1.25rem; line-height: 1.8; }
  .stack > div { min-width: 220px; }
}

</style>
