<template>
  <v-container>
    <h2>Add Project</h2>
    <input v-model="title" placeholder="Title" />
    <input v-model="description" placeholder="Description" />
    <input v-model="demo" placeholder="Demo URL" />
    <input v-model="code" placeholder="Code snippet" />
    <input v-model="tagsInput" placeholder="Tags (comma separated)" />
    <button @click="addNewProject">Add Project</button>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useProjects } from '~/composables/useProjects'

const { addProject } = useProjects()

const title = ref('')
const description = ref('')
const demo = ref('')
const code = ref('')
const tagsInput = ref('')

const addNewProject = () => {
  if (!title.value) return alert('Title is required!')
  addProject({
    title: title.value,
    description: description.value,
    demo: demo.value,
    code: code.value,
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
  })
  title.value = description.value = demo.value = code.value = tagsInput.value = ''
}
</script>
