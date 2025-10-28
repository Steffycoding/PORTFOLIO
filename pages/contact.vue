<template>
  <div class="contact-page" >
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Theme Toggle -->
    <ThemeToggle class="theme-toggle" />

    <!-- Main content -->
    <main class="main-content">
      <div class="popup-card">
        <!-- Page Title -->
        <h1 class="page-heading">Contact Me:</h1>

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
import { ref } from 'vue'
import SidebarAdmin from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'

const profilePic = ref('/images/me.jpg')

// Dark mode toggle
const isDarkMode = ref(false)
const toggleDarkMode = () => { isDarkMode.value = !isDarkMode.value }
</script>

<style scoped>

/* ---------------- Base Contact Page ---------------- */
.contact-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  overflow: hidden;
  position: relative;
  height: 100vh;
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

/* Popup Card */
.popup-card {
  width: 85%;
  max-width: 550px;
  background: transparent;
  backdrop-filter: blur(6px);
  border-radius: 1.2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.dark-mode .contact-page {
  background-color: #102333;
}

/* Dark Mode */
.dark-mode .popup-card {
  background: #1b3347;
  box-shadow: 0 4px 18px rgba(19, 174, 251, 0.2);
}

/* Contact Buttons in dark mode */
.dark-mode .contact-btn {
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
}
.dark-mode .contact-btn:hover {
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
}

.dark-mode .profile-pic {
  border-color: #13AEFB;
}

/* Upload label */
.dark-mode .upload-label {
  border-color: #13AEFB;
  color: #13AEFB;
  background: rgba(19, 174, 251, 0.15);
}
.dark-mode .upload-label:hover {
  background: #13AEFB;
  color: #fff;
}

/* Title */
.page-heading {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.2rem;
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
  font-size: 1rem;
  font-weight: 600;
  background: rgba(231, 143, 10, 0.12);
  border: 2px solid #E78F0A;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 1.2rem;
}
.upload-label:hover {
  background: #E78F0A;
  color: #fff;
}
.dark-mode .upload-label {
  border-color: #13AEFB;
  color: #13AEFB;
  background: rgba(19, 124, 181, 0.12);
}
.dark-mode .upload-label:hover {
  background: #13AEFB;
  color: #fff;
}
.upload-input { display: none; }

/* Profile pic */
.profile-pic {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  border: 3px solid #13AEFB;
  transition: border-color 0.3s ease;
}
.dark-mode .profile-pic { border-color: #E78F0A; }

/* Contact Buttons */
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  align-items: center;
}

.contact-btn {
  display: block;
  width: 75%;
  max-width: 320px;
  text-align: center;
  padding: 0.9rem 1.2rem;
  font-size: 1.15rem;
  color: #fff;
  background: linear-gradient(145deg, #13AEFB, #E78F0A);
  border-radius: 0.9rem;
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

/* ---------------- Responsiveness ---------------- */
@media (min-width: 1600px) {
  .popup-card { width: 45%; max-width: 700px; padding: 2.5rem; }
  .page-heading { font-size: 2.5rem; }
  .profile-pic { width: 220px; height: 220px; }
  .contact-btn { font-size: 1.4rem; padding: 1.2rem 0; }
}

@media (min-width: 768px) and (max-width: 1280px) {
  .popup-card { width: 50%; max-width: 600px; padding: 2rem; }
  .page-heading { font-size: 2.1rem; }
  .profile-pic { width: 180px; height: 180px; }
  .contact-btn { font-size: 1.25rem; padding: 1.1rem 0; }
}

@media (max-width: 480px) {
  .contact-page {
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .main-content {
    padding: 1rem 0.8rem;
    align-items: center;
    justify-content: center;
    height: 100vh;
    transform: translateY(-20px);
  }
  .popup-card {
    width: 90%;
    max-width: 350px;
    padding: 1.2rem;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
    border-radius: 0.9rem;
  }
  .page-heading { font-size: 1.4rem; margin-bottom: 0.8rem; }
  .profile-pic { width: 120px; height: 120px; margin-bottom: 1rem; }
  .contact-btn { width: 100%; max-width: 280px; font-size: 1rem; padding: 0.75rem 0; }
  SidebarAdmin { display: none; }
}

</style>
