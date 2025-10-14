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
  font-size: 5rem;
  font-weight: 900;
  margin: 4rem 0 1.5rem 0;
  letter-spacing: 1px;
  position: relative;

  /* Dark mode: solid orange */
  color: #E78F0A;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  text-shadow: none;
}

/* Light mode: solid dark blue */
body.light-mode .page-title {
  color: #137CB5;  /* crisp dark blue */
}



/* Tags */
.tags-container { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 2rem; }
.tag-btn { padding: 0.5rem 1rem; border-radius: 8px; border: none; background: #13AEFB; color: #fff; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: 0.3s; }
.tag-btn:hover { transform: scale(1.05); box-shadow: 0 4px 10px rgba(19,174,251,0.4); }
.tag-btn.active { background: #E78F0A; }
.tag-btn.clear { background: #777; }

/* Projects Grid */
.projects-wrapper {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 1.5rem;
  justify-items: center;
  margin-top: 2rem;
  padding-left: 220px;
}

/* Project Card */
.project-card { 
  background: rgba(255,255,255,0.08); 
  backdrop-filter: blur(12px); 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  width: 100%; 
  max-width: 280px; 
  min-height: 180px; 
  padding: 1.2rem; 
  border-radius: 18px; 
  box-shadow: 0 8px 25px rgba(0,0,0,0.3); 
  text-align: center; 
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.project-card:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 14px 35px rgba(0,0,0,0.4); }

/* Project Title - responsive, no overlap */
.project-title {
  color: var(--project-title-color);
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* max 2 lines */
  -webkit-box-orient: vertical;
  line-height: 1.3em;
  max-height: 2.6em; /* 2 lines max */
}
:root { --project-title-color: #fff; }
body.light-mode { --project-title-color: #333; }

/* Card Buttons */
.card-buttons { display: flex; gap: 0.6rem; margin-top: 1rem; }
.open-btn, .download-btn { padding: 0.5rem 1rem; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: 0.3s; }
.open-btn { background: #13AEFB; color: #fff; }
.download-btn { background: #E78F0A; color: #fff; }
.open-btn:hover, .download-btn:hover { transform: scale(1.05); }

/* Pagination */
.pagination-controls { display: flex; justify-content: center; align-items: center; gap: 1rem; margin: 1.5rem 0 2rem 0; font-weight: bold; }
.page-btn { padding: 0.6rem 1.2rem; border-radius: 10px; border: none; background: #13AEFB; color: #fff; cursor: pointer; transition: 0.3s; }
.page-btn:disabled { background: #999; cursor: not-allowed; }
.page-btn:hover:not(:disabled) { transform: scale(1.08); }

/* Project Modal */
.project-details-snippet { 
  background: rgba(255,255,255,0.06); 
  backdrop-filter: blur(14px); 
  color: #fff; 
  padding: 2rem; 
  border-radius: 16px; 
  text-align: left; 
  box-shadow: 0 12px 35px rgba(0,0,0,0.4); 
  max-height: 70vh; 
  overflow-y: auto; 
}
.project-details-snippet h2 { margin-bottom: 1rem; text-align: center; color: #221e1e; text-shadow: 0 0 6px rgba(19,174,251,0.6); font-size: 1.6rem; }
.modal-buttons { display: flex; justify-content: space-between; margin-top: 1.5rem; }
.close-btn, .github-btn { padding: 0.7rem 1.4rem; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.3s; }
.close-btn { background: #E78F0A; color: #fff; }
.github-btn { background: #13AEFB; color: #fff; }
.close-btn:hover, .github-btn:hover { transform: scale(1.05); }

/* Responsive Grid */
@media (max-width: 1200px) { .projects-wrapper { grid-template-columns: repeat(3,1fr); padding-left: 0; } }
@media (max-width: 1024px) { .projects-wrapper { grid-template-columns: repeat(2,1fr); padding-left: 0; } }
@media (max-width: 768px) { .projects-wrapper { grid-template-columns: 1fr; padding-left: 0; }  
.page-title {
    font-size: 3rem;
    margin: 3rem 0 1rem 0;
  } }
@media (max-width: 600px) { .projects-wrapper { grid-template-columns: 1fr; gap: 1rem; } }

/* Specific Devices */
@media (width: 1024px) and (height: 600px) { .projects-wrapper { grid-template-columns: 1fr; gap: 1rem; } }
@media (device-width: 768px) and (device-height: 1024px) { .projects-wrapper { grid-template-columns: 2fr; } }
@media (device-width: 834px) and (device-height: 1112px) { .projects-wrapper { grid-template-columns: 2fr; } }
@media (device-width: 820px) and (device-height: 1180px) { .projects-wrapper { grid-template-columns: 2fr; } }
@media (device-width: 390px) and (device-height: 844px) { .projects-wrapper { grid-template-columns: 1fr; } }
@media (device-width: 428px) and (device-height: 926px) { .projects-wrapper { grid-template-columns: 1fr; } }
@media (min-width: 1400px) { .projects-wrapper { grid-template-columns: repeat(3,1fr); } }

@media (max-width: 480px) { 
  .project-card { width: 95%; max-width: 95%; padding: 1rem; min-height: 160px; } 
  .project-details-snippet h2 { font-size: 1.4rem; }
  .project-title { font-size: 0.95rem; -webkit-line-clamp: 2; max-height: 2.6em; }
}

</style>
