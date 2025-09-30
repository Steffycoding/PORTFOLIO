<template>
  <v-app>
    <v-main class="welcome-page">
      <!-- Theme Toggle Icon -->
      <div class="theme-toggle" @click="toggleTheme">
        <img :src="currentIcon" alt="Toggle Theme" />
      </div>

      <v-container class="welcome-container" fluid>
        <h1 class="title" :style="titleStyle">
          Welcome to My Portfolio
        </h1>

        <div class="button-group">
          <v-btn :style="guestBtnStyle" @click="goGuest">Guest</v-btn>
          <v-btn :style="adminBtnStyle" @click="showAdminPopup = true">Admin</v-btn>
        </div>
      </v-container>

      <!-- Admin Popup -->
      <div v-if="showAdminPopup" class="popup-overlay">
        <div class="popup-card" :class="{ dark: theme.global.current.value.dark }">
          <button class="close-btn" @click="showAdminPopup = false">×</button>
          <h2>Admin Access</h2>
          <input
            type="password"
            v-model="adminPassword"
            placeholder="Enter password"
          />
          <v-btn class="submit-btn" @click="submitAdmin">Enter</v-btn>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

// SVGs
import lightIcon from '~/assets/light.svg'
import darkIcon from '~/assets/dark.svg'

const router = useRouter()
const theme = useTheme()

const currentIcon = computed(() =>
  theme.global.current.value.dark ? darkIcon : lightIcon
)

function toggleTheme() {
  theme.global.current.value.dark ? theme.change('light') : theme.change('dark')
}

function goGuest() {
  router.push('/about')
}

const showAdminPopup = ref(false)
const adminPassword = ref('')

function submitAdmin() {
  if (adminPassword.value === 'theloop') {
    router.push('/admin')
    showAdminPopup.value = false
  } else {
    alert('Incorrect password!')
    adminPassword.value = ''
  }
}

const titleStyle = computed(() => ({
  color: theme.global.current.value.dark ? '#00BCD4' : '#0057FF',
  textShadow: theme.global.current.value.dark
    ? '0 0 8px rgba(0,188,212,0.6), 0 0 14px rgba(0,150,180,0.4)'
    : '0 0 6px rgba(0,87,255,0.6), 0 0 12px rgba(0,65,200,0.4)',
}))

const buttonGradient = computed(() =>
  theme.global.current.value.dark
    ? 'linear-gradient(145deg, #00BCD4, #E78F0A)'
    : 'linear-gradient(145deg, #0057FF, #E78F0A)'
)

const guestBtnStyle = computed(() => ({ backgroundImage: buttonGradient.value, color: '#fff' }))
const adminBtnStyle = computed(() => ({ backgroundImage: buttonGradient.value, color: '#fff' }))
</script>

<style scoped>
/* --- Page --- */
.welcome-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  text-align: center;
  padding-top: 5vh;
  position: relative;
  overflow: hidden; /* prevent scrolling */
}

/* Icon */
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
.theme-toggle:hover { transform: scale(1.12); }

/* Container */
.welcome-container {
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vh, 18rem);
  align-items: center;
  margin-top: clamp(5vh, 10vh, 12vh);
  padding: 0 2vw;
  max-width: 100%;
}
.title {
  font-size: clamp(2.5rem, 6vw, 6rem);
  font-weight: 900;
  line-height: 1.1;
  overflow: hidden;
}

/* Button Group */
.button-group {
  display: flex;
  justify-content: center;
  gap: clamp(2rem, 5vw, 10rem);
  flex-wrap: wrap; /* wrap on smaller screens */
  width: 100%;
}

/* Buttons */
.v-btn {
  flex: 1 1 auto;
  min-width: 150px;
  max-width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(1.5rem, 2vw, 3rem) clamp(2.5rem, 4vw, 4.5rem);
  font-size: clamp(1.2rem, 2vw, 1.9rem);
  border-radius: 20px;
  cursor: pointer;
  text-transform: none;
  overflow: hidden;
  position: relative;
  box-shadow: 0 7px 20px rgba(0,0,0,0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 10rem;
}
.v-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    120deg,
    rgba(255,255,255,0.2) 0%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0.2) 100%
  );
  transform: rotate(25deg);
  pointer-events: none;
  animation: buttonShimmer 2s infinite;
}
.v-btn:hover { transform: scale(1.05); box-shadow: 0 10px 28px rgba(0,0,0,0.45); }

/* --- Popup Overlay --- */
.popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background-color: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 2vw;
  overflow: hidden; /* prevent scrolling */
}

/* Popup Card */
.popup-card {
  background: #fff;
  padding: clamp(2rem, 3vw, 3.5rem) clamp(2.5rem, 4vw, 4.5rem);
  border-radius: clamp(1.5rem, 2vw, 2.5rem);
  width: clamp(280px, 45%, 520px);
  max-width: 95%;
  text-align: center;
  position: relative;
  box-shadow: 0 25px 50px rgba(0,0,0,0.55);
  pointer-events: auto;
}
.popup-card.dark {
  background: #181818;
  color: #fff;
}

/* Close button top-right */
.close-btn {
  position: absolute;
  top: clamp(0.8rem, 1vw, 1.2rem);
  right: clamp(0.8rem, 1vw, 1.2rem);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

/* Popup Title */
.popup-card h2 {
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  margin-bottom: clamp(1rem, 2vh, 1.5rem);
  text-shadow: 0 0 6px rgba(0,0,0,0.25);
}

/* Input */
.popup-card input {
  width: 100%;
  padding: clamp(0.8rem, 1.5vw, 1.2rem) clamp(1rem, 2vw, 1.5rem);
  margin: clamp(1rem, 2vh, 1.5rem) 0 clamp(1.5rem, 2vh, 2rem);
  border-radius: 12px;
  border: 2px solid transparent;
  font-size: clamp(1rem, 1.5vw, 1.3rem);
  outline: none;
  background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
  box-shadow: inset 0 0 6px rgba(0,0,0,0.15), 0 0 10px rgba(0,0,0,0.1);
}
.popup-card.dark input {
  background: #262626;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 6px rgba(0,0,0,0.3);
  color: #fff;
}
.popup-card input:focus {
  border-color: #00BCD4;
  box-shadow: 0 0 18px #00BCD4, inset 0 0 8px rgba(0,188,212,0.25);
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: clamp(1.2rem, 2vw, 1.8rem);
  font-size: clamp(1.2rem, 1.5vw, 1.6rem);
  border-radius: 15px;
  background: linear-gradient(145deg, #00BCD4, #E78F0A);
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(0,0,0,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.submit-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    120deg,
    rgba(255,255,255,0.2) 0%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0.2) 100%
  );
  transform: rotate(25deg);
  pointer-events: none;
  animation: buttonShimmer 2s infinite;
}
.submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 28px rgba(0,0,0,0.6);
}

/* --- Fully Responsive Layout --- */

/* Large tablets / smaller desktops */
@media (max-width: 1024px) {
  .button-group {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
  .v-btn {
    padding: 1.8rem 3rem;
    font-size: 1.5rem;
  }
  .title { font-size: 3.8rem; margin-bottom: 1.8rem; }
  .welcome-container { gap: 0; margin-top: 6vh; }
  .theme-toggle { width: 70px; height: 70px; }
  .popup-card { width: 85%; padding: 2.5rem 2rem; }
  .popup-card input { margin-bottom: 1rem; }
  .submit-btn { margin-top: 0; }
}

/* Tablets / small laptops */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
  }
  .v-btn {
    width: 80%;
    max-width: 280px;
    padding: 1.8rem 2.5rem;
    font-size: 1.45rem;
  }
  .title { font-size: 3rem; line-height: 1.2; margin-bottom: 1.2rem; }
  .welcome-container { gap: 0; margin-top: 5vh; }
  .theme-toggle { width: 60px; height: 60px; }
  .popup-card { width: 85%; padding: 2.2rem 2rem; }
  .popup-card h2 { font-size: 1.8rem; margin-bottom: 1rem; }
  .popup-card input { font-size: 1.3rem; padding: 1rem 1.2rem; margin-bottom: 0.8rem; }
  .submit-btn { font-size: 1.4rem; padding: 1.2rem 0; margin-top: 0.4rem; }
}

/* Mobile phones */
@media (max-width: 480px) {
  .button-group {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem; /* tight spacing between buttons */
  }
  .v-btn {
    width: 85%;
    max-width: 240px;
    padding: 1.5rem 2rem;
    font-size: 1.35rem;
  }
  .title {
    font-size: 2.3rem;
    line-height: 1.2;
    margin-top: 1rem; /* reduced from 2rem */
    margin-bottom: 0.5rem; /* added to bring buttons closer */
  }
  .welcome-container {
    gap: 0;
    margin-top: 4vh; /* slightly less to move everything up */
  }
  .theme-toggle { width: 50px; height: 50px; }
  .popup-card {
    width: 90%;
    padding: 1.8rem 1.6rem;
  }
  .popup-card h2 {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }
  .popup-card input {
    font-size: 1.2rem;
    padding: 0.9rem 1rem;
    margin-bottom: 0.6rem;
  }
  .submit-btn {
    font-size: 1.3rem;
    padding: 1rem 0;
    margin-top: 0.3rem;
  }
}


/* Mobile phones */
@media (max-width: 480px) {
  .welcome-container {
    display: flex;
    flex-direction: column;
    align-items: center;   /* keep buttons centered horizontally */
    gap: 0;                 /* remove extra spacing between children */
    margin-top: 4vh;        /* move container down slightly to give title breathing room */
  }

  .title {
    font-size: 2.3rem;
    line-height: 1.2;
    margin-top: 1.5rem;   /* small margin-bottom to bring buttons closer */
  }

  .button-group {
    justify-content: center;
    align-items: center;
    gap: 0.4rem;            /* tighter spacing between buttons */
    margin-top: -3rem;
  }

  .v-btn {
    width: 100vw;
    max-width: auto;
    padding: 1.5rem 2rem;
    font-size: 1.35rem;
    margin-top: 8rem;
  }

  .theme-toggle {
    width: 50px;
    height: 50px;
  }

  .popup-card {
    width: 90%;
    padding: 1.8rem 1.6rem;
  }

  .popup-card h2 {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }

  .popup-card input {
    font-size: 1.2rem;
    padding: 0.9rem 1rem;
    margin-bottom: 0.6rem;
  }

  .submit-btn {
    font-size: 1.3rem;
    padding: 1rem 0;
    margin-top: 0.3rem;
  }
}




</style>
