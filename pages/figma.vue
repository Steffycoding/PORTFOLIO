<template>
  <v-app>
    <BackgroundCanvas />

    <div class="layout">
      <Sidebar />
      <v-main>
        <div class="toggle-wrapper">
          <ThemeToggle />
        </div>

        <v-container class="figma-page" fluid>
          <div class="page-inner">
            <h1 class="page-title">My Figma Projects</h1>

            <!-- Figma API status -->
            <p v-if="apiError" class="api-note">⚠️ Could not reach Figma API — showing saved projects.</p>
            <p v-if="loading" class="api-note">Syncing with Figma…</p>

            <!-- Pagination -->
            <div class="pagination-controls">
              <button :disabled="page === 1" @click="prevPage" class="page-btn">← Prev</button>
              <span>{{ filteredProjects.length }} Projects | Page {{ page }} of {{ totalPages }}</span>
              <button :disabled="page === totalPages" @click="nextPage" class="page-btn">Next →</button>
            </div>

            <!-- Projects Grid -->
            <div class="projects-wrapper">
              <div
                v-for="project in pagedProjects"
                :key="project.id"
                class="project-card"
              >
                <!-- Figma thumbnail if available -->
                <img
                  v-if="project.thumbnail"
                  :src="project.thumbnail"
                  class="card-thumb"
                  alt="preview"
                />
                <h3 class="project-title">{{ project.title }}</h3>
                <div class="card-buttons">
                  <a v-if="project.demoLink" :href="project.demoLink" target="_blank">
                    <button class="demo-btn">Demo</button>
                  </a>
                  <a :href="project.url" target="_blank">
                    <button class="figma-btn">View on Figma</button>
                  </a>
                  <button class="open-btn" @click="openProject(project)">Details</button>
                </div>
              </div>
            </div>
          </div>
        </v-container>

        <!-- Project Modal -->
        <v-dialog v-model="dialogOpen" persistent max-width="600px">
          <div v-if="selectedProject" class="project-details-snippet">
            <button class="modal-close-btn" @click="closeProject">✕</button>
            <h2>{{ selectedProject.title }}</h2>
            <p class="modal-desc">{{ selectedProject.description }}</p>
            <div class="modal-buttons">
              <a v-if="selectedProject.demoLink" :href="selectedProject.demoLink" target="_blank">
                <button class="demo-btn">Demo</button>
              </a>
              <a :href="selectedProject.url" target="_blank">
                <button class="figma-btn">View on Figma</button>
              </a>
            </div>
          </div>
        </v-dialog>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import BackgroundCanvas from '~/components/BackgroundCanvas.vue'

// ─────────────────────────────────────────────────────────────
//  FIGMA CONFIGURATION
//  1. Go to Figma → Account Settings → Personal Access Tokens
//  2. Generate a token and add it to your .env file:
//       FIGMA_TOKEN=figd_xxxxxxxxxxxx
//  3. In nuxt.config.ts add:
//       runtimeConfig: { public: { figmaToken: process.env.FIGMA_TOKEN } }
//
//  ADD YOUR FILE KEYS HERE — the part after figma.com/file/ in the URL:
// ─────────────────────────────────────────────────────────────
const FIGMA_FILE_KEYS: Record<string, { demoLink: string; description: string }> = {
  'DBe36SHjmtbGjWYwbRVG9z': {
    demoLink: 'https://www.figma.com/proto/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=44-96&t=rZniJju5N9CC2x0v-1',
    description: 'Personal Figma challenge with radio buttons, states and interactions.'
  },
  'A4PmhKFDdS9Tpii5rLKVtj': {
    demoLink: 'https://www.figma.com/proto/A4PmhKFDdS9Tpii5rLKVtj/PORTFOLIO?node-id=3-2427&t=QIWQgaVzCO2GvNja-1',
    description: 'My personal portfolio website with journey, skill and CV.'
  },
  'NaafbKg3avFQjTyikCIUdW': {
    demoLink: 'https://www.figma.com/proto/NaafbKg3avFQjTyikCIUdW/Doppies-in-lyn?node-id=246-3643&t=hVYTq8Yk7NAe9qQb-1',
    description: 'A fun game where players use bottle caps on a grid — strategy and colour rules apply.'
  }
}

// Fallback projects (shown if Figma API is unavailable)
const FALLBACK_PROJECTS = [
  {
    id: '1',
    title: 'FIGMA CHALLENGES',
    description: 'Personal Figma challenge with radio buttons, states and interactions.',
    demoLink: 'https://www.figma.com/proto/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=44-96&t=rZniJju5N9CC2x0v-1',
    url: 'https://www.figma.com/file/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES',
    thumbnail: '',
    tags: []
  },
  {
    id: '2',
    title: 'FIGMA CHALLENGES 2',
    description: 'Another simple Figma challenge with interactions.',
    demoLink: 'https://www.figma.com/proto/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=177-115&t=rgNur9XrVT3kk3qd-1',
    url: 'https://www.figma.com/file/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES',
    thumbnail: '',
    tags: []
  },
  {
    id: '3',
    title: 'PORTFOLIO',
    description: 'My personal portfolio website with journey, skill and CV.',
    demoLink: 'https://www.figma.com/proto/A4PmhKFDdS9Tpii5rLKVtj/PORTFOLIO?node-id=3-2427&t=QIWQgaVzCO2GvNja-1',
    url: 'https://www.figma.com/file/A4PmhKFDdS9Tpii5rLKVtj/PORTFOLIO',
    thumbnail: '',
    tags: []
  },
  {
    id: '4',
    title: 'Doppies in lyn',
    description: 'A fun game where players use bottle caps on a grid.',
    demoLink: 'https://www.figma.com/proto/NaafbKg3avFQjTyikCIUdW/Doppies-in-lyn?node-id=246-3643&t=hVYTq8Yk7NAe9qQb-1',
    url: 'https://www.figma.com/file/NaafbKg3avFQjTyikCIUdW/Doppies-in-lyn',
    thumbnail: '',
    tags: []
  }
]

interface Project {
  id: string
  title: string
  description: string
  demoLink: string
  url: string
  thumbnail: string
  tags: string[]
}

const config = useRuntimeConfig()

const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)
const dialogOpen = ref(false)
const selectedTag = ref<string | null>(null)
const loading = ref(false)
const apiError = ref(false)

const page = ref(1)
const perPage = ref(9)

const prevPage = () => { if (page.value > 1) page.value-- }
const nextPage = () => { if (page.value < totalPages.value) page.value++ }

const updatePerPage = () => {
  const width = window.innerWidth
  if (width > 1200) perPage.value = 9
  else if (width > 768) perPage.value = 6
  else perPage.value = 3
}

// Fetch live metadata for each file key from Figma REST API
const fetchFigmaProjects = async () => {
  const token = config.public.figmaToken as string | undefined
  if (!token) {
    // No token configured — use fallback
    projects.value = FALLBACK_PROJECTS
    return
  }

  loading.value = true
  apiError.value = false

  try {
    const results: Project[] = []
    let index = 1

    for (const [key, meta] of Object.entries(FIGMA_FILE_KEYS)) {
      try {
        const res = await axios.get(`https://api.figma.com/v1/files/${key}`, {
          headers: { 'X-Figma-Token': token }
        })
        const file = res.data
        results.push({
          id: String(index++),
          title: file.name ?? key,
          description: meta.description,
          demoLink: meta.demoLink,
          url: `https://www.figma.com/file/${key}`,
          thumbnail: file.thumbnailUrl ?? '',
          tags: []
        })
      } catch {
        // Individual file failed — still include it using fallback data
        const fallback = FALLBACK_PROJECTS.find(p => p.url.includes(key))
        if (fallback) results.push(fallback)
        index++
      }
    }

    projects.value = results.length ? results : FALLBACK_PROJECTS
  } catch {
    apiError.value = true
    projects.value = FALLBACK_PROJECTS
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updatePerPage()
  window.addEventListener('resize', updatePerPage)
  fetchFigmaProjects()
})

onUnmounted(() => window.removeEventListener('resize', updatePerPage))

const filteredProjects = computed(() =>
  selectedTag.value ? projects.value.filter(p => p.tags.includes(selectedTag.value!)) : projects.value
)

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / perPage.value))

const pagedProjects = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredProjects.value.slice(start, start + perPage.value)
})

const openProject = (project: Project) => { selectedProject.value = project; dialogOpen.value = true }
const closeProject = () => { selectedProject.value = null; dialogOpen.value = false }
</script>

<style scoped>
/* No overflow */
.layout,
.figma-page,
.page-inner {
  overflow: hidden;
}

/* ThemeToggle — isolated, never blurred */
.toggle-wrapper {
  position: fixed;
  top: 1.5vh;
  left: 1.5vw;
  z-index: 1100;
  isolation: isolate;
  width: clamp(35px, 5.5vw, 60px);
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.figma-page {
  min-height: 100%;
  padding: 0 !important;
  overflow: hidden !important;
}

/* page-inner: same offset logic as Projects page */
.page-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.2rem 2rem 1rem 5rem;
  box-sizing: border-box;
}

/* API status */
.api-note {
  font-size: 0.8rem;
  color: #aaa;
  margin: 0.3rem 0 0.6rem;
  text-align: center;
}

/* Page Title */
.page-title {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 900;
  margin: 2rem 0 2rem 0;
  letter-spacing: 1px;
  width: 100%;
  color: #b5710bf8;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  text-shadow: 0 0 8px rgba(231,143,10,0.6);
  animation: shimmer 2.5s infinite linear;
}
@keyframes shimmer {
  0%   { text-shadow: 0 0 5px rgba(231,143,10,0.4), 0 0 10px rgba(231,143,10,0.3); }
  50%  { text-shadow: 0 0 15px rgba(231,143,10,0.6), 0 0 20px rgba(231,143,10,0.4); }
  100% { text-shadow: 0 0 5px rgba(231,143,10,0.4), 0 0 10px rgba(231,143,10,0.3); }
}
body.light-mode .page-title { color: #137CB5; }

/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin: 1rem 0 2.5rem 0;
  font-weight: bold;
  width: 100%;
  max-width: 820px;
}
.page-btn {
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: #0f7db3;
  color: #fff;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.3s;
}
.page-btn:disabled             { background: #999; cursor: not-allowed; }
.page-btn:hover:not(:disabled) { transform: scale(1.05); }

/* Projects Grid */
.projects-wrapper {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 240px));
  gap: 0.9rem;
  justify-content: center;
  align-items: start;
  width: 100%;
  max-width: 820px;
  margin: 0 auto 1rem auto;
  box-sizing: border-box;
}

/* Project Card */
.project-card {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 130px;
  padding: 0.9rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  text-align: center;
  position: relative;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}
.project-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 28px rgba(0,0,0,0.35);
  background: rgba(255,255,255,0.1);
}

/* Figma thumbnail */
.card-thumb {
  width: 100%;
  max-height: 80px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

/* Project Title */
.project-title {
  color: var(--project-title-color);
  font-weight: 600;
  font-size: 0.95rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2em;
  max-height: 2.4em;
}
:root           { --project-title-color: #fff; }
body.light-mode { --project-title-color: #333; }

/* Card Buttons */
.card-buttons {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.7rem;
  flex-wrap: wrap;
  justify-content: center;
}
.demo-btn, .figma-btn, .open-btn {
  padding: 0.3rem 0.65rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.75rem;
  transition: 0.3s;
  color: #fff;
}
.demo-btn {
  background: linear-gradient(135deg, #e78f0ad2, #a87835);
  box-shadow: 0 4px 12px rgba(170,124,55,0.4);
}
.demo-btn:hover  { transform: scale(1.05); box-shadow: 0 6px 18px rgba(231,143,10,0.6); }
.figma-btn {
  background: linear-gradient(135deg, #0d618f, #1089c6b9);
  box-shadow: 0 4px 12px rgba(19,174,251,0.3);
}
.figma-btn:hover { transform: scale(1.05); box-shadow: 0 6px 18px rgba(10,59,84,0.5); }
.open-btn {
  background: linear-gradient(135deg, #555, #666);
  box-shadow: 0 4px 12px rgba(115,114,114,0.3);
}
.open-btn:hover  { transform: scale(1.05); box-shadow: 0 6px 18px rgba(74,72,72,0.4); }

/* Modal Close Button */
.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #E78F0A;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.modal-close-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(231,143,10,0.5); }

/* Modal */
.project-details-snippet {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  color: #fff;
  padding: 1.5rem;
  border-radius: 14px;
  text-align: left;
  box-shadow: 0 10px 28px rgba(0,0,0,0.35);
  max-height: 65vh;
  overflow-y: auto;
  position: relative;
}
.project-details-snippet h2 {
  margin-bottom: 0.8rem;
  text-align: center;
  color: #221e1e;
  text-shadow: 0 0 5px rgba(18,76,105,0.5);
  font-size: 1.3rem;
}
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* ── Responsive ── */
@media (min-width: 1400px) {
  .page-inner       { padding-left: 5rem; padding-right: 2rem; padding-top: 1.2rem; }
  .projects-wrapper { grid-template-columns: repeat(3, minmax(0, 250px)); max-width: 880px; }
}
@media (max-width: 1399px) and (min-width: 1201px) {
  .page-inner       { padding-left: 5rem; padding-right: 2rem; padding-top: 1.2rem; }
  .projects-wrapper { grid-template-columns: repeat(3, minmax(0, 230px)); max-width: 800px; }
}
@media (max-width: 1200px) and (min-width: 769px) {
  .page-inner       { padding-left: 2rem; padding-right: 1.5rem; }
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 260px)); max-width: 620px; }
  .project-card     { min-height: 120px; }
}
@media (max-width: 1024px) and (min-width: 769px) {
  .page-inner       { padding-left: 1.5rem; padding-right: 1rem; }
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 240px)); max-width: 580px; }
  .project-card     { min-height: 115px; padding: 0.8rem; }
}
@media (max-width: 768px) {
  .page-inner       { padding-left: 1rem; padding-right: 1rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 320px); max-width: 380px; }
  .page-title       { font-size: 2rem; margin: 0 0 0.6rem 0; }
}
@media (max-width: 600px) {
  .projects-wrapper { grid-template-columns: minmax(0, 290px); gap: 0.6rem; max-width: 340px; }
  .page-title       { font-size: 1.8rem; }
  .project-card     { min-height: 110px; padding: 0.7rem; }
}
@media (max-width: 480px) {
  .page-inner       { padding-left: 0.5rem; padding-right: 0.5rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 95vw); max-width: 95vw; gap: 0.6rem; }
  .project-card     { padding: 0.6rem; min-height: 100px; }
  .project-title    { font-size: 0.8rem; }
  .page-title       { font-size: 1.5rem; margin: 0.8rem 0; }
  .page-btn, .open-btn, .demo-btn, .figma-btn { padding: 0.25rem 0.5rem; font-size: 0.72rem; }
  .project-details-snippet h2 { font-size: 1rem; }
}
@media (device-width: 390px) and (device-height: 844px) {
  .page-inner       { padding-left: 0.5rem; padding-right: 0.5rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 92vw); gap: 0.7rem; }
  .project-card     { padding: 0.65rem; min-height: 120px; }
}
@media (device-width: 428px) and (device-height: 926px) {
  .page-inner       { padding-left: 0.5rem; padding-right: 0.5rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 92vw); gap: 0.7rem; }
  .project-card     { padding: 0.65rem; min-height: 120px; }
}
@media (device-width: 768px) and (device-height: 1024px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 250px)); }
}
@media (device-width: 834px) and (device-height: 1112px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 260px)); }
}
@media (device-width: 820px) and (device-height: 1180px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 260px)); }
}
@media (width: 1024px) and (height: 600px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 240px)); gap: 0.8rem; }
}
</style>