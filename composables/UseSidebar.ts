import { ref } from 'vue'

export function useSidebar() {
  const links = ref([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'CV', path: '/cv' },
    { name: 'Playground', path: '/playground' },
    { name: 'Contact', path: '/contact' },
  ])

  return { links }
}
