<template>
  <v-app>
    <BackgroundCanvas />

    <div class="layout">
      <SidebarAdmin />
      <v-main>
        <div class="toggle-wrapper">
          <ThemeToggle />
        </div>

        <div class="main-content">
          <div class="contact-card">

            <!-- Glowing ring + avatar -->
            <div class="avatar-ring">
              <div class="ring ring-1" />
              <div class="ring ring-2" />
              <div class="ring ring-3" />
              <img :src="profilePic" class="profile-pic" alt="Stephanie Poole" />
            </div>

            <!-- Name + title -->
            <h1 class="name">Stephanie Poole</h1>
            <p class="role">Web Developer &amp; UX/UI Design</p>

            <!-- Divider -->
            <div class="divider" />

            <!-- Contact buttons -->
            <div class="contact-links">
              <a href="https://mail.google.com/mail/?view=cm&to=stephaniepoole2002@gmail.com" target="_blank" rel="noopener noreferrer" class="contact-btn email">
                <span class="btn-icon">✉</span>
                <span class="btn-label">Email Me</span>
              </a>
              <a href="https://www.linkedin.com/in/stephanie-poole-708455250/" target="_blank" rel="noopener noreferrer" class="contact-btn linkedin">
                <span class="btn-icon">in</span>
                <span class="btn-label">LinkedIn</span>
              </a>
              <a href="https://wa.me/27746282617" target="_blank" rel="noopener noreferrer" class="contact-btn whatsapp">
                <span class="btn-icon">💬</span>
                <span class="btn-label">WhatsApp</span>
              </a>
              <a href="https://github.com/Steffycoding" target="_blank" rel="noopener noreferrer" class="contact-btn github">
                <span class="btn-icon">⌥</span>
                <span class="btn-label">GitHub</span>
              </a>
            </div>

          </div>
        </div>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarAdmin from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import BackgroundCanvas from '~/components/BackgroundCanvas.vue'

const profilePic = ref('/images/me.jpg')
</script>

<style scoped>
/* ── ThemeToggle — isolated, never blurred ── */
.toggle-wrapper {
  position: relative;
  z-index: 500;
  isolation: isolate;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ── Main content area — centred in v-main (Vuetify handles sidebar offset) ── */
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1.5rem 2rem 1.5rem 4rem;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateX(-1rem); /* slight left nudge on desktop */
}

/* ══════════════════════════════════════════
   CONTACT CARD
══════════════════════════════════════════ */
.contact-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 2.8rem 2.5rem 2.5rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow:
    0 0 0 1px rgba(19, 174, 251, 0.08),
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  animation: cardIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)     scale(1);    }
}

/* Top accent bar */
.contact-card::before {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: linear-gradient(90deg, transparent, #E78F0A 30%, #13AEFB 70%, transparent);
  opacity: 0.8;
}

/* ══════════════════════════════════════════
   AVATAR
══════════════════════════════════════════ */
.avatar-ring {
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
  animation: spin linear infinite;
}
.ring-1 {
  inset: -10px;
  border-top-color: #E78F0A;
  border-right-color: rgba(231,143,10,0.2);
  animation-duration: 6s;
}
.ring-2 {
  inset: -18px;
  border-bottom-color: #13AEFB;
  border-left-color: rgba(19,174,251,0.2);
  animation-duration: 10s;
  animation-direction: reverse;
}
.ring-3 {
  inset: -26px;
  border-top-color: rgba(231,143,10,0.3);
  border-right-color: rgba(19,174,251,0.15);
  animation-duration: 16s;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255,255,255,0.12);
  box-shadow:
    0 0 0 3px rgba(19,174,251,0.25),
    0 8px 32px rgba(0,0,0,0.5);
  position: relative;
  z-index: 1;
  animation: avatarIn 0.9s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes avatarIn {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}

/* ══════════════════════════════════════════
   NAME & ROLE
══════════════════════════════════════════ */
.name {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0 0 0.3rem 0;
  text-align: center;
  background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.65));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeUp 0.6s 0.35s both;
}

.role {
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #13AEFB;
  margin: 0 0 1.4rem 0;
  text-align: center;
  opacity: 0.9;
  animation: fadeUp 0.6s 0.45s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════════════════════════════════════
   DIVIDER
══════════════════════════════════════════ */
.divider {
  width: 60px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #E78F0A, #13AEFB);
  margin: 0 auto 1.6rem;
  animation: fadeUp 0.6s 0.5s both;
}

/* ══════════════════════════════════════════
   CONTACT BUTTONS
══════════════════════════════════════════ */
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  animation: fadeUp 0.6s 0.55s both;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.85rem 1.4rem;
  border-radius: 0.9rem;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.05);
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, border-color 0.22s ease;
  position: relative;
  overflow: hidden;
}

/* Shimmer sweep on hover */
.contact-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.45s ease;
}
.contact-btn:hover::after { transform: translateX(100%); }

.contact-btn:hover {
  transform: translateY(-2px) scale(1.015);
}

.btn-icon {
  font-size: 1.1rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}
.btn-label { flex: 1; }

/* Individual button colours */
.email {
  border-color: rgba(231,143,10,0.35);
  box-shadow: 0 4px 16px rgba(231,143,10,0.12);
}
.email:hover {
  background: rgba(231,143,10,0.12);
  border-color: rgba(231,143,10,0.6);
  box-shadow: 0 8px 28px rgba(231,143,10,0.28);
}

.linkedin {
  border-color: rgba(19,174,251,0.3);
  box-shadow: 0 4px 16px rgba(19,174,251,0.1);
}
.linkedin .btn-icon {
  font-style: normal;
  font-weight: 900;
  font-family: serif;
}
.linkedin:hover {
  background: rgba(19,174,251,0.1);
  border-color: rgba(19,174,251,0.55);
  box-shadow: 0 8px 28px rgba(19,174,251,0.25);
}

.whatsapp {
  border-color: rgba(37,211,102,0.3);
  box-shadow: 0 4px 16px rgba(37,211,102,0.1);
}
.whatsapp:hover {
  background: rgba(37,211,102,0.1);
  border-color: rgba(37,211,102,0.5);
  box-shadow: 0 8px 28px rgba(37,211,102,0.22);
}

.github {
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.github:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.3);
  box-shadow: 0 8px 28px rgba(255,255,255,0.1);
}

/* ══════════════════════════════════════════
   LIGHT MODE OVERRIDES
══════════════════════════════════════════ */
body.light-mode .contact-card {
  background: rgba(255,255,255,0.6);
  border-color: rgba(0,0,0,0.08);
  box-shadow: 0 24px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
}
body.light-mode .name {
  background: linear-gradient(135deg, #1a1a2e 30%, #444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
body.light-mode .contact-btn {
  color: #1a1a2e;
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.1);
}
body.light-mode .contact-btn:hover { background: rgba(0,0,0,0.06); }

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */

/* Large desktop */
@media (min-width: 1400px) {
  .main-content { padding-left: 5rem; transform: translateX(-1rem); }
  .contact-card { max-width: 500px; padding: 3rem 3rem 2.8rem; }
  .profile-pic  { width: 160px; height: 160px; }
  .avatar-ring  { width: 170px; height: 170px; }
  .name         { font-size: 2.1rem; }
}

/* MacBook / laptop */
@media (max-width: 1399px) and (min-width: 1201px) {
  .main-content { padding-left: 5rem; transform: translateX(-1rem); }
}

/* Tablet landscape */
@media (max-width: 1200px) and (min-width: 769px) {
  .main-content { padding-left: 2rem; transform: translateX(-0.5rem); }
}

/* Tablet portrait / large phone landscape */
@media (max-width: 768px) {
  .main-content {
    padding: 2.5rem 1rem 1.5rem;
    align-items: flex-start;
    justify-content: center;
    transform: translateX(0);
  }
  .contact-card {
    max-width: 380px;
    padding: 1.8rem 1.5rem 1.6rem;
    margin-top: 2rem;
  }
  .avatar-ring  { width: 130px; height: 130px; margin-bottom: 1rem; }
  .profile-pic  { width: 120px; height: 120px; }
  .ring-1       { inset: -8px; }
  .ring-2       { inset: -14px; }
  .ring-3       { inset: -20px; }
  .name         { font-size: 1.55rem; }
  .role         { font-size: 0.75rem; margin-bottom: 1rem; }
  .divider      { margin-bottom: 1.2rem; }
  .contact-links { gap: 0.6rem; }
  .contact-btn  { padding: 0.75rem 1.1rem; font-size: 0.88rem; }
}

/* Standard phones (iPhone 12/13/14, Galaxy S) */
@media (max-width: 480px) {
  .main-content {
    padding: 3.5rem 0.75rem 1rem;
    align-items: flex-start;
    justify-content: center;
    transform: translateX(0);
  }
  .contact-card {
    max-width: 340px;
    width: 100%;
    padding: 1.5rem 1.1rem 1.4rem;
    border-radius: 1.4rem;
    margin-top: 0;
  }
  .avatar-ring  { width: 110px; height: 110px; margin-bottom: 0.9rem; }
  .profile-pic  { width: 100px; height: 100px; }
  .ring-1       { inset: -7px; }
  .ring-2       { inset: -12px; }
  .ring-3       { inset: -17px; }
  .name         { font-size: 1.3rem; margin-bottom: 0.2rem; }
  .role         { font-size: 0.68rem; letter-spacing: 0.12em; margin-bottom: 0.9rem; }
  .divider      { margin-bottom: 1rem; width: 44px; }
  .contact-links { gap: 0.5rem; }
  .contact-btn  { padding: 0.7rem 1rem; font-size: 0.82rem; gap: 0.7rem; border-radius: 0.75rem; }
  .btn-icon     { font-size: 1rem; width: 22px; }
}

/* Small phones — iPhone SE, Galaxy A03 */
@media (max-width: 375px) {
  .main-content {
    padding-top: 3rem;
    transform: translateX(0);
  }
  .contact-card { padding: 1.3rem 0.9rem 1.2rem; }
  .avatar-ring  { width: 95px; height: 95px; }
  .profile-pic  { width: 86px; height: 86px; }
  .ring-1       { inset: -6px; }
  .ring-2       { inset: -11px; }
  .ring-3       { inset: -15px; }
  .name         { font-size: 1.2rem; }
  .contact-btn  { padding: 0.6rem 0.85rem; font-size: 0.78rem; }
}

/* iPhone 12/13/14 Pro — 390×844 */
@media (device-width: 390px) and (device-height: 844px) {
  .main-content { padding-top: 3.5rem; transform: translateX(0); }
  .contact-card { max-width: 340px; padding: 1.5rem 1.1rem; }
  .profile-pic  { width: 100px; height: 100px; }
  .avatar-ring  { width: 110px; height: 110px; }
}

/* iPhone 14 Plus / Pro Max — 428×926 */
@media (device-width: 428px) and (device-height: 926px) {
  .main-content { padding-top: 3.5rem; transform: translateX(0); }
  .contact-card { max-width: 360px; padding: 1.6rem 1.2rem; }
  .profile-pic  { width: 108px; height: 108px; }
  .avatar-ring  { width: 118px; height: 118px; }
}

/* iPad portrait */
@media (device-width: 768px) and (device-height: 1024px),
       (device-width: 834px) and (device-height: 1112px),
       (device-width: 820px) and (device-height: 1180px) {
  .main-content { padding-left: 1.5rem; align-items: center; transform: translateX(0); }
  .contact-card { max-width: 440px; }
}

/* Surface Pro landscape */
@media (width: 1024px) and (height: 600px) {
  .main-content { padding-left: 2rem; align-items: center; transform: translateX(-1.5rem); }
  .contact-card { max-width: 400px; padding: 1.8rem 1.6rem; }
  .avatar-ring  { width: 120px; height: 120px; margin-bottom: 0.9rem; }
  .profile-pic  { width: 110px; height: 110px; }
}
</style>