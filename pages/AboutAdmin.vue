<template>
  <v-app>
    <v-main class="aboutadmin-page">
      <!-- Theme Toggle -->
      <ThemeToggle class="theme-toggle" />

      <v-container class="edit-container" fluid>
        <h1 class="edit-title">Edit About Me</h1>
        <textarea v-model="text" rows="15" class="edit-textarea"></textarea>
        <v-btn class="save-btn" @click="saveAbout">Save Changes</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { useAbout } from '../composables/useAbout'

const router = useRouter()
const { aboutText, updateAbout } = useAbout()
const text = ref(aboutText.value)

// Initialize with current about text
onMounted(() => {
  text.value = aboutText.value
})

// Save and redirect back to normal about page
const saveAbout = () => {
  updateAbout(text.value)
  router.push('/about') // Redirect after save
}
</script>

<style scoped>
.aboutadmin-page {
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 5vh;
}

.theme-toggle {
  position: fixed;
  top: 1.5vh;
  left: 1.5vw;
  width: clamp(40px, 6vw, 70px);
  z-index: 1100;
  cursor: pointer;
}

.edit-container {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.edit-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--v-theme-surface);
}

.edit-textarea {
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #13AEFB;
  resize: vertical;
  background: var(--v-theme-surface);
  color: var(--v-theme-background);
}

.save-btn {
  align-self: flex-end;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.save-btn:hover {
  transform: scale(1.05);
}

/* Fully Responsive */
@media (max-width: 768px) {
  .edit-container { padding: 1rem; }
  .edit-title { font-size: 2rem; }
  .edit-textarea { font-size: 0.95rem; padding: 0.8rem; }
  .save-btn { padding: 0.7rem 1.2rem; }
}
</style>
