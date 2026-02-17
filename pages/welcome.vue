<template>
  <div v-if="isMounted">
    <v-app>
      <v-main class="welcome-page">

        <!-- Global reusable background component -->
        <BackgroundCanvas />

        <ThemeToggle />

        <v-container class="welcome-container" fluid>
          <div class="title-wrapper">

            <!-- "Hello, I'm" with gradient text + decorative lines -->
            <div class="eyebrow-wrapper">
              <span class="eyebrow-line" />
              <p class="eyebrow">Hello, I'm</p>
              <span class="eyebrow-line" />
            </div>

            <!-- Main name — colour + glow driven by computed titleStyle -->
            <h1 class="title" :style="titleStyle">Stephanie Poole</h1>

            <!-- Subtitle in warm orange to contrast the blue palette -->
            <p class="subtitle">Aspiring Web Developer &amp; UX/UI Designer</p>
          </div>

          <div class="button-group">
            <v-btn class="cta-btn guest-btn" :style="guestBtnStyle" @click="goGuest">
              <span>Explore Portfolio</span><span class="btn-icon">→</span>
            </v-btn>
            <v-btn class="cta-btn admin-btn" :style="adminBtnStyle" @click="showAdminPopup = true">
              <span>Admin</span><span class="btn-icon">⚙</span>
            </v-btn>
          </div>
        </v-container>

        <!-- Admin popup — clicking the backdrop closes it -->
        <transition name="popup-fade">
          <div v-if="showAdminPopup" class="popup-overlay" @click.self="showAdminPopup = false">
            <div class="popup-card" :class="{ dark: theme.global.current.value.dark }">
              <button class="close-btn" @click="showAdminPopup = false">×</button>
              <div class="lock-icon">🔐</div>
              <h2>Admin Access</h2>
              <p class="popup-hint">Enter your credentials to continue</p>
              <input type="password" v-model="adminPassword" placeholder="Password" @keyup.enter="submitAdmin" />
              <v-btn class="submit-btn" @click="submitAdmin">Authenticate</v-btn>
            </div>
          </div>
        </transition>

      </v-main>
    </v-app>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import ThemeToggle from '~/components/ThemeToggle.vue'
import BackgroundCanvas from '~/components/BackgroundCanvas.vue'

const router = useRouter()
const theme = useTheme()
const isMounted = ref(false)
const showAdminPopup = ref(false)
const adminPassword = ref('')

onMounted(() => { isMounted.value = true })

function goGuest() { router.push('/about') }
function submitAdmin() {
  if (adminPassword.value === 'theloop') {
    localStorage.setItem('isAdmin', 'true'); router.push('/AboutAdmin'); showAdminPopup.value = false
  } else { alert('Incorrect password!'); adminPassword.value = '' }
}

// Theme-reactive styles
const isDark = computed(() => theme.global.current.value.dark)

const titleStyle = computed(() => ({
  color: isDark.value ? '#00E5FF' : '#0039d4',
  textShadow: isDark.value
    ? '0 0 28px rgba(0,229,255,0.55), 0 0 55px rgba(0,188,212,0.25)'
    : '0 2px 18px rgba(0,57,212,0.22)',
}))

const guestBtnStyle = computed(() => ({
  background: isDark.value ? 'linear-gradient(135deg,#00BCD4,#0039d4)' : 'linear-gradient(135deg,#0057FF,#00BCD4)',
  boxShadow: isDark.value ? '0 8px 32px rgba(0,188,212,0.45)' : '0 8px 32px rgba(0,87,255,0.4)',
}))
const adminBtnStyle = computed(() => ({
  background: 'transparent',
  border: isDark.value ? '2px solid rgba(0,229,255,0.5)' : '2px solid rgba(0,87,255,0.4)',
  color: isDark.value ? '#00E5FF' : '#0039d4',
}))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

/* Full-viewport centred shell */
.welcome-page {
  position: relative; display: flex;
  justify-content: center; align-items: center;
  min-height: 100vh; min-height: 100dvh;
  background: var(--v-theme-background);
  overflow: hidden; font-family: 'DM Sans', sans-serif;
}


/* Content column */
.welcome-container {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  gap: clamp(2rem, 6vh, 5rem);
  padding: clamp(1rem,3vw,3rem) clamp(1.2rem,4vw,4rem);
  width: 100%; max-width: 920px; margin: 0 auto;
}

/* Title block — slides up on page load */
.title-wrapper {
  display: flex; flex-direction: column; align-items: center;
  gap: clamp(0.35rem, 1vh, 0.75rem);
  animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
}

/* ── "Hello, I'm" row ── */
.eyebrow-wrapper { display: flex; align-items: center; gap: clamp(0.5rem,1.5vw,1rem) }
/* Fading lines either side of the eyebrow text */
.eyebrow-line { flex:1; max-width:clamp(36px,8vw,100px); height:2px; opacity:0.3; background:linear-gradient(90deg,transparent,currentColor) }
.eyebrow-line:last-child { background:linear-gradient(90deg,currentColor,transparent) }
.eyebrow {
  margin: 0; font-family: 'DM Sans', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.9rem);
  font-weight: 600; letter-spacing: clamp(0.12em, 0.5vw, 0.22em); text-transform: uppercase;
  /* Cyan → blue gradient text */
  background: linear-gradient(135deg, #00BCD4, #0057FF);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* ── Main name ── */
.title {
  margin: 0; font-family: 'Syne', sans-serif;
  font-size: clamp(2.5rem, 8vw, 8.5rem); font-weight: 800;
  line-height: 1.02; letter-spacing: -0.03em;
  transition: color 0.4s, text-shadow 0.4s;
}

/* ── Subtitle — warm orange accent ── */
.subtitle {
  margin: 0; font-weight: 400; letter-spacing: 0.03em;
  font-size: clamp(0.9rem, 1.8vw, 1.25rem);
  /* Orange that works in both light and dark */
  color: #E8890C;
  text-shadow: 0 0 18px rgba(232,137,12,0.25);
}

/* ── Buttons ── */
.button-group {
  display: flex; align-items: center; justify-content: center;
  gap: clamp(0.8rem,2vw,2rem); flex-wrap: wrap; width: 100%;
  animation: fadeUp 0.9s 0.18s cubic-bezier(0.16,1,0.3,1) both; /* delayed after title */
}
.cta-btn {
  display: flex !important; align-items: center !important; gap: 0.5rem;
  height: auto !important; min-width: clamp(130px,30vw,210px);
  padding: clamp(0.8rem,1.5vw,1.1rem) clamp(1.5rem,3vw,2.8rem) !important;
  font-family: 'DM Sans', sans-serif !important;
  font-size: clamp(0.95rem,1.5vw,1.2rem) !important; font-weight: 500 !important;
  border-radius: 100px !important; text-transform: none !important;
  position: relative; overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
}
/* Shimmer sweep across button on hover */
.cta-btn::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(120deg,rgba(255,255,255,0) 40%,rgba(255,255,255,0.22) 50%,rgba(255,255,255,0) 60%);
  background-size:200% 100%; background-position:-100% 0;
  transition:background-position 0.55s ease;
}
.cta-btn:hover::after { background-position:200% 0 }
.cta-btn:hover { transform:translateY(-3px) scale(1.03) }
.guest-btn { color:#fff !important }
.btn-icon { transition:transform 0.25s }
.cta-btn:hover .btn-icon { transform:translateX(4px) }

/* ── Admin popup ── */
.popup-overlay {
  position:fixed; inset:0; z-index:2000; padding:1rem;
  backdrop-filter:blur(14px) saturate(1.4); background:rgba(0,0,0,0.5);
  display:flex; justify-content:center; align-items:center;
}
.popup-card {
  background:rgba(255,255,255,0.97); text-align:center; position:relative;
  padding:clamp(1.6rem,4vw,3rem) clamp(1.4rem,4vw,3.6rem);
  border-radius:clamp(16px,3vw,26px); width:clamp(280px,90vw,450px);
  box-shadow:0 30px 80px rgba(0,0,0,0.3),0 0 0 1px rgba(255,255,255,0.5);
  animation:scaleIn 0.35s cubic-bezier(0.16,1,0.3,1); /* pops in when opened */
}
.popup-card.dark { background:rgba(16,16,26,0.97); color:#e8f4ff; box-shadow:0 30px 80px rgba(0,0,0,0.7),0 0 0 1px rgba(0,229,255,0.12) }
.lock-icon { font-size:clamp(1.7rem,4vw,2.4rem); margin-bottom:0.4rem }
.popup-card h2 { font-family:'Syne',sans-serif; font-size:clamp(1.3rem,3vw,2rem); font-weight:700; margin:0 0 0.25rem }
.popup-hint { font-size:clamp(0.78rem,1.5vw,0.9rem); opacity:0.5; margin:0 0 1.1rem }
.close-btn {
  position:absolute; top:clamp(0.6rem,1.5vw,1rem); right:clamp(0.7rem,1.5vw,1.2rem);
  font-size:1.7rem; line-height:1; background:none; border:none; cursor:pointer;
  color:inherit; opacity:0.4; transition:opacity 0.2s;
}
.close-btn:hover { opacity:0.9 }
.popup-card input {
  width:100%; border-radius:12px; border:2px solid transparent; outline:none;
  padding:clamp(0.72rem,1.5vw,0.95rem) clamp(0.85rem,2vw,1.2rem);
  font-family:'DM Sans',sans-serif; font-size:clamp(0.88rem,1.5vw,1rem);
  background:rgba(0,0,0,0.06); color:inherit; margin-bottom:0.85rem;
  transition:border-color 0.25s,box-shadow 0.25s;
}
.popup-card.dark input { background:rgba(255,255,255,0.08) }
.popup-card input:focus { border-color:#00BCD4; box-shadow:0 0 0 4px rgba(0,188,212,0.15) }
.submit-btn {
  width:100% !important; border-radius:12px !important; color:#fff !important;
  padding:clamp(0.82rem,1.5vw,1rem) !important; text-transform:none !important;
  font-family:'DM Sans',sans-serif !important; font-size:clamp(0.92rem,1.5vw,1.05rem) !important;
  font-weight:500 !important; background:linear-gradient(135deg,#0057FF,#00BCD4) !important;
  box-shadow:0 6px 24px rgba(0,87,255,0.4) !important; transition:transform 0.2s,box-shadow 0.2s !important;
}
.submit-btn:hover { transform:translateY(-2px) !important; box-shadow:0 10px 32px rgba(0,87,255,0.55) !important }

/* ── Keyframes ── */
@keyframes fadeUp {
  /* Elements slide up and fade in on load */
  from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) }
}
@keyframes scaleIn {
  /* Popup grows from 88% on open */
  from { opacity:0; transform:scale(0.88) } to { opacity:1; transform:scale(1) }
}

.popup-fade-enter-active, .popup-fade-leave-active { transition:opacity 0.3s ease }
.popup-fade-enter-from,  .popup-fade-leave-to      { opacity:0 }

/* ── Responsive ── */
@media (max-width:540px) {
  .button-group { flex-direction:column; align-items:stretch }
  .cta-btn { width:100% !important; justify-content:center !important; min-width:unset; border-radius:14px !important }
}
@media (max-width:375px) {
  .welcome-container { gap:1.5rem }
  .title { font-size:2.3rem }
  .eyebrow { font-size:0.92rem }
  .subtitle { font-size:0.85rem }
}
@media (min-width:768px) and (max-width:1024px) { .welcome-container { gap:3.5rem } }
@media (min-width:1440px) { .title { font-size:9rem } .welcome-container { gap:5rem } }
</style>