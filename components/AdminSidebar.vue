<template>
  <div>
    <!-- Sidebar toggle — desktop/tablet only -->
    <button
      v-if="!isMobile"
      class="sidebar-toggle"
      @click="expanded = !expanded"
      :class="{ open: expanded }"
      :aria-label="expanded ? 'Close sidebar' : 'Open sidebar'"
    >
      <span class="toggle-bar" />
      <span class="toggle-bar" />
      <span class="toggle-bar" />
    </button>

    <!-- Sidebar — desktop/tablet slide panel -->
    <Transition name="sidebar-slide">
      <aside v-if="!isMobile && expanded" class="sidebar">

        <div class="sidebar-logo">
          <span class="logo-text">SP</span>
          <div class="logo-ring" />
        </div>

        <nav class="sidebar-nav">
          <router-link
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="sidebar-btn"
            :class="{ active: $route.path === link.path }"
          >
            <span class="btn-label">{{ link.name }}</span>
            <span class="btn-glow" />
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <div class="footer-line" />
        </div>

      </aside>
    </Transition>

    <!-- Backdrop — desktop/tablet only -->
    <Transition name="fade">
      <div v-if="!isMobile && expanded" class="sidebar-backdrop" @click="expanded = false" />
    </Transition>

    <!-- Bottom nav — mobile only, always visible -->
    <nav v-if="isMobile" class="bottom-nav">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="bottom-nav-btn"
        :class="{ active: $route.path === link.path }"
      >
        <span class="bottom-btn-label">{{ link.name }}</span>
        <span class="bottom-active-bar" />
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAdminSidebar } from '../composables/useAdminSidebar'

const { links } = useAdminSidebar()

const expanded = ref(true)

const isMobile = ref(false)
const checkMobile = () => { isMobile.value = window.innerWidth <= 768 }
onMounted(() => { checkMobile(); window.addEventListener('resize', checkMobile) })
onUnmounted(() => { window.removeEventListener('resize', checkMobile) })
</script>

<style scoped>
/* ══════════════════════════════════════════
   TOGGLE BUTTON — desktop / tablet only
══════════════════════════════════════════ */
.sidebar-toggle {
  position: fixed;
  top: 1rem;
  margin-left: -3rem;
  z-index: 700;
  width: 38px;
  height: 38px;
  border-radius: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(8, 14, 26, 0.7);
  backdrop-filter: blur(12px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0;
  transition: background 0.2s, border-color 0.2s, transform 0.18s;
}
.sidebar-toggle:hover {
  background: rgba(19, 174, 251, 0.12);
  border-color: rgba(19, 174, 251, 0.3);
  transform: scale(1.06);
}

.toggle-bar {
  display: block;
  width: 16px;
  height: 1.5px;
  border-radius: 2px;
  background: #13AEFB;
  transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  transform-origin: center;
}

.sidebar-toggle.open .toggle-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.sidebar-toggle.open .toggle-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.sidebar-toggle.open .toggle-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ══════════════════════════════════════════
   SIDEBAR SHELL — desktop / tablet
══════════════════════════════════════════ */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: clamp(200px, 18vw, 240px);
  z-index: 650;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 4.5rem 1rem 1.5rem;
  box-sizing: border-box;
  background: rgba(8, 14, 26, 0.82);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    6px 0 48px rgba(0, 0, 0, 0.5),
    inset -1px 0 0 rgba(19, 174, 251, 0.08);
}

.sidebar-slide-enter-active { transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease; }
.sidebar-slide-leave-active { transition: transform 0.46s cubic-bezier(0.65, 0, 0.78, 0.1), opacity 0.38s ease; }
.sidebar-slide-enter-from,
.sidebar-slide-leave-to { transform: translateX(-100%); opacity: 0; }

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 640;
  background: rgba(0, 0, 0, 0.35);
}
.fade-enter-active { transition: opacity 0.38s ease; }
.fade-leave-active { transition: opacity 0.32s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════
   MONOGRAM
══════════════════════════════════════════ */
.sidebar-logo {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  flex-shrink: 0;
}
.logo-text {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #137fbe 30%, #2fbaff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
}
.logo-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: #c77700;
  border-right-color: rgba(255, 153, 0, 0.489);
  animation: logoSpin 7s linear infinite;
}
@keyframes logoSpin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════════
   SIDEBAR NAV — desktop / tablet
══════════════════════════════════════════ */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.sidebar-btn {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.68rem 0.9rem;
  border-radius: 0.7rem;
  text-decoration: none;
  overflow: hidden;
  font-family: 'Georgia', serif;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
  background: transparent;
  border: 1px solid transparent;
  transition: color 0.22s, background 0.22s, border-color 0.22s, transform 0.18s;
}
.sidebar-btn::before {
  content: '';
  position: absolute;
  left: 0; top: 22%; bottom: 22%;
  width: 2px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, #E78F0A, #13AEFB);
  opacity: 0;
  transform: scaleY(0);
  transition: opacity 0.22s, transform 0.22s;
}
.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(19, 174, 251, 0.07) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
  pointer-events: none;
}
.sidebar-btn:hover .btn-glow { transform: translateX(100%); }
.sidebar-btn:hover {
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.06);
  transform: translateX(3px);
}
.sidebar-btn:hover::before { opacity: 0.55; transform: scaleY(1); }
.sidebar-btn.active {
  color: #fff;
  background: rgba(19, 174, 251, 0.1);
  border-color: rgba(19, 174, 251, 0.18);
  box-shadow:
    0 0 0 1px rgba(19, 174, 251, 0.08),
    0 4px 18px rgba(19, 174, 251, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transform: translateX(3px);
}
.sidebar-btn.active::before { opacity: 1; transform: scaleY(1); }

/* ══════════════════════════════════════════
   FOOTER LINE
══════════════════════════════════════════ */
.sidebar-footer { padding-top: 1.2rem; flex-shrink: 0; }
.footer-line {
  height: 1.5px;
  border-radius: 1px;
  background: linear-gradient(90deg, #E78F0A, #13AEFB);
  opacity: 0.3;
}

/* ══════════════════════════════════════════
   BOTTOM NAV — mobile only
══════════════════════════════════════════ */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 700;
  height: 60px;
  display: flex;
  align-items: stretch;
  background: rgba(8, 14, 26, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 -4px 32px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(19, 174, 251, 0.08);
}

.bottom-nav-btn {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: 'Georgia', serif;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
  transition: color 0.22s, background 0.22s;
  overflow: hidden;
}

/* Shimmer on tap */
.bottom-nav-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 120%, rgba(19, 174, 251, 0.12) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.bottom-nav-btn:hover::after,
.bottom-nav-btn.active::after { opacity: 1; }

/* Active indicator bar at the top edge */
.bottom-active-bar {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 2px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, #E78F0A, #13AEFB);
  opacity: 0;
  transform: scaleX(0);
  transition: opacity 0.22s, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bottom-nav-btn.active {
  color: #fff;
}
.bottom-nav-btn.active .bottom-active-bar {
  opacity: 1;
  transform: scaleX(1);
}

/* Dividers between tabs */
.bottom-nav-btn + .bottom-nav-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 1px;
  background: rgba(255, 255, 255, 0.06);
}

/* ══════════════════════════════════════════
   LIGHT MODE
══════════════════════════════════════════ */
body.light-mode .sidebar-toggle {
  background: transparent;
  border-color: rgb(167, 167, 167);
}
body.light-mode .toggle-bar {
  background: #c94a00;
}
body.light-mode .sidebar {
  background: rgba(183, 184, 186, 0.92);
  border-right-color: rgba(0, 0, 0, 0.06);
  box-shadow: 6px 0 48px rgba(0, 0, 0, 0.1), inset -1px 0 0 rgba(19, 174, 251, 0.1);
}
body.light-mode .sidebar-btn        { color: rgba(15, 25, 45, 0.45); }
body.light-mode .sidebar-btn:hover  { color: rgba(15, 25, 45, 0.88); background: rgba(0, 0, 0, 0.04); }
body.light-mode .sidebar-btn.active { color: #0a1828; background: rgba(19, 174, 251, 0.09); border-color: rgba(19, 174, 251, 0.2); }
body.light-mode .sidebar-backdrop   { background: rgba(0, 0, 0, 0.2); }

body.light-mode .bottom-nav {
  background: rgba(220, 221, 224, 0.96);
  border-top-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(19, 174, 251, 0.1);
}
body.light-mode .bottom-nav-btn        { color: rgba(15, 25, 45, 0.4); }
body.light-mode .bottom-nav-btn.active { color: #0a1828; }
body.light-mode .bottom-nav-btn + .bottom-nav-btn::before { background: rgba(0, 0, 0, 0.08); }

/* ══════════════════════════════════════════
   TABLET (769px – 1100px)
══════════════════════════════════════════ */
@media (min-width: 769px) and (max-width: 1100px) {
  .sidebar { width: 200px; }
  .sidebar-btn { font-size: 0.68rem; }
  .sidebar-toggle { left: calc(200px - 19px); }
}

/* ══════════════════════════════════════════
   LAPTOP (1101px – 1399px)
══════════════════════════════════════════ */
@media (min-width: 1101px) and (max-width: 1399px) {
  .sidebar { width: 220px; }
  .sidebar-btn { font-size: 0.73rem; }
  .sidebar-toggle { left: calc(220px - 19px); }
}

/* ══════════════════════════════════════════
   LARGE DESKTOP (≥ 1400px)
══════════════════════════════════════════ */
@media (min-width: 1400px) {
  .sidebar { width: 240px; padding: 5rem 1.2rem 1.75rem; }
  .sidebar-btn { font-size: 0.8rem; padding: 0.75rem 1rem; }
  .sidebar-logo { width: 50px; height: 50px; }
  .logo-text { font-size: 1.05rem; }
  .sidebar-toggle { left: calc(240px - 19px); }
}

/* ══════════════════════════════════════════
   MOBILE (≤ 768px)
   sidebar/toggle/backdrop hidden — bottom nav takes over
══════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Ensure page content doesn't hide behind the bottom bar */
  :global(#app),
  :global(main),
  :global(.v-main) {
    padding-bottom: 60px !important;
  }
}

@media (max-width: 375px) {
  .bottom-nav { height: 56px; }
  .bottom-nav-btn { font-size: 0.55rem; letter-spacing: 0.06em; }
}
</style>