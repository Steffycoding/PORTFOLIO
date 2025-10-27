<template>
  <v-app>
    <div class="layout">
      <Sidebar />
      <v-main>
        <ThemeToggle />
        <v-container class="figma-page" fluid>
          <h1 class="page-title">My Projects</h1>

          <!-- Add Project Button -->
          <div style="text-align:center; margin-bottom:1.5rem;">
            <button class="demo-btn" @click="openForm()">+ Add Project</button>
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
                <a :href="project.demoLink" target="_blank">
                  <button class="demo-btn" :disabled="!project.demoLink">Demo</button>
                </a>
                <a :href="project.url" target="_blank">
                  <button class="figma-btn" :disabled="!project.url">View on Figma</button>
                </a>
                <button class="open-btn" @click="openProject(project)">Details</button>
                <button class="open-btn" style="background:#2ECC71;" @click="openForm(project)">Edit</button>
                <button class="open-btn" style="background:#E74C3C;" @click="deleteProject(project.id)">Delete</button>
              </div>
            </div>
          </div>

          <!-- Project Modal -->
          <v-dialog v-model="dialogOpen" persistent max-width="600px">
            <div v-if="selectedProject" class="project-details-snippet">
              <button class="modal-close-btn" @click="closeProject">✕</button>
              <h2>{{ selectedProject.title }}</h2>
              <p class="modal-desc">{{ selectedProject.description }}</p>
              <div class="modal-buttons">
                <a :href="selectedProject.demoLink" target="_blank">
                  <button class="demo-btn" :disabled="!selectedProject.demoLink">Demo</button>
                </a>
                <a :href="selectedProject.url" target="_blank">
                  <button class="figma-btn" :disabled="!selectedProject.url">View on Figma</button>
                </a>
              </div>
            </div>
          </v-dialog>

          <!-- Add/Edit Project Form Modal -->
          <v-dialog v-model="formOpen" persistent max-width="500px">
            <div class="project-details-snippet">
              <button class="modal-close-btn" @click="closeForm">✕</button>
              <h2>{{ editingProject ? 'Edit Project' : 'Add Project' }}</h2>
              <v-form @submit.prevent="saveProject">
                <v-text-field v-model="form.title" label="Title" required></v-text-field>
                <v-text-field v-model="form.demoLink" label="Demo Link"></v-text-field>
                <v-text-field v-model="form.url" label="Prototype / Figma Link"></v-text-field>
                <v-textarea v-model="form.description" label="Description" required></v-textarea>
                <div style="text-align:center; margin-top:1rem;">
                  <button type="submit" class="demo-btn">{{ editingProject ? 'Save Changes' : 'Add Project' }}</button>
                </div>
              </v-form>
            </div>
          </v-dialog>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'

interface Project {
  id: string
  title: string
  description: string
  demoLink: string
  url: string
  tags: string[]
}

// Projects data
const projects = ref<Project[]>([])

const selectedProject = ref<Project | null>(null)
const dialogOpen = ref(false)
const formOpen = ref(false)
const editingProject = ref<Project | null>(null)
const form = ref({ title:'', demoLink:'', url:'', description:'' })

const selectedTag = ref<string | null>(null)
const page = ref(1)
const perPage = ref(9)

// Pagination
const prevPage = () => { if(page.value>1) page.value-- }
const nextPage = () => { if(page.value<totalPages.value) page.value++ }

// Responsive perPage
const updatePerPage = () => {
  const width = window.innerWidth
  if(width>1200) perPage.value=9
  else if(width>768) perPage.value=6
  else perPage.value=3
}

// Load from localStorage on mount
onMounted(() => {
  updatePerPage()
  window.addEventListener('resize', updatePerPage)

  const saved = localStorage.getItem('projects')
  if (saved) {
    try {
      projects.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse projects from localStorage', e)
    }
  } else {
    // Optional: default projects if nothing in localStorage
    projects.value = [
      { id: '1', title: 'FIGMA CHALLENGES', description: 'Personal Figma challenge with radio buttons, states and interactions.', demoLink: '', url: '', tags: [] },
      { id: '2', title: 'FIGMA CHALLENGES 2', description: 'Another simple Figma challenge with interactions.', demoLink: '', url: '', tags: [] },
      { id: '3', title: 'PORTFOLIO', description: 'My personal portfolio website.', demoLink: '', url: '', tags: [] },
      { id: '4', title: 'Doppies in lyn', description: 'A fun game with bottle caps.', demoLink: '', url: '', tags: [] }
    ]
  }
})

// Remove resize listener
onUnmounted(()=>window.removeEventListener('resize', updatePerPage))

// Computed
const filteredProjects = computed(() =>
  selectedTag.value ? projects.value.filter(p => p.tags.includes(selectedTag.value!)) : projects.value
)
const totalPages = computed(()=>Math.ceil(filteredProjects.value.length/perPage.value))
const pagedProjects = computed(()=>{
  const start = (page.value-1)*perPage.value
  return filteredProjects.value.slice(start, start+perPage.value)
})

// Project modal
const openProject = (project: Project) => { selectedProject.value = project; dialogOpen.value = true }
const closeProject = () => { selectedProject.value = null; dialogOpen.value = false }

// Add/Edit modal
const openForm = (project: Project | null = null) => {
  if(project){
    editingProject.value = project
    form.value = { ...project }
  } else {
    editingProject.value = null
    form.value = { title:'', demoLink:'', url:'', description:'' }
  }
  formOpen.value = true
}
const closeForm = () => { formOpen.value = false }

// Save projects to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('projects', JSON.stringify(projects.value))
}

// Add/Edit project
const saveProject = () => {
  if(editingProject.value){
    const index = projects.value.findIndex(p => p.id === editingProject.value!.id)
    if(index !== -1) projects.value[index] = { ...form.value, id: editingProject.value.id, tags: [] }
  } else {
    const newId = projects.value.length ? (Math.max(...projects.value.map(p => Number(p.id))) + 1).toString() : '1'
    projects.value.push({ ...form.value, id: newId, tags: [] })
  }

  saveToLocalStorage() // Persist changes
  formOpen.value = false
}

// Delete project with confirmation
const deleteProject = (id: string) => {
  const project = projects.value.find(p => p.id === id)
  if (!project) return

  const confirmed = window.confirm(`Are you sure you want to delete "${project.title}"?`)
  if (confirmed) {
    projects.value = projects.value.filter(p => p.id !== id)
    saveToLocalStorage() // Persist changes
  }
}

</script>





<style scoped>

/* Page Title */
.page-title {
  text-align: center;
  font-size: 5rem;
  font-weight: 900;
  margin: 2.5rem 0 0 0;
  letter-spacing: 1px;
  position: relative;
  color: #E78F0A;
}

/* Projects Grid */
.projects-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: start;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  padding: 0 1rem;
}

/* Project Card */
.project-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.project-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 14px 35px rgba(0,0,0,0.4);
}

/* Project Title */
.project-title {
  color: var(--project-title-color);
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3em;
  max-height: 2.6em;
}
:root { --project-title-color: #fff; }
body.light-mode { --project-title-color: #333; }

/* Card Buttons */
/* Card Buttons */
.card-buttons { display: flex; gap: 0.6rem; margin-top: 1rem; flex-wrap: wrap; }

.demo-btn, .figma-btn, .open-btn {
  padding: 0.55rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: #fff;
  font-size: 0.95rem;
}

.demo-btn {
  background: linear-gradient(135deg, #E78F0A, #FFB347);
  box-shadow: 0 6px 18px rgba(231,143,10,0.4);
}
.demo-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(231,143,10,0.6);
}

.figma-btn {
  background: linear-gradient(135deg, #137CB5, #13AEFB);
  box-shadow: 0 6px 18px rgba(19,174,251,0.4);
}
.figma-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(19,174,251,0.6);
}

.open-btn {
  background: linear-gradient(135deg, #555, #777);
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
}
.open-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.5);
}

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
.modal-close-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(231,143,10,0.5);
}

/* Modal Buttons inside modal */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.modal-buttons .demo-btn,
.modal-buttons .figma-btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}
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
.project-details-snippet h2 {
  margin-bottom: 1rem;
  text-align: center;
  color: #221e1e;
  text-shadow: 0 0 6px rgba(19,174,251,0.6);
  font-size: 1.6rem;
}

/* Close / Figma Buttons */
.close-btn, .figma-btn { padding: 0.7rem 1.4rem; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.3s; }
.close-btn { background: #E78F0A; color: #fff; }
.figma-btn { background: #13AEFB; color: #fff; }
.close-btn:hover, .figma-btn:hover { transform: scale(1.05); }

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
    gap: 0.8rem;
  }
  .page-title {
    font-size: 1.9rem;
    margin: 1.2rem 0;
  }
  .project-card {
    max-width: 90%;
    padding: 0.7rem;
    min-height: 130px;
  }
  .page-btn, .open-btn, .view-btn {
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
  .page-btn, .open-btn, .view-btn {
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
  .page-btn, .open-btn, .view-btn {
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

  .page-btn, .open-btn, .view-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  .demo-btn, .figma-btn, .open-btn, .modal-close-btn {
    font-size: 0.8rem;
    padding: 0.35rem 0.8rem;
  }
}



</style>
