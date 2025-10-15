<template>
  <v-app>
    <v-main class="cv-page">
      <!-- Admin Sidebar -->
      <AdminSidebar v-if="isAdmin" />

      <!-- Theme Toggle -->
      <div class="theme-toggle-wrapper">
        <ThemeToggle />
      </div>

      <v-container class="cv-editor">
        <h2>Edit CV</h2>

        <!-- Name & Role -->
        <label>Name:</label>
        <input v-model="cvCopy.name" placeholder="Full Name" />

        <label>Role:</label>
        <input v-model="cvCopy.role" placeholder="Your Role" />

        <!-- Summary -->
        <label>Summary:</label>
        <textarea v-model="cvCopy.summary" rows="6" placeholder="Write a brief summary..."></textarea>

        <!-- Experience -->
        <label>Experience:</label>
        <div v-for="(job, idx) in cvCopy.experience" :key="idx" class="section-block">
          <div class="section-header">
            <span>Job {{ idx + 1 }}</span>
            <button class="delete-btn" @click="removeExperience(idx)">Delete</button>
          </div>
          <input v-model="job.title" placeholder="Job Title" />
          <input v-model="job.date" placeholder="Date" />
          <textarea v-model="job.description" placeholder="Description"></textarea>
        </div>
        <button class="add-btn" @click="addExperience">Add Experience</button>

        <!-- Education -->
        <label>Education:</label>
        <div v-for="(edu, idx) in cvCopy.education" :key="idx" class="section-block">
          <div class="section-header">
            <span>Education {{ idx + 1 }}</span>
            <button class="delete-btn" @click="removeEducation(idx)">Delete</button>
          </div>
          <input v-model="edu.school" placeholder="School" />
          <input v-model="edu.degree" placeholder="Degree" />
        </div>
        <button class="add-btn" @click="addEducation">Add Education</button>

        <!-- Skills -->
        <label>Skills:</label>

        <h4>Languages</h4>
        <div v-for="(lang, idx) in cvCopy.skills.languages" :key="idx" class="skill-item">
          <input v-model="cvCopy.skills.languages[idx]" placeholder="Language" />
          <button class="delete-btn" @click="cvCopy.skills.languages.splice(idx,1)">Delete</button>
        </div>
        <button class="add-btn" @click="cvCopy.skills.languages.push('')">Add Language</button>

        <h4>Frameworks & Tools</h4>
        <div v-for="(fw, idx) in cvCopy.skills.frameworks" :key="idx" class="skill-item">
          <input v-model="cvCopy.skills.frameworks[idx]" placeholder="Framework/Tool" />
          <button class="delete-btn" @click="cvCopy.skills.frameworks.splice(idx,1)">Delete</button>
        </div>
        <button class="add-btn" @click="cvCopy.skills.frameworks.push('')">Add Framework/Tool</button>

        <h4>Professional Skills</h4>
        <div v-for="(skill, idx) in cvCopy.skills.professional" :key="idx" class="skill-item">
          <input v-model="cvCopy.skills.professional[idx]" placeholder="Skill" />
          <button class="delete-btn" @click="cvCopy.skills.professional.splice(idx,1)">Delete</button>
        </div>
        <button class="add-btn" @click="cvCopy.skills.professional.push('')">Add Skill</button>

        <br />
        <button class="save-btn" @click="saveCV">Save CV</button>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useCV } from '../composables/useCV'
import AdminSidebar from '~/components/AdminSidebar.vue'
import ThemeToggle from '~/components/ThemeToggle.vue'

// script setup
const { cvData, updateCV } = useCV()
const cvCopy = ref(JSON.parse(JSON.stringify(cvData.value)))

const saveCV = () => {
  updateCV(cvCopy.value)   // sync changes to main cvData
  alert('CV updated and synced!')
}

// Admin access check
const isAdmin = ref(false)
onMounted(() => {
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
})

// Handlers
const addExperience = () =>
  cvCopy.value.experience.push({ title: '', date: '', description: '' })
const removeExperience = (i: number) => cvCopy.value.experience.splice(i, 1)
const addEducation = () =>
  cvCopy.value.education.push({ school: '', degree: '' })
const removeEducation = (i: number) => cvCopy.value.education.splice(i, 1)

</script>





<style scoped>
.cv-page {
  display: flex;
  min-height: 100vh;
  background: var(--v-theme-background);
  color: var(--v-theme-on-background);
  position: relative;
}

/* Theme Toggle wrapper */
.theme-toggle-wrapper {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1200;
}

/* Editor container */
.cv-editor {
  max-width: 900px;
  margin: 2rem auto;
  font-family: 'Inter', sans-serif;
  flex: 1;
  padding: 2rem;
  background: var(--v-theme-surface);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

/* Inputs and textareas */
input, textarea {
  display: block;
  width: 100%;
  margin: 0.3rem 0 1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #13AEFB;
  transition: all 0.2s;
}
input:focus, textarea:focus {
  outline: none;
  border-color: #E78F0A;
}

/* Buttons */
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

/* Add & Save buttons with blue-orange gradient */
.add-btn {
  background: linear-gradient(135deg, #13AEFB, #E78F0A);
  color: #fff;
}
.save-btn {
  background: linear-gradient(135deg, #E78F0A, #13AEFB);
  color: #fff;
  font-size: 1.1rem;
}

/* Delete buttons */
.delete-btn {
  background: #B00020;
  color: #fff;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

/* Section blocks */
.section-block {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  background: rgba(231, 143, 10, 0.08);
}

/* Section headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Skill items */
.skill-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

/* Hover effects */
button:hover {
  transform: scale(1.05);
}
</style>
