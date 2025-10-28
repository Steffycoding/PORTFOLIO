<template>
  <v-app>
    <div class="layout">
      <Sidebar />
      <v-main>
        <ThemeToggle />
        <v-container class="figma-page" fluid>
          <h1 class="page-title">My Figma Projects</h1>

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
                  <button class="demo-btn">Demo</button>
                </a>
                <a :href="project.url" target="_blank">
                  <button class="figma-btn">View on Figma</button>
                </a>
                <button class="open-btn" @click="openProject(project)">Details</button>
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
                  <button class="demo-btn">Demo</button>
                </a>
                <a :href="selectedProject.url" target="_blank">
                  <button class="figma-btn">View on Figma</button>
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

// ------------------
// Projects with Figma and prototype links
// ------------------
const projects = ref<Project[]>([])

const selectedProject = ref<Project | null>(null)
const dialogOpen = ref(false)
const selectedTag = ref<string | null>(null)

const page = ref(1)
const perPage = ref(9)

// Pagination
const prevPage = () => { if (page.value > 1) page.value-- }
const nextPage = () => { if (page.value < totalPages.value) page.value++ }

// Responsive perPage
const updatePerPage = () => {
  const width = window.innerWidth
  if (width > 1200) perPage.value = 9
  else if (width > 768) perPage.value = 6
  else perPage.value = 3
}

// Load projects from localStorage on mount
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
    // Default projects if localStorage is empty
    projects.value = [
      {
        id: '1',
        title: 'FIGMA CHALLENGES',
        description: 'Personal Figma challenge with radio buttons, states and interactions.',
        demoLink: 'https://www.figma.com/proto/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=44-96&t=rZniJju5N9CC2x0v-1',
        url: 'https://www.figma.com/file/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=0-1',
        tags: []
      },
      {
        id: '2',
        title: 'FIGMA CHALLENGES 2',
        description: 'Another simple Figma challenge with interactions.',
        demoLink: 'https://www.figma.com/proto/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=177-115&t=rgNur9XrVT3kk3qd-1',
        url: 'https://www.figma.com/file/DBe36SHjmtbGjWYwbRVG9z/FIGMA-CHALLENGES?node-id=0-1',
        tags: []
      },
      {
        id: '3',
        title: 'PORTFOLIO',
        description: 'My personal portfolio website with journey, skill and CV.',
        demoLink: 'https://www.figma.com/proto/A4PmhKFDdS9Tpii5rLKVtj/PORTFOLIO?node-id=3-2427&t=QIWQgaVzCO2GvNja-1',
        url: 'https://www.figma.com/file/A4PmhKFDdS9Tpii5rLKVtj/PORTFOLIO?node-id=0-1',
        tags: []
      },
      {
        id: '4',
        title: 'Doppies in lyn',
        description: 'A fun game where players can use given number off cards for special types of bottle caps,players can only move their cap to an available gridpoint next to their own volor bottle cap',
        demoLink: 'https://www.figma.com/proto/NaafbKg3avFQjTyikCIUdW/Doppies-in-lyn?node-id=246-3643&t=hVYTq8Yk7NAe9qQb-1',
        url: 'https://www.figma.com/file/NaafbKg3avFQjTyikCIUdW/Doppies-in-lyn?node-id=5-400',
        tags: []
      }
    ]
  }
})

// Cleanup
onUnmounted(() => window.removeEventListener('resize', updatePerPage))

// Computed
const filteredProjects = computed(() =>
  selectedTag.value ? projects.value.filter(p => p.tags.includes(selectedTag.value!)) : projects.value
)

const totalPages = computed(() => Math.ceil(filteredProjects.value.length / perPage.value))

const pagedProjects = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filteredProjects.value.slice(start, start + perPage.value)
})

// Project modal
const openProject = (project: Project) => { selectedProject.value = project; dialogOpen.value = true }
const closeProject = () => { selectedProject.value = null; dialogOpen.value = false }

</script>




<style scoped>

/* Page Title */
.page-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  margin: 2rem 0 1rem 0;
  letter-spacing: 1px;
  position: relative;
  color: #b5710bf8;
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

/* Projects Grid */
.projects-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  justify-items: center;
  justify-content: center; 
  align-items: start;
  width: 100%;
  max-width: 1000px;
  margin: 1.5rem auto 0 auto;
  padding: 0 1rem;
  grid-auto-flow: row dense; 
}

/* Force last row with 1 item to be centered */
.projects-wrapper > .project-card:nth-last-child(1):nth-child(4) {
  grid-column: 2 / 3; /* centers the 4th item in a 3-column grid */
}

/* Force last row with 2 items (5 projects) to center */
.projects-wrapper > .project-card:nth-last-child(2):nth-child(4),
.projects-wrapper > .project-card:nth-last-child(1):nth-child(5) {
  grid-column: auto; /* already handled by justify-content:center */
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
:root { --project-title-color: #fff;}
body.light-mode { --project-title-color: #333; }

/* Card Buttons */
.card-buttons { display: flex; gap: 0.5rem; margin-top: 0.8rem; flex-wrap: wrap; }
.dark-mode.demo-btn, .dark-mode.figma-btn, .dark-mode.open-btn {
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.3s;
  color: #9f9f9f;
}
.demo-btn, .figma-btn, .open-btn {
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.3s;
  color: #fff;
}
.demo-btn {
  background: linear-gradient(135deg, #e78f0ad2, #a87835);
  box-shadow: 0 6px 18px rgb(170, 124, 55);
}
.demo-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(231,143,10,0.6);
}
.figma-btn {
  background: linear-gradient(135deg, #0d618f, #1089c6b9);
  box-shadow: 0 6px 18px rgba(19,174,251,0.4);
}
.figma-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(10, 59, 84, 0.6);
}
.open-btn {
  background: linear-gradient(135deg, #555, #666666);
  box-shadow: 0 6px 18px rgba(115, 114, 114, 0.458);
}
.open-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(74, 72, 72, 0.5);
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
.modal-buttons .figma-btn,
.modal-buttons .close-btn {
  font-size: 0.85rem;
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-weight: 500;
  transition: 0.3s;
}
.close-btn { background: #E78F0A; color: #fff; }
.close-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
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
  background: #0f7db3; 
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
  text-shadow: 0 0 5px rgba(18, 76, 105, 0.5); 
  font-size: 1.3rem; 
}

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
