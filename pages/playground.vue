<template>
  <v-app>
    <div class="layout">
      <Sidebar />
      <v-main>
        <ThemeToggle />

        <v-container class="playground-page" fluid>
          <!-- Page Title -->
          <div class="page-title">
            <h1>My Projects 🚀</h1>
          </div>

          <!-- Tag Filters -->
          <div class="tags-container">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="selectedTag = tag"
              :class="['tag-btn', { active: selectedTag === tag }]"
            >
              {{ tag }}
            </button>
            <button
              class="tag-btn clear"
              v-if="selectedTag"
              @click="selectedTag = null"
            >
              Clear
            </button>
          </div>

          <!-- Projects Grid with arrows -->
          <div class="projects-wrapper">
            <button class="scroll-btn left" @click="scrollLeft">&#9664;</button>
            <div class="projects-grid" ref="projectsGrid">
              <div
                class="project-card"
                v-for="project in filteredProjects"
                :key="project.id"
              >
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
                <div v-if="project.demo" class="project-demo">
                  <iframe :src="project.demo" frameborder="0" allowfullscreen></iframe>
                </div>
                <pre v-if="project.code" class="project-code">
<code>{{ project.code }}</code>
                </pre>
                <div class="project-tags">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="project-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <button class="scroll-btn right" @click="scrollRight">&#9654;</button>
          </div>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { useProjects } from '~/composables/useProjects'

const { projects, allTags } = useProjects()
const selectedTag = ref(null)

const filteredProjects = computed(() => {
  if (!selectedTag.value) return projects.value
  return projects.value.filter(p => p.tags.includes(selectedTag.value))
})

// Smooth scrolling
const projectsGrid = ref(null)
const scrollLeft = () => projectsGrid.value.scrollBy({ left: -300, behavior: 'smooth' })
const scrollRight = () => projectsGrid.value.scrollBy({ left: 300, behavior: 'smooth' })
</script>


<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}
.playground-page {
  padding: 2rem;
  margin-left: clamp(200px, 18%, 280px);
  width: 100%;
  transition: margin-left 0.3s ease;
}

.page-title {
  margin-bottom: 1.5rem;
}
.page-title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #13AEFB;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
}
.page-title h1:hover {
  transform: scale(1.05);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 2rem;
}
.tag-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #13AEFB;
  background: transparent;
  color: #13AEFB;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.tag-btn.active,
.tag-btn:hover {
  background: #13AEFB;
  color: #fff;
}
.tag-btn.clear {
  border-color: #E78F0A;
  color: #E78F0A;
}
.tag-btn.clear:hover {
  background: #E78F0A;
  color: #fff;
}

/* Projects Grid Wrapper */
.projects-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
}

/* Cards */
.project-card {
  flex: 0 0 auto;
  border-radius: 12px;
  background: rgba(23, 23, 23, 0.85);
  color: #fff;
  padding: 1rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(19, 174, 251, 0.25);
}
.project-demo iframe {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin: 0.5rem 0;
}
.project-code {
  background: #1e1e1e;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  overflow-x: auto;
  margin-bottom: 0.5rem;
}
.project-tags {
  margin-top: 0.5rem;
}
.project-tag {
  background: #E78F0A;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-size: 0.85rem;
  margin-right: 0.3rem;
}

/* Scroll Arrows */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(19, 174, 251, 0.85);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.2rem;
  color: #fff;
}
.scroll-btn.left {
  left: -16px;
}
.scroll-btn.right {
  right: -16px;
}

/* Responsive */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    overflow-x: visible;
  }
  .scroll-btn {
    display: none;
  }
}
</style>
