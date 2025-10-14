<template>
  <div v-if="mounted" class="admin-page">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Theme Toggle -->
    <ThemeToggle class="theme-toggle" />

    <!-- Main content -->
    <main class="main-content">
      <div class="popup-card">
        <!-- Page Title -->
        <h1 class="page-heading">Contact Me:</h1>

        <!-- Image upload input -->
        <label for="upload" class="upload-label">Upload New Image</label>
        <input id="upload" type="file" accept="image/*" @change="onFileChange" class="upload-input" />

        <!-- Display profile picture -->
        <img :src="profilePic" class="profile-pic" alt="Profile Picture" />

        <div class="contact-links">
          <a href="mailto:stephaniepoole2002@gmail.com" target="_blank" class="contact-btn">Email Me</a>
          <a href="https://www.linkedin.com/in/stephanie-poole-708455250/" target="_blank" class="contact-btn">LinkedIn</a>
          <a href="tel:+27746282617" target="_blank" class="contact-btn">WhatsApp Me</a>
          <a href="https://github.com/Steffycoding" target="_blank" class="contact-btn">GitHub</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SidebarAdmin from '~/components/AdminSidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { useTheme } from 'vuetify'

const profilePic = ref('/images/me.jpg')
const mounted = ref(false)
const theme = useTheme()

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      profilePic.value = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  // Ensure we only access localStorage in the browser
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') || 'light'
    theme.global.name.value = savedTheme
    document.body.classList.toggle('dark-mode', savedTheme === 'dark')
  }
  mounted.value = true
})
</script>

<style scoped>
/* Match About Page Theme System */
.admin-page {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Main content */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem 2rem;
  position: relative;
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
  filter: drop-shadow(0 0 8px #13AEFB);
}

/* Popup card */
.popup-card {
  width: 90%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* Dark mode adaptive */
.dark-mode .admin-page {
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
}
.dark-mode .popup-card {
  background: rgba(19, 124, 181, 0.08);
  box-shadow: 0 6px 25px rgba(19, 124, 181, 0.25);
}

/* Title */
.page-heading {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
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

/* Upload label */
.upload-label {
  color: #E78F0A;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(231, 143, 10, 0.15);
  border: 2px solid #E78F0A;
  border-radius: 1rem;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 1.5rem;
}
.upload-label:hover {
  background: #E78F0A;
  color: #fff;
}
.dark-mode .upload-label {
  border-color: #13AEFB;
  color: #13AEFB;
  background: rgba(19, 124, 181, 0.15);
}
.dark-mode .upload-label:hover {
  background: #13AEFB;
  color: #fff;
}

.upload-input {
  display: none;
}

/* Profile pic */
.profile-pic {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  border: 4px solid #13AEFB;
  transition: border-color 0.3s ease;
}
.dark-mode .profile-pic {
  border-color: #E78F0A;
}

/* Contact buttons */
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
}

.contact-btn {
  display: block;
  width: 80%;
  max-width: 350px;
  text-align: center;
  padding: 1rem 1.5rem;
  font-size: 1.3rem;
  color: #fff;
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.25s ease;
}
.contact-btn:hover {
  transform: scale(1.05);
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
}
.dark-mode .contact-btn {
  background: linear-gradient(145deg, #137CB5, #E78F0A);
}
.dark-mode .contact-btn:hover {
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
}

/* Responsiveness */
@media (min-width: 1600px) {
  .popup-card {
    width: 45%;
    max-width: 800px;
    padding: 3rem;
  }
  .page-heading { font-size: 3rem; }
  .profile-pic { width: 250px; height: 250px; }
  .contact-btn { font-size: 1.6rem; padding: 1.6rem 0; }
}
@media (min-width: 768px) and (max-width: 1280px) {
  .popup-card { width: 50%; max-width: 650px; padding: 2.5rem; }
  .page-heading { font-size: 2.4rem; }
  .profile-pic { width: 200px; height: 200px; }
  .contact-btn { font-size: 1.45rem; padding: 1.5rem 0; }
}
@media (max-width: 480px) {
  .admin-page { flex-direction: column; }
  .main-content { padding: 2rem 1rem; }
  .popup-card { width: 95%; padding: 1.8rem; }
  .page-heading { font-size: 1.8rem; margin-bottom: 1.5rem; }
  .profile-pic { width: 150px; height: 150px; margin-bottom: 1.5rem; }
  .contact-btn { font-size: 1.25rem; padding: 1rem 0; }
}

</style>
