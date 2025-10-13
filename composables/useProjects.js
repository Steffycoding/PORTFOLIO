import { ref, computed } from 'vue'

const projects = ref([]) // initially empty

export function useProjects() {
  const allTags = computed(() => Array.from(new Set(projects.value.flatMap(p => p.tags))))
  const addProject = (project) => {
    project.id = projects.value.length ? Math.max(...projects.value.map(p => p.id)) + 1 : 1
    projects.value.push(project)
  }
  const updateProject = (updated) => {
    const index = projects.value.findIndex(p => p.id === updated.id)
    if (index !== -1) projects.value[index] = updated
  }
  const removeProject = (id) => {
    projects.value = projects.value.filter(p => p.id !== id)
  }

  return { projects, allTags, addProject, updateProject, removeProject }
}
