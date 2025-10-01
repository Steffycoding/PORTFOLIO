<template>
  <v-app>
    <v-main>
      <v-container class="playground-page" fluid>
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

        <!-- Projects Grid -->
        <div class="projects-grid">
          <div
            class="project-card"
            v-for="project in filteredProjects"
            :key="project.id"
          >
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="project-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'

// Example projects data
const projects = ref([
  { id: 1, title: 'Project A', description: 'Cool project A', tags: ['Vue', 'Nuxt'] },
  { id: 2, title: 'Project B', description: 'Cool project B', tags: ['JavaScript'] },
  { id: 3, title: 'Project C', description: 'Cool project C', tags: ['Vue'] },
  { id: 4, title: 'Project D', description: 'Cool project D', tags: ['Nuxt', 'CSS'] }
])

// Collect all unique tags
const allTags = Array.from(new Set(projects.value.flatMap(p => p.tags)))

const selectedTag = ref(null)

// Computed filtered projects
const filteredProjects = computed(() => {
  if (!selectedTag.value) return projects.value
  return projects.value.filter(p => p.tags.includes(selectedTag.value))
})
</script>

<style scoped>
.playground-page {
  padding: 2rem;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.project-card {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(23, 23, 23, 0.85);
  color: #fff;
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
</style>
