<template>
  <div class="sidebar">

    <!-- Monogram -->
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

    <!-- Footer accent -->
    <div class="sidebar-footer">
      <div class="footer-line" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '../composables/UseSidebar'
const { links } = useSidebar()
</script>

<style scoped>
/* ══════════════════════════════════════════
   SIDEBAR SHELL
══════════════════════════════════════════ */
.sidebar {
  width: clamp(160px, 15%, 220px);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2rem 1rem 1.5rem;
  box-sizing: border-box;

  background: rgba(8, 14, 26, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid rgba(255, 255, 255, 0.055);
  box-shadow:
    4px 0 40px rgba(0, 0, 0, 0.45),
    inset -1px 0 0 rgba(19, 174, 251, 0.07);
}

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
  margin: 0 auto 2.2rem;
  flex-shrink: 0;
}

.logo-text {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #E78F0A 30%, #13AEFB);
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
  border-top-color: #E78F0A;
  border-right-color: rgba(231, 143, 10, 0.15);
  animation: logoSpin 7s linear infinite;
}

@keyframes logoSpin {
  to { transform: rotate(360deg); }
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

/* ══════════════════════════════════════════
   BUTTONS
══════════════════════════════════════════ */
.sidebar-btn {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.65rem 0.85rem;
  border-radius: 0.7rem;
  text-decoration: none;
  overflow: hidden;

  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);

  background: transparent;
  border: 1px solid transparent;
  transition: color 0.22s ease, background 0.22s ease,
              border-color 0.22s ease, transform 0.18s ease;
}

/* Left accent bar */
.sidebar-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 22%;
  bottom: 22%;
  width: 2px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(180deg, #E78F0A, #13AEFB);
  opacity: 0;
  transform: scaleY(0);
  transition: opacity 0.22s ease, transform 0.22s ease;
}

/* Shimmer sweep */
.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(19, 174, 251, 0.07) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.5s ease;
  pointer-events: none;
}
.sidebar-btn:hover .btn-glow { transform: translateX(100%); }

/* ── Hover ── */
.sidebar-btn:hover {
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.06);
  transform: translateX(3px);
}
.sidebar-btn:hover::before {
  opacity: 0.55;
  transform: scaleY(1);
}

/* ── Active ── */
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
.sidebar-btn.active::before {
  opacity: 1;
  transform: scaleY(1);
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
.sidebar-footer {
  padding-top: 1.2rem;
  flex-shrink: 0;
}

.footer-line {
  height: 1.5px;
  border-radius: 1px;
  background: linear-gradient(90deg, #E78F0A, #13AEFB);
  opacity: 0.3;
}

/* ══════════════════════════════════════════
   LIGHT MODE
══════════════════════════════════════════ */
body.light-mode .sidebar {
  background: rgba(240, 245, 255, 0.78);
  border-right-color: rgba(0, 0, 0, 0.06);
  box-shadow: 4px 0 40px rgba(0, 0, 0, 0.08),
              inset -1px 0 0 rgba(19, 174, 251, 0.1);
}
body.light-mode .sidebar-btn        { color: rgba(15, 25, 45, 0.45); }
body.light-mode .sidebar-btn:hover  { color: rgba(15, 25, 45, 0.88);
                                       background: rgba(0, 0, 0, 0.04); }
body.light-mode .sidebar-btn.active { color: #0a1828;
                                       background: rgba(19, 174, 251, 0.09);
                                       border-color: rgba(19, 174, 251, 0.2); }

/* ══════════════════════════════════════════
   TABLET (769px – 1100px) — slim rail
══════════════════════════════════════════ */
@media (min-width: 769px) and (max-width: 1100px) {
  .sidebar {
    width: 140px;
    padding: 1.8rem 0.75rem 1.2rem;
  }
  .sidebar-logo { margin-bottom: 1.8rem; }
  .sidebar-nav  { gap: 0.25rem; }
  .sidebar-btn  { font-size: 0.68rem; padding: 0.6rem 0.7rem; }
}

/* ══════════════════════════════════════════
   LAPTOP (1101px – 1399px)
══════════════════════════════════════════ */
@media (min-width: 1101px) and (max-width: 1399px) {
  .sidebar     { width: 185px; padding: 2rem 1rem 1.5rem; }
  .sidebar-nav { gap: 0.3rem; }
  .sidebar-btn { font-size: 0.73rem; }
}

/* ══════════════════════════════════════════
   LARGE DESKTOP (≥ 1400px)
══════════════════════════════════════════ */
@media (min-width: 1400px) {
  .sidebar      { width: 220px; padding: 2.5rem 1.2rem 1.75rem; }
  .sidebar-nav  { gap: 0.4rem; }
  .sidebar-btn  { font-size: 0.8rem; padding: 0.75rem 1rem; }
  .sidebar-logo { width: 50px; height: 50px; margin-bottom: 2.5rem; }
  .logo-text    { font-size: 1.05rem; }
}

/* ══════════════════════════════════════════
   MOBILE (≤ 768px) — bottom tab bar
══════════════════════════════════════════ */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    padding: 0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom));
    flex-direction: row;
    align-items: center;

    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 1rem 1rem 0 0;
    box-shadow:
      0 -6px 32px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(19, 174, 251, 0.09);
  }

  .sidebar-logo   { display: none; }
  .sidebar-footer { display: none; }

  .sidebar-nav {
    flex-direction: row;
    flex: 1;
    gap: 0.2rem;
    justify-content: space-around;
    align-items: center;
  }

  .sidebar-btn {
    flex: 1;
    justify-content: center;
    padding: 0.45rem 0.2rem;
    border-radius: 0.6rem;
    font-size: 0.58rem;
    letter-spacing: 0.05em;
    text-transform: capitalize;
    transform: none !important;
  }

  .sidebar-btn::before { display: none; }

  .sidebar-btn:hover {
    transform: none !important;
    background: rgba(255, 255, 255, 0.05);
  }

  .sidebar-btn.active {
    background: rgba(19, 174, 251, 0.13);
    border-color: rgba(19, 174, 251, 0.2);
    color: #fff;
    box-shadow: 0 0 14px rgba(19, 174, 251, 0.15);
    transform: none !important;
  }

  body.light-mode .sidebar {
    border-top-color: rgba(0, 0, 0, 0.07);
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
  }
}

/* ══════════════════════════════════════════
   SMALL PHONES (≤ 375px)
══════════════════════════════════════════ */
@media (max-width: 375px) {
  .sidebar-btn { font-size: 0.5rem; padding: 0.4rem 0.1rem; }
}
</style>