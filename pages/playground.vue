<template>
  <v-app>
    <BackgroundCanvas />

    <div class="layout">
      <Sidebar />
      <v-main>
        <div class="toggle-wrapper">
          <ThemeToggle />
        </div>

        <v-container class="playground-page" fluid>
          <div class="page-inner">
            <h1 class="page-title">My Projects</h1>

            <!-- Tags -->
            <div class="tags-container">
              <button
                v-for="tag in allTags"
                :key="tag"
                @click="selectTag(tag)"
                :class="['tag-btn', { active: selectedTag === tag }]"
              >
                {{ tag }}
              </button>
              <button v-if="selectedTag" class="tag-btn clear" @click="clearTag">Clear</button>
            </div>

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
                <h3 class="project-title">{{ project.title }}</h3>
                <div class="card-buttons">
                  <button @click="openProject(project)" class="open-btn">Open</button>
                  <a :href="`https://github.com/Steffycoding/${project.title}/archive/refs/heads/main.zip`" target="_blank">
                    <button class="download-btn">Download</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </v-container>

        <!-- Project Modal -->
        <v-dialog v-model="dialogOpen" persistent max-width="600px">
          <div v-if="selectedProject" class="project-details-snippet">
            <h2>{{ selectedProject.title }}</h2>
            <p class="modal-desc">{{ selectedProject.description }}</p>
            <div class="modal-buttons">
              <button @click="closeProject" class="close-btn">Close</button>
              <a :href="`https://github.com/Steffycoding/${selectedProject.title}`" target="_blank">
                <button class="github-btn">Go to GitHub</button>
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

interface Project {
  id: number
  title: string
  description: string
  demo: string[]
  tags: string[]
}

const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)
const dialogOpen = ref(false)
const selectedTag = ref<string | null>(null)
const allTags = ref<string[]>([])

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

onMounted(() => {
  updatePerPage()
  window.addEventListener('resize', updatePerPage)
  fetchGitHubProjects('Steffycoding')
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

const selectTag = (tag: string) => { selectedTag.value = tag; page.value = 1 }
const clearTag = () => { selectedTag.value = null; page.value = 1 }

const fetchGitHubProjects = async (username: string) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: { Accept: 'application/vnd.github.mercy-preview+json' }
    })
    projects.value = res.data.map((repo: any) => ({
      id: repo.id,
      title: repo.name,
      description: repo.description || 'No description',
      demo: [],
      tags: [...(repo.language ? [repo.language] : []), ...(repo.topics || [])]
    }))
    const tagsSet = new Set<string>()
    projects.value.forEach(p => p.tags.forEach(t => tagsSet.add(t)))
    allTags.value = Array.from(tagsSet).sort()
  } catch (err) {
    console.error('Failed to fetch GitHub projects', err)
  }
}
</script>

<style scoped>
/* No overflow anywhere */
.layout,
.playground-page,
.page-inner {
  overflow: hidden;
}

/* ThemeToggle — isolated stacking context, never blurred */
.toggle-wrapper {
  position: relative;
  z-index: 500;
  isolation: isolate;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Container: no extra padding fighting Vuetify */
.playground-page {
  min-height: 100%;
  padding: 0 !important;
  overflow: hidden !important;
}

/* page-inner: shift right with padding-left to visually clear the sidebar,
   then centre the content within the remaining space */
.page-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* Nudged right and slightly down */
  padding: 1.2rem 2rem 1rem 5rem;
  box-sizing: border-box;
}

/* Page Title */
.page-title {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 900;
  margin: 1.5rem 0 0.8rem 0;
  letter-spacing: 1px;
  width: 100%;
  color: #E78F0A;
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

/* Tags */
.tags-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 820px;
}
.tag-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: none;
  background: #13AEFB;
  color: #fff;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 500;
  transition: 0.3s;
}
.tag-btn:hover  { transform: scale(1.05); box-shadow: 0 4px 8px rgba(19,174,251,0.4); }
.tag-btn.active { background: #E78F0A; }
.tag-btn.clear  { background: #777; }

/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin: 1rem 0 2rem 0;
  font-weight: bold;
  width: 100%;
  max-width: 820px;
}
.page-btn {
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: #13AEFB;
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
body.light-mode { --project-title-color: #333; --project-card-background: rgb(127,127,127); }

/* Card Buttons */
.card-buttons { display: flex; gap: 0.5rem; margin-top: 0.7rem; }
.open-btn, .download-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.78rem;
  transition: 0.3s;
}
.open-btn     { background: #13AEFB; color: #fff; }
.download-btn { background: #E78F0A; color: #fff; }
.open-btn:hover, .download-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }

/* Project Modal */
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
}
.project-details-snippet h2 {
  margin-bottom: 0.8rem;
  text-align: center;
  color: #221e1e;
  text-shadow: 0 0 5px rgba(19,174,251,0.5);
  font-size: 1.3rem;
}
.modal-buttons { display: flex; justify-content: space-between; margin-top: 1rem; }
.close-btn, .github-btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: 0.3s;
}
.close-btn  { background: #E78F0A; color: #fff; }
.github-btn { background: #13AEFB; color: #fff; }
.close-btn:hover, .github-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.25); }

/* ── Responsive ── */

/* Large desktop */
@media (min-width: 1400px) {
  .page-inner      { padding-left: 3rem; padding-right: 2rem; }
  .projects-wrapper { grid-template-columns: repeat(3, minmax(0, 250px)); max-width: 880px; }
}

/* MacBook / standard laptop (this is the primary target) */
@media (max-width: 1399px) and (min-width: 1201px) {
  .page-inner      { padding-left: 3rem; padding-right: 2rem; }
  .projects-wrapper { grid-template-columns: repeat(3, minmax(0, 230px)); max-width: 800px; }
}

/* Tablet landscape */
@media (max-width: 1200px) and (min-width: 769px) {
  .page-inner       { padding-left: 2rem; padding-right: 1.5rem; }
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 260px)); max-width: 620px; }
  .project-card     { min-height: 120px; }
}

/* iPad / small tablets */
@media (max-width: 1024px) and (min-width: 769px) {
  .page-inner       { padding-left: 1.5rem; padding-right: 1rem; }
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 240px)); max-width: 580px; }
  .project-card     { min-height: 115px; padding: 0.8rem; }
}

/* Phones */
@media (max-width: 768px) {
  .page-inner       { padding-left: 1rem; padding-right: 1rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 320px); max-width: 380px; }
  .page-title       { font-size: 2rem; margin: 1.2rem 0 0.6rem 0; }
}
@media (max-width: 600px) {
  .projects-wrapper { grid-template-columns: minmax(0, 290px); gap: 0.6rem; max-width: 340px; }
  .page-title   { font-size: 1.8rem; }
  .project-card { min-height: 110px; padding: 0.7rem; }
}
@media (max-width: 480px) {
  .page-inner       { padding-left: 0.5rem; padding-right: 0.5rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 95vw); max-width: 95vw; gap: 0.6rem; }
  .project-card     { padding: 0.6rem; min-height: 100px; }
  .project-title    { font-size: 0.8rem; }
  .page-title       { font-size: 1.5rem; margin: 1rem 0; }
  .page-btn, .open-btn, .download-btn { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
  .project-details-snippet h2 { font-size: 1rem; }
}

/* iPhone 12/13/14 Pro */
@media (device-width: 390px) and (device-height: 844px) {
  .page-inner       { padding-left: 0.5rem; padding-right: 0.5rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 92vw); gap: 0.7rem; }
  .project-card     { padding: 0.65rem; min-height: 120px; }
}
/* iPhone 14 Plus / Pro Max */
@media (device-width: 428px) and (device-height: 926px) {
  .page-inner       { padding-left: 0.5rem; padding-right: 0.5rem; }
  .projects-wrapper { grid-template-columns: minmax(0, 92vw); gap: 0.7rem; }
  .project-card     { padding: 0.65rem; min-height: 120px; }
}
/* iPad portrait */
@media (device-width: 768px) and (device-height: 1024px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 250px)); }
}
/* iPad Air */
@media (device-width: 834px) and (device-height: 1112px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 260px)); }
}
/* iPad Pro 11" */
@media (device-width: 820px) and (device-height: 1180px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 260px)); }
}
/* Surface Pro landscape */
@media (width: 1024px) and (height: 600px) {
  .projects-wrapper { grid-template-columns: repeat(2, minmax(0, 240px)); gap: 0.8rem; }
}
</style>