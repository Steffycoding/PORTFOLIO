<template>
  <v-container>
    <h2>Edit CV</h2>

    <label>Name:</label>
    <input v-model="cvCopy.name" />

    <label>Role:</label>
    <input v-model="cvCopy.role" />

    <label>Summary:</label>
    <textarea v-model="cvCopy.summary" rows="6"></textarea>

    <label>Experience:</label>
    <div v-for="(job, idx) in cvCopy.experience" :key="idx">
      <input v-model="job.title" placeholder="Job Title" />
      <input v-model="job.date" placeholder="Date" />
      <textarea v-model="job.description" placeholder="Description"></textarea>
    </div>
    <button @click="addExperience">Add Experience</button>

    <label>Education:</label>
    <div v-for="(edu, idx) in cvCopy.education" :key="idx">
      <input v-model="edu.school" placeholder="School" />
      <input v-model="edu.degree" placeholder="Degree" />
    </div>
    <button @click="addEducation">Add Education</button>

    <label>Skills:</label>
    <h4>Languages</h4>
    <div v-for="(lang, idx) in cvCopy.skills.languages" :key="idx">
      <input v-model="cvCopy.skills.languages[idx]" />
    </div>
    <button @click="cvCopy.skills.languages.push('')">Add Language</button>

    <h4>Frameworks & Tools</h4>
    <div v-for="(fw, idx) in cvCopy.skills.frameworks" :key="idx">
      <input v-model="cvCopy.skills.frameworks[idx]" />
    </div>
    <button @click="cvCopy.skills.frameworks.push('')">Add Framework/Tool</button>

    <h4>Professional Skills</h4>
    <div v-for="(skill, idx) in cvCopy.skills.professional" :key="idx">
      <input v-model="cvCopy.skills.professional[idx]" />
    </div>
    <button @click="cvCopy.skills.professional.push('')">Add Skill</button>

    <br /><br />
    <button @click="saveCV">Save CV</button>
  </v-container>
</template>

<script setup>
import { reactive, toRefs } from 'vue'
import { useCV } from '~/composables/useCV'

const { cvData, updateCV } = useCV()
const cvCopy = reactive(JSON.parse(JSON.stringify(cvData.value)))

const addExperience = () => cvCopy.experience.push({ title: '', date: '', description: '' })
const addEducation = () => cvCopy.education.push({ school: '', degree: '' })

const saveCV = () => {
  updateCV(cvCopy)
  alert('CV updated!')
}
</script>

<style scoped>
input, textarea {
  display: block;
  width: 100%;
  margin: 0.3rem 0 0.8rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #13AEFB;
}
button {
  background: #13AEFB;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
}
button:hover { transform: scale(1.05); transition: 0.2s; }
</style>
