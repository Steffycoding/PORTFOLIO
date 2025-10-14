<template>
  <v-app>
    <v-main class="about-page">
      <!-- Theme Toggle Component -->
      <ThemeToggle class="theme-toggle" />

      <v-container class="about-container" fluid>
        <!-- Sidebar component -->
        <AdminSidebar v-if="isAdmin" />

        <!-- Main Content -->
        <div class="main-content">
          <h1 class="title">About Me</h1>

          <!-- Normal Text -->
          <div v-if="!isEditing" class="intro-text" v-html="aboutText"></div>

          <!-- Editable Textarea -->
          <div v-else>
            <textarea v-model="editableText" rows="10" class="edit-textarea"></textarea>
            <div class="button-row">
              <v-btn class="save-btn" @click="saveChanges">Save</v-btn>
              <v-btn class="cancel-btn" @click="cancelEdit">Cancel</v-btn>
            </div>
          </div>

          <!-- Admin Buttons -->
          <transition name="fade">
            <div v-if="isAdmin && !isEditing" class="admin-buttons">
              <v-btn class="edit-btn" @click="startEdit">Edit</v-btn>
              <v-btn class="delete-btn" @click="deleteAbout">Delete</v-btn>
            </div>
          </transition>

          <!-- Success Message -->
          <transition name="fade">
            <div v-if="successMessage" class="success-msg">
              ✅ {{ successMessage }}
            </div>
          </transition>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">
import ThemeToggle from '~/components/ThemeToggle.vue'
import AdminSidebar from '~/components/AdminSidebar.vue'
import { useAbout } from '~/composables/useAbout'
import { ref, onMounted } from 'vue'

const { aboutText, updateAbout } = useAbout()

const isAdmin = ref(false)
const isEditing = ref(false)
const editableText = ref('')
const successMessage = ref('')

// Check admin login after mount (prevents SSR/localStorage mismatch)
onMounted(() => {
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
})

const startEdit = () => {
  editableText.value = aboutText.value
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveChanges = () => {
  updateAbout(editableText.value)
  isEditing.value = false
  successMessage.value = 'Updated successfully!'
  setTimeout(() => (successMessage.value = ''), 2000)
}


const deleteAbout = () => {
  if (confirm('Are you sure you want to delete your About section?')) {
    updateAbout('')
    successMessage.value = 'Deleted successfully!'
    setTimeout(() => (successMessage.value = ''), 2000)
  }
}
</script>



<style scoped>

:root {
  --v-theme-background: #DDDDDD; /* Light background */
  --v-theme-surface: #181818;    /* Light text */
}

.dark-mode {
  --v-theme-background: #062536; /* Dark Navy for dark mode */
  --v-theme-surface: #DDDDDD;    /* Soft gray text */
}


/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Success Message */
.success-msg {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
  color: #fff;
  font-weight: 600;
  padding: 0.8rem 1.4rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 999;
  font-size: 1rem;
}

/* Admin Buttons */
.admin-buttons {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}

.edit-btn,
.save-btn {
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
  color: #fff;
  font-weight: 600;
}

.cancel-btn {
  background: #555;
  color: #fff;
}

.delete-btn {
  background: #B00020;
  color: #fff;
  font-weight: 600;
}

.edit-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #13AEFB;
  border-radius: 8px;
  background: var(--v-theme-surface);
  color: var(--v-theme-background);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
}

/*About Page*/ 
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
