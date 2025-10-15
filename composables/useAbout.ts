// composables/useAbout.ts
import { ref, watch, onMounted } from 'vue'

const aboutText = ref('') // start empty

export function useAbout() {
  onMounted(() => {
    const savedAbout = localStorage.getItem('aboutText') || `
<ul class="about-list">
  <li>Hi, I'm an aspiring web developer.</li>
  <li>I love tackling projects that push me to learn and create clean, intuitive interfaces.</li>
  <li>I often experiment with new ideas just to see where they lead.</li>
  <li>Recently, I’ve been exploring UI/UX design with FIGMA, because even the smallest layout or color shift can change how something feels to a user.</li>
  <li>I’m always learning, tweaking, and refining.</li>
  <li>Beyond coding, I’m drawn to human-centered design—thinking about how technology connects with people.</li>
  <li>My goal: keep growing, exploring, and creating things that matter.</li>
  <li>I like trying out different languages and frameworks that catch my eye.</li>
  <li>I wish to grow even more with every step i take towards my goals.</li>
</ul>
`
    aboutText.value = savedAbout

    watch(aboutText, (newVal) => {
      localStorage.setItem('aboutText', newVal)
    })
  })

  const updateAbout = (newText: string) => {
    aboutText.value = newText
  }

  return { aboutText, updateAbout }
}
