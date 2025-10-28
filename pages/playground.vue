<template>
  <v-app>
    <div class="layout">
      <Sidebar />
      <v-main>
        <ThemeToggle />
        <v-container class="playground-page" fluid>
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
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'

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

/* Page Title */
.page-title {
  text-align: center;
  font-size: 3rem; /* smaller, fits sidebar */
  font-weight: 900;
  margin: 2rem 0 1rem 0;
  letter-spacing: 1px;
  position: relative;
  color: #E78F0A;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  text-shadow: 0 0 8px rgba(231,143,10,0.6);
  animation: shimmer 2.5s infinite linear;
}

/* Shimmer effect for title */
@keyframes shimmer {
  0% { text-shadow: 0 0 5px rgba(231,143,10,0.4), 0 0 10px rgba(231,143,10,0.3); }
  50% { text-shadow: 0 0 15px rgba(231,143,10,0.6), 0 0 20px rgba(231,143,10,0.4); }
  100% { text-shadow: 0 0 5px rgba(231,143,10,0.4), 0 0 10px rgba(231,143,10,0.3); }
}

/* Light mode */
body.light-mode .page-title {
  color: #137CB5;
}

/* Tags */
.tags-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.tag-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: #13AEFB;
  color: #fff;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: 0.3s;
}
.tag-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(19,174,251,0.4);
}
.tag-btn.active { background: #E78F0A; }
.tag-btn.clear { background: #777; }

/* Projects Grid */
.projects-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  justify-items: center;
  align-items: start;
  width: 100%;
  max-width: 1000px;
  margin: 1.5rem 1rem 0rem 1rem;
  padding: 0 1rem;
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
  max-width: 250px; 
  min-height: 150px; 
  padding: 1rem; 
  border-radius: 12px; 
  box-shadow: 0 6px 18px rgba(0,0,0,0.25); 
  text-align: center; 
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  margin-left: 1.5rem;
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
  font-size: 1rem;
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
:root { --project-title-color: #fff; }
body.light-mode { --project-title-color: #333; -project-card-background: rgba(119, 119, 119, 0.967); }

/* Card Buttons */
.card-buttons { display: flex; gap: 0.5rem; margin-top: 0.8rem; }
.open-btn, .download-btn {
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.3s;
}
.open-btn { background: #13AEFB; color: #fff; }
.download-btn { background: #E78F0A; color: #fff; }
.open-btn:hover, .download-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* Pagination */
.pagination-controls { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  gap: 0.8rem; 
  margin: 1rem 0 1.5rem 0; 
  font-weight: bold; 
}
.page-btn { 
  padding: 0.45rem 1rem; 
  border-radius: 8px; 
  border: none; 
  background: #13AEFB; 
  color: #fff; 
  cursor: pointer; 
  font-size: 0.8rem;
  transition: 0.3s;
}
.page-btn:disabled { background: #999; cursor: not-allowed; }
.page-btn:hover:not(:disabled) { transform: scale(1.05); }

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
.close-btn { background: #E78F0A; color: #fff; }
.github-btn { background: #13AEFB; color: #fff; }
.close-btn:hover, .github-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.25); }

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

/* Responsive Grid */
@media (max-width: 1200px) {
  .projects-wrapper {
    grid-template-columns: repeat(3, 1fr);
    padding-left: 0;
  }
}

@media (max-width: 1024px) {
  .projects-wrapper {
    grid-template-columns: repeat(2, 1fr);
    padding-left: 0;
    
  }
  .project-card {
    max-width: 90%;
    padding: 0.7rem;
    min-height: 120px;
    margin-right: 1rem;
  }
}

@media (max-width: 768px) {
  .projects-wrapper {
    grid-template-columns: 1fr;
    padding-left: 0;
  }
  .page-title {
    font-size: 2.2rem;
    margin: 1.8rem 0 1rem 0;
  }
  .page-btn, .open-btn, .view-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  .demo-btn, .figma-btn, .open-btn, .modal-close-btn {
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
  }  
}

@media (max-width: 600px) {
  .projects-wrapper {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
  .page-title {
    font-size: 1.9rem;
    margin: 1.2rem 0;
  }
  .project-card {
    max-width: 90%;
    padding: 0.7rem;
    min-height: 120px;
    margin-right: 1rem;
  }
  .page-btn, .open-btn, .download-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.85rem;
  }
}


/* Specific Devices */
@media (width: 1024px) and (height: 600px) {
  .projects-wrapper {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
}

@media (device-width: 768px) and (device-height: 1024px) {
  .projects-wrapper {
    grid-template-columns: 2fr;
  }
}

@media (device-width: 834px) and (device-height: 1112px) {
  .projects-wrapper {
    grid-template-columns: 2fr;
  }
}

@media (device-width: 820px) and (device-height: 1180px) {
  .projects-wrapper {
    grid-template-columns: 2fr;
  }
}

@media (device-width: 390px) and (device-height: 844px) {
  .projects-wrapper {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
  .project-card {
    max-width: 95%;
    padding: 0.65rem;
    min-height: 125px;
  }
  .page-btn, .open-btn, .download-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}

@media (device-width: 428px) and (device-height: 926px) {
  .projects-wrapper {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
  .project-card {
    max-width: 95%;
    padding: 0.65rem;
    min-height: 125px;
  }
  .page-btn, .open-btn, .download-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}

@media (min-width: 1400px) {
  .projects-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Small Mobile Adjustments */
@media (max-width: 480px) {
  .projects-wrapper {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 0 0.5rem;
    gap: 0.6rem;
  }

  .project-card {
    width: 90%;
    max-width: 320px;
    padding: 0.6rem;
    min-height: 100px;
    box-sizing: border-box;
  }

  .project-details-snippet h2 {
    font-size: 1rem;
  }

  .project-title {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
    max-height: 2em;
  }

  .page-title {
    font-size: 1.6rem;
    margin: 1rem 0;
  }

  .page-btn, .open-btn, .download-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}



</style>
