import { ref, watch, onMounted } from 'vue'

// ------------------ Interfaces ------------------
interface Experience {
  title: string
  date: string
  description: string
}

interface Education {
  school: string
  degree: string
}

interface Skills {
  languages: string[]
  frameworks: string[]
  professional: string[]
}

interface CVData {
  name: string
  role: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skills
}

// ------------------ Reactive State ------------------
const cvData = ref<CVData>({
  name: 'Stephanie Poole',
  role: 'Aspiring Software Developer',
  summary: `Driven by determination, I embarked on a programming journey despite my initial lack of knowledge in Python and Java.
I believe continuous learning and experimentation are keys to success.
Inspired by gaming and anime, I merge creativity with programming to spark unique ideas.
Approaching graduation, I’m eager to embrace opportunities, challenges, and growth in the programming world.`,
  experience: [
    { title: 'WeThinkCode — Student', date: 'Sept 2022 – Dec 2023', description: '16-month course covering Python and Java. Completed both 1st and 2nd year as part of the program.' },
    { title: 'ORT SA CAPE — Teaching Assistant', date: 'Apr 2021 – Mar 2022', description: 'Assisted teachers in reducing stress and workload, supporting both staff and students in their learning environment.' },
  ],
  education: [
    { school: 'WeThinkCode', degree: 'NQF 5, Information Technology' },
    { school: 'Manenberg High School', degree: 'Matric, Grade 12 (2020)' },
  ],
  skills: {
    languages: ['Python', 'Java', 'JavaScript', 'HTML & CSS', 'SQL'],
    frameworks: ['Vue.js (Nuxt, Vuetify)', 'Figma (UI/UX)', 'Git / GitHub', 'Linux / CLI'],
    professional: ['Project Planning & Organization', 'Teamwork & Collaboration', 'Problem Solving', 'Adaptability', 'Communication', 'Continuous Learning'],
  },
})

// ------------------ Composable ------------------
export function useCV() {
  // Load saved data from localStorage when a component calls useCV()
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cvData')
      if (saved) cvData.value = JSON.parse(saved) as CVData
    }
  })

  const updateCV = (newData: CVData) => {
    cvData.value = { ...newData } // replace reference to trigger reactivity
  }

  // Persist changes automatically
  watch(
    cvData,
    (newVal) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cvData', JSON.stringify(newVal))
      }
    },
    { deep: true }
  )

  // Cross-tab sync
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'cvData' && event.newValue) {
        cvData.value = JSON.parse(event.newValue) as CVData
      }
    })
  }

  return { cvData, updateCV }
}
