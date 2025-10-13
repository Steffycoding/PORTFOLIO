import { ref } from 'vue'

const cvData = ref({
  name: 'Stephanie Poole',
  role: 'Aspiring Software Developer',
  summary: `Driven by determination, I embarked on a programming journey despite my initial lack of knowledge in Python and Java.
I believe continuous learning and experimentation are keys to success.
Inspired by gaming and anime, I merge creativity with programming to spark unique ideas.
Approaching graduation, I’m eager to embrace opportunities, challenges, and growth in the programming world.`,
  experience: [
    {
      title: 'WeThinkCode — Student',
      date: 'Sept 2022 – Dec 2023',
      description: '16-month course covering Python and Java. Completed both 1st and 2nd year as part of the program.'
    },
    {
      title: 'ORT SA CAPE — Teaching Assistant',
      date: 'Apr 2021 – Mar 2022',
      description: 'Assisted teachers in reducing stress and workload, supporting both staff and students in their learning environment.'
    }
  ],
  education: [
    { school: 'WeThinkCode', degree: 'NQF 5, Information Technology' },
    { school: 'Manenberg High School', degree: 'Matric, Grade 12 (2020)' }
  ],
  skills: {
    languages: ['Python', 'Java', 'JavaScript', 'HTML & CSS', 'SQL'],
    frameworks: ['Vue.js (Nuxt, Vuetify)', 'React (basic)', 'Figma (UI/UX)', 'Git / GitHub', 'Linux / CLI'],
    professional: ['Project Planning & Organization', 'Teamwork & Collaboration', 'Problem Solving', 'Adaptability', 'Communication', 'Continuous Learning']
  }
})

export function useCV() {
  const updateCV = (newData) => {
    cvData.value = { ...cvData.value, ...newData }
  }
  return { cvData, updateCV }
}
