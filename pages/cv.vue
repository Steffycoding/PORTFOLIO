<template>
  <v-app>
    <v-main class="cv-page">
      <!-- Reusable animated background -->
      <BackgroundCanvas />

      <!-- isolation: isolate prevents canvas blur bleeding into toggle -->
      <div class="toggle-wrapper">
        <ThemeToggle />
      </div>

      <v-container class="cv-wrapper" fluid>
        <Sidebar />

        <div class="main-content" ref="cvContent">
          <!-- Download Button -->
          <button class="download-btn" @click="cvData.name ? downloadPDF() : null" :disabled="!cvData.name">
            ↓ Download CV
          </button>

          <!-- CV Header -->
          <header class="cv-header">
            <h1 class="cv-name">{{ cvData.name }}</h1>
            <p class="cv-role">{{ cvData.role }}</p>
          </header>

          <!-- Summary -->
          <section class="cv-section">
            <h2 class="section-title">Summary</h2>
            <p class="summary">{{ cvData.summary }}</p>
          </section>

          <!-- Experience -->
          <section class="cv-section">
            <h2 class="section-title">Experience</h2>
            <div class="job" v-for="job in cvData.experience" :key="job.title">
              <div class="job-header">
                <h3>{{ job.title }}</h3>
                <span class="date">{{ job.date }}</span>
              </div>
              <p>{{ job.description }}</p>
            </div>
          </section>

          <!-- Education -->
          <section class="cv-section">
            <h2 class="section-title">Education</h2>
            <ul>
              <li v-for="edu in cvData.education" :key="edu.school">
                <strong>{{ edu.school }}</strong> — {{ edu.degree }}
              </li>
            </ul>
          </section>

          <!-- Skills -->
          <section class="cv-section">
            <h2 class="section-title">Tech &amp; Skills</h2>
            <div class="stack">
              <div>
                <h3>Languages</h3>
                <ul><li v-for="lang in cvData.skills.languages" :key="lang">{{ lang }}</li></ul>
              </div>
              <div>
                <h3>Frameworks &amp; Tools</h3>
                <ul><li v-for="fw in cvData.skills.frameworks" :key="fw">{{ fw }}</li></ul>
              </div>
              <div>
                <h3>Professional Skills</h3>
                <ul><li v-for="skill in cvData.skills.professional" :key="skill">{{ skill }}</li></ul>
              </div>
            </div>
          </section>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import BackgroundCanvas from '~/components/BackgroundCanvas.vue'
import { useCV } from '~/composables/useCV'

const { cvData } = useCV()
const cvContent = ref(null)

const downloadPDF = async () => {
  if (!process.client || !cvData.value) return

  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pw = pdf.internal.pageSize.getWidth()   // page width
  const ph = pdf.internal.pageSize.getHeight()  // page height
  const mg = 16                                  // margin
  const cw = pw - mg * 2                        // content width
  let y = 0

  // ── Two clean palettes — dark feels professional, light stays crisp ──
  const dark = (localStorage.getItem('theme') || 'light') === 'dark'
  const c = {
    bg:     dark ? '#161622' : '#FFFFFF',
    accent: dark ? '#E78F0A' : '#B86E00',   // amber only for name + section titles
    text:   dark ? '#DDE1EC' : '#1C1C2E',   // main body text
    muted:  dark ? '#7A839A' : '#888899',   // dates, hints
    rule:   dark ? '#2D2D45' : '#E2E4EC',   // section dividers
  }

  // ── Helper: new page when running out of space ──
  const checkPage = (needed = 12) => {
    if (y + needed > ph - mg) {
      pdf.addPage()
      pdf.setFillColor(c.bg); pdf.rect(0, 0, pw, ph, 'F')
      // Repeat left stripe on new pages
      pdf.setFillColor(c.accent); pdf.rect(0, 0, 2.5, ph, 'F')
      y = mg + 8
    }
  }

  // ── Background ──
  pdf.setFillColor(c.bg); pdf.rect(0, 0, pw, ph, 'F')

  // ── Slim left accent bar ──
  pdf.setFillColor(c.accent); pdf.rect(0, 0, 2.5, ph, 'F')

  // ── Header — generous top space, name large, role smaller ──
  y = 22
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20)
  pdf.setTextColor(c.accent)
  pdf.text(cvData.value.name || '', pw / 2, y, { align: 'center' })

  y += 9
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11)
  pdf.setTextColor(c.muted)
  pdf.text(cvData.value.role || '', pw / 2, y, { align: 'center' })

  // Single thin rule below header
  y += 8
  pdf.setDrawColor(c.rule); pdf.setLineWidth(0.4)
  pdf.line(mg, y, pw - mg, y)

  y += 12 // breathing room before first section

  // ── Section title renderer — minimal: just text + rule ──
  const drawSection = (label) => {
    checkPage(16)
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10)
    pdf.setTextColor(c.accent)
    pdf.text(label.toUpperCase(), mg, y)
    y += 3.5
    pdf.setDrawColor(c.rule); pdf.setLineWidth(0.3)
    pdf.line(mg, y, pw - mg, y)
    y += 6
  }

  // ── Summary ──
  drawSection('Summary')
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(c.text)
  const summaryLines = pdf.splitTextToSize(cvData.value.summary || '', cw)
  checkPage(summaryLines.length * 5.5)
  pdf.text(summaryLines, mg, y)
  y += summaryLines.length * 5.5 + 10

  // ── Experience ──
  drawSection('Experience')
  for (const job of (cvData.value.experience || [])) {
    checkPage(24)
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(c.text)
    pdf.text(job.title || '', mg, y)
    pdf.setFont('helvetica', 'italic'); pdf.setFontSize(9); pdf.setTextColor(c.muted)
    pdf.text(job.date || '', pw - mg, y, { align: 'right' })
    y += 5.5
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5); pdf.setTextColor(c.text)
    const descLines = pdf.splitTextToSize(job.description || '', cw)
    checkPage(descLines.length * 5.2 + 8)
    pdf.text(descLines, mg, y)
    y += descLines.length * 5.2 + 9
  }

  // ── Education ──
  drawSection('Education')
  for (const edu of (cvData.value.education || [])) {
    checkPage(10)
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(c.text)
    pdf.text(edu.school || '', mg, y)
    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(c.muted)
    pdf.text(` — ${edu.degree || ''}`, mg + pdf.getTextWidth(edu.school || ''), y)
    y += 7.5
  }
  y += 5

  // ── Skills — 3 clean columns, no bullet dots ──
  drawSection('Tech & Skills')
  const cats = [
    { title: 'Languages',          items: cvData.value.skills?.languages    || [] },
    { title: 'Frameworks & Tools', items: cvData.value.skills?.frameworks   || [] },
    { title: 'Professional',       items: cvData.value.skills?.professional || [] },
  ]
  const colW = cw / cats.length

  // Column headers in muted colour (not accent — keeps it calm)
  cats.forEach((cat, i) => {
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9.5); pdf.setTextColor(c.muted)
    pdf.text(cat.title, mg + colW * i, y)
  })
  y += 6

  const maxRows = Math.max(...cats.map(ct => ct.items.length))
  for (let row = 0; row < maxRows; row++) {
    checkPage(6)
    cats.forEach((cat, i) => {
      if (cat.items[row]) {
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5); pdf.setTextColor(c.text)
        pdf.text(`· ${cat.items[row]}`, mg + colW * i, y)
      }
    })
    y += 5.5
  }

  // ── Footer — just name, centred, very quiet ──
  pdf.setFont('helvetica', 'italic'); pdf.setFontSize(8); pdf.setTextColor(c.rule)
  pdf.text(`${cvData.value.name || ''} · CV`, pw / 2, ph - 8, { align: 'center' })

  pdf.save(`${cvData.value.name || 'CV'}-CV.pdf`)
}
</script>

<style scoped>
/* ── Page ── */
.cv-page {
  background: var(--v-theme-background);
  color: var(--v-theme-on-surface);
  font-family: 'DM Sans', 'Inter', sans-serif;
  min-height: 100vh; min-height: 100dvh;
}

/* isolate prevents canvas blur bleeding into the toggle icon */
.toggle-wrapper {
  position: fixed;
  top: 1.5vh; left: 1.5vw;
  width: clamp(35px, 5.5vw, 60px);
  z-index: 1100;
  isolation: isolate;
}

/* ── Layout ── */
.cv-wrapper {
  display: flex; flex-direction: row;
  width: 100%; max-width: 1400px;
  margin: 0 auto; flex: 1;
  padding-top: 1.5rem;
  position: relative; z-index: 1;
}

.main-content {
  margin-left: clamp(200px, 20%, 280px);
  flex: 1; padding: 1.2rem 2rem;
  text-align: left; position: relative;
}

/* ── Download button ── */
.download-btn {
  position: absolute; top: 1rem; right: 1rem;
  background: linear-gradient(135deg, #E78F0A, #13AEFB);
  color: #fff; border: none;
  padding: 0.5rem 1.1rem; border-radius: 8px;
  cursor: pointer; font-weight: 600; font-size: 0.88rem;
  letter-spacing: 0.02em; z-index: 10;
  box-shadow: 0 4px 14px rgba(231,143,10,0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.download-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(231,143,10,0.5) }
.download-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none }

/* ── CV Header ── */
.cv-header { text-align: center; margin-bottom: 1rem; padding-top: 0.5rem }
.cv-name {
  font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800;
  color: #E78F0A; margin-bottom: 0.2rem; font-family: 'Syne', sans-serif;
}
.cv-role { font-size: clamp(0.95rem, 1.5vw, 1.15rem); color: #13AEFB; font-weight: 500 }

/* ── Sections ── */
.cv-section { margin-bottom: 1.1rem }
.section-title {
  font-size: clamp(1rem, 1.5vw, 1.25rem); font-weight: 700;
  color: #E78F0A; margin-bottom: 0.5rem;
  border-bottom: 2px solid rgba(231,143,10,0.35);
  padding-bottom: 0.25rem;
}

/* ── Experience ── */
.job { margin-bottom: 0.85rem }
.job-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.25rem }
.job h3 { font-size: clamp(0.9rem, 1.2vw, 1.05rem); font-weight: 600; margin: 0 }
.date { font-size: 0.8rem; color: var(--v-theme-on-surface); opacity: 0.55 }
.job p { font-size: clamp(0.82rem, 1.1vw, 0.95rem); line-height: 1.5; margin: 0.3rem 0 0 }

/* ── Summary & lists ── */
.summary { font-size: clamp(0.85rem, 1.1vw, 0.95rem); line-height: 1.55; text-align: justify }
.cv-section ul { list-style: none; padding: 0; margin: 0 }
.cv-section ul li { margin-bottom: 0.3rem; font-size: clamp(0.82rem, 1.1vw, 0.95rem) }
.cv-section ul li::before { content: '▸'; color: #E78F0A; margin-right: 0.4rem; font-size: 0.7rem }

/* ── Skills grid ── */
.stack { display: flex; flex-wrap: wrap; gap: 1rem }
.stack > div { flex: 1 1 200px; min-width: 0 }
.stack h3 { font-size: 0.95rem; font-weight: 600; color: #13AEFB; margin-bottom: 0.3rem }
.stack ul { padding: 0; margin: 0; list-style: none }

/* ── Responsive ── */
@media (max-width: 768px) {
  .cv-wrapper { flex-direction: column }
  .main-content { margin-left: 0; padding: 1.5rem 1rem 100px }
  .download-btn { position: fixed; top: 0.7rem; right: 0.7rem; font-size: 0.78rem; padding: 0.4rem 0.8rem }
}
@media (max-width: 480px) {
  .cv-name { font-size: 1.4rem } .cv-role { font-size: 0.9rem }
  .stack { flex-direction: column } .stack > div { flex-basis: 100% }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .main-content { margin-left: clamp(180px, 18%, 240px); padding: 1.2rem 1.5rem }
}
@media (min-width: 1440px) {
  .main-content { padding: 1.5rem 3rem }
  .cv-name { font-size: 2.6rem }
}
</style>