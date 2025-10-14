import { ref } from 'vue'

export function useAdminSidebar() {
  const links = ref([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/AboutAdmin' },
    { name: 'CV', path: '/CVAdmin' },
    { name: 'Playground', path: '/PlaygroundAdmin' },
    { name: 'Contact', path: '/ContactAdmin' },
  ])

  return { links }
}
