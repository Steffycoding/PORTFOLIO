import { ref, watch } from 'vue'

// Initialize aboutText from localStorage if available
const savedAbout = localStorage.getItem('aboutText') || `
<ul class="about-list">
  <li><span></span> <span class="highlight">Hi, I'm an aspiring web developer</span>.</li>
  <li></span> I love tackling projects that push me to learn and create <span class="highlight">clean, intuitive interfaces</span>.</li>
  <li></span> I often experiment with new ideas just to see where they lead.</li>
  <li></span> Recently, I’ve been exploring <span class="highlight">UI/UX design with FIGMA</span>, because even the smallest layout or color shift can change how something feels to a user.</li>
  <li></span> I’m always learning, tweaking, and refining.</li>
  <li></span> Beyond coding, I’m drawn to <span class="highlight">human-centered design</span>—thinking about how technology connects with people.</li>
  <li></span> My goal: keep growing, exploring, and creating things that matter.</li>
</ul>
`

const aboutText = ref(savedAbout)

// Watch for changes and persist to localStorage
watch(aboutText, (newVal) => {
  localStorage.setItem('aboutText', newVal)
})

export function useAbout() {
  const updateAbout = (newText: string) => {
    aboutText.value = newText
  }

  return { aboutText, updateAbout }
}
