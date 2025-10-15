<template>
  <v-app>
    <v-main class="cv-page">
      <ThemeToggle />
      <v-container class="cv-wrapper" fluid>
        <Sidebar />

        <div class="main-content" ref="cvContent">
          <!-- Download Button -->
          <button class="download-btn" @click="cvData.name ? downloadPDF() : null" :disabled="!cvData.name">
            Download PDF
          </button>

          <header class="cv-header">
            <h1 class="cv-name">{{ cvData.name }}</h1>
            <p class="cv-role">{{ cvData.role }}</p>
          </header>

          <section class="cv-section">
            <h2 class="section-title">Summary</h2>
            <p class="summary">{{ cvData.summary }}</p>
          </section>

          <section class="cv-section">
            <h2 class="section-title">Experience</h2>
            <div class="job" v-for="job in cvData.experience" :key="job.title">
              <h3>{{ job.title }}</h3>
              <span class="date">{{ job.date }}</span>
              <p>{{ job.description }}</p>
            </div>
          </section>

          <section class="cv-section">
            <h2 class="section-title">Education</h2>
            <ul>
              <li v-for="edu in cvData.education" :key="edu.school">
                <strong>{{ edu.school }}</strong> — {{ edu.degree }}
              </li>
            </ul>
          </section>

          <section class="cv-section">
            <h2 class="section-title">Tech & Skills</h2>
            <div class="stack">
              <div>
                <h3>Languages</h3>
                <ul><li v-for="lang in cvData.skills.languages" :key="lang">{{ lang }}</li></ul>
              </div>
              <div>
                <h3>Frameworks & Tools</h3>
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
import { ref, nextTick } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { useCV } from '~/composables/useCV'

const { cvData } = useCV()
const cvContent = ref(null)

const downloadPDF = async () => {
  if (process.client && cvData.value) {
    const { jsPDF } = await import('jspdf')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    let y = 20

    // ---------------- Theme-based Background ----------------
    const currentTheme = localStorage.getItem('theme') || 'light'
    const darkTheme = currentTheme === 'dark'

    // Light mode: headings dark orange, dates slightly dark gray
    // Dark mode: headings orange, dates light gray, background dark
    const bgColor = darkTheme ? '#333333' : '#F5F5F5'
    const headingColor = darkTheme ? '#E78F0A' : '#D2691E'  // Dark orange for light mode
    const dateColor = darkTheme ? '#DDDDDD' : '#555555'      // Slightly dark gray for light mode
    const textColor = darkTheme ? '#FFFFFF' : '#1E1E1E'

    pdf.setFillColor(bgColor)
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')

    // ---------------- Header ----------------
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(22)
    pdf.setTextColor(headingColor)
    pdf.text(cvData.value.name, pageWidth / 2, y, { align: 'center' })

    y += 10
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(16)
    pdf.setTextColor(textColor)
    pdf.text(cvData.value.role, pageWidth / 2, y, { align: 'center' })

    y += 15
    pdf.setDrawColor(darkTheme ? 255 : 200)
    pdf.setLineWidth(0.5)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 10

    // ---------------- Summary ----------------
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(headingColor)
    pdf.text('Summary', margin, y)
    y += 6
    pdf.setDrawColor(darkTheme ? 100 : 200)
    pdf.setLineWidth(0.3)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 5

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(13) // bigger summary font
    pdf.setTextColor(textColor)
    const summaryLines = pdf.splitTextToSize(cvData.value.summary, pageWidth - 2 * margin)
    pdf.text(summaryLines, margin, y)
    y += summaryLines.length * 6 + 5 // more spacing

    // ---------------- Experience ----------------
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(headingColor)
    pdf.text('Experience', margin, y)
    y += 6
    pdf.setDrawColor(darkTheme ? 100 : 200)
    pdf.setLineWidth(0.3)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 5

    cvData.value.experience.forEach(job => {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(textColor)
      pdf.text(job.title, margin, y)

      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(10)
      pdf.setTextColor(dateColor)
      pdf.text(job.date, pageWidth - margin, y, { align: 'right' })

      y += 6
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(11)
      pdf.setTextColor(textColor)
      const descLines = pdf.splitTextToSize(job.description, pageWidth - 2 * margin)
      pdf.text(descLines, margin, y)
      y += descLines.length * 6 + 6
    })

    // ---------------- Education ----------------
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(headingColor)
    pdf.text('Education', margin, y)
    y += 6
    pdf.setDrawColor(darkTheme ? 100 : 200)
    pdf.setLineWidth(0.3)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 5

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(textColor)
    cvData.value.education.forEach(edu => {
      pdf.text(`${edu.school} — ${edu.degree}`, margin, y)
      y += 6
    })
    y += 8

    // ---------------- Skills ----------------
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(headingColor)
    pdf.text('Skills', margin, y)
    y += 6
    pdf.setDrawColor(darkTheme ? 100 : 200)
    pdf.setLineWidth(0.3)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 5

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(textColor)
    const skillCategories = [
      { title: 'Languages', items: cvData.value.skills.languages },
      { title: 'Frameworks & Tools', items: cvData.value.skills.frameworks },
      { title: 'Professional Skills', items: cvData.value.skills.professional },
    ]
    skillCategories.forEach(cat => {
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(headingColor)
      pdf.text(cat.title, margin, y)
      y += 5
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(textColor)
      const line = pdf.splitTextToSize(cat.items.join(', '), pageWidth - 2 * margin)
      pdf.text(line, margin, y)
      y += line.length * 6 + 6
    })

    pdf.save(`${cvData.value.name}-CV.pdf`)
  }
}


</script>



<style scoped>
/* ----------------- Layout ----------------- */
.cv-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  padding-top: 2rem;
  overflow: hidden;
  position: relative;
}

/* Download Button */
.download-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #137CB5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
  z-index: 10;
}
.download-btn:hover {
  background-color: #13AEFB;
}

/* Main content */
.main-content {
  margin-left: clamp(220px, 20%, 300px);
  flex: 1;
  padding: 1.5rem 2rem;
  text-align: left;
  overflow: hidden;
  position: relative;
}

/* CV Styles */
.cv-page {
  background: var(--v-theme-background);
  color: var(--v-theme-surface);
  font-family: 'Inter', 'Roboto', sans-serif;
  min-height: 100vh;
}

/* Sections & Typography */
.cv-header { text-align: center; margin-bottom: 1rem; }
.cv-name { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #E78F0A; }
.cv-role { font-size: 1.5rem; color: #13AEFB; font-weight: 500; }

.cv-section { margin-bottom: 1.2rem; }
.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #E78F0A;
  margin-bottom: 0.6rem;
  border-bottom: 2px solid rgba(231, 143, 10, 0.4);
  padding-bottom: 0.2rem;
}

.job { margin-bottom: 1rem; }
.job h3 { font-size: 1.05rem; font-weight: 600; }
.date { font-size: 0.85rem; color: gray; display: block; margin-bottom: 0.2rem; }

.summary { font-size: 0.95rem; line-height: 1.5; text-align: justify; }

.skills, .cv-section ul { list-style: none; padding: 0; margin: 0; }
.skills li, .cv-section ul li { margin-bottom: 0.4rem; font-size: 0.95rem; }

.stack { display: flex; flex-wrap: wrap; gap: 1.2rem; }
.stack > div { flex: 1; min-width: 180px; }
.stack h3 { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.3rem; }
.stack ul { padding-left: 1rem; }

/* ---------------- Responsive ---------------- */
@media (max-width: 768px) {
  .cv-wrapper { flex-direction: column; }
  .main-content { margin-left: 0; padding: 1rem; padding-bottom: 90px; }
  .download-btn { top: 0.5rem; right: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.85rem; }
}
@media (min-width: 600px) and (max-width: 1050px) {
  .cv-name { font-size: 2.2rem; }
  .cv-role { font-size: 1rem; }
  .section-title { font-size: 1.25rem; margin-bottom: 0.5rem; }
  .summary, .skills li, .cv-section ul li { font-size: 0.9rem; line-height: 1.4; }
  .job h3 { font-size: 1rem; }
  .date { font-size: 0.8rem; margin-bottom: 0.15rem; }
  .stack > div { min-width: 160px; gap: 1rem; }
  .stack h3 { font-size: 1rem; margin-bottom: 0.25rem; }
}
@media (min-width: 769px) and (max-width: 1280px) {
  .cv-name { font-size: 2.5rem; }
  .cv-role { font-size: 1.05rem; }
  .section-title { font-size: 1.4rem; }
  .summary, .skills li, .cv-section ul li { font-size: 1rem; line-height: 1.6; }
  .stack > div { min-width: 200px; }
}
@media (min-width: 1024px) and (max-width: 1280px) {
  .cv-name { font-size: 2.4rem; }
  .cv-role { font-size: 1rem; }
  .section-title { font-size: 1.3rem; margin-bottom: 0.5rem; }
  .job h3 { font-size: 1.05rem; }
  .date { font-size: 0.85rem; margin-bottom: 0.2rem; }
  .summary, .skills li, .cv-section ul li { font-size: 0.95rem; line-height: 1.45; }
  .stack > div { min-width: 180px; gap: 1rem; }
  .stack h3 { font-size: 1rem; margin-bottom: 0.25rem; }
}
@media (min-width: 1281px) {
  .cv-name { font-size: 2.8rem; }
  .cv-role { font-size: 1.1rem; }
  .section-title { font-size: 1.5rem; }
  .summary, .skills li, .cv-section ul li { font-size: 1.15rem; line-height: 1.7; }
  .stack > div { min-width: 210px; }
}
@media (min-width: 1601px) {
  .cv-name { font-size: 3rem; }
  .cv-role { font-size: 1.2rem; }
  .section-title { font-size: 1.6rem; }
  .summary, .skills li, .cv-section ul li { font-size: 1.25rem; line-height: 1.8; }
  .stack > div { min-width: 220px; }
}
</style>
