<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <button
        v-for="link in links"
        :key="link.path"
        class="sidebar-btn"
        :class="{ active: activePath === link.path }"
        @click="goTo(link.path)"
      >
        {{ link.name }}
      </button>
    </nav>

    <div class="logout-wrapper" v-if="isAdmin">
      <v-btn class="logout-btn" @click="logoutAdmin">Logout</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isAdmin = ref(false)
const activePath = ref('/')

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/AboutAdmin' },
  { name: 'CV', path: '/CVAdmin' },
  { name: 'Playground', path: '/PlaygroundAdmin' },
  { name: 'Contact', path: '/ContactAdmin' },
]

onMounted(() => {
  // Only access localStorage and window in the browser
  isAdmin.value = localStorage.getItem('isAdmin') === 'true'
  activePath.value = window.location.pathname
})

function goTo(path: string) {
  if (typeof window !== 'undefined') {
    activePath.value = path
    window.location.href = path
  }
}

function logoutAdmin() {
  if (typeof localStorage !== 'undefined' && typeof window !== 'undefined') {
    localStorage.removeItem('isAdmin')
    isAdmin.value = false
    window.location.href = '/'
  }
}
</script>


<style scoped>
:root { --sidebar-width: 220px; }

.sidebar {
  width: clamp(200px, 18%, 280px);
  height: 100vh;
  background: rgba(var(--v-theme-background-rgb), 0.25);
  backdrop-filter: blur(10px);
  border-radius: 0 1.2rem 1.2rem 0;
  box-shadow: 2px 0 15px rgba(0,0,0,0.15);
  padding: 4rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 6rem;
}

.sidebar-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.95rem 0;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--v-theme-surface);
  background: rgba(var(--v-theme-background-rgb), 0.12);
  border-left: 4px solid transparent;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease;
  text-shadow: 0 0 5px rgba(19, 174, 251, 0.15);
}

.sidebar-btn:hover {
  background: rgba(231, 143, 10, 0.18);
  border-left: 4px solid #E78F0A;
  color: #fff;
  transform: translateX(4px);
  box-shadow: 0 3px 10px rgba(231, 143, 10, 0.2);
}

.sidebar-btn.active {
  background: rgba(231, 143, 10, 0.22);
  border-left: 4px solid #E78F0A;
  color: #fff;
  box-shadow: 0 4px 12px rgba(231, 143, 10, 0.25);
}

/* Logout Button */
.logout-wrapper {
  margin-top: 2rem;
  text-align: center;
}

.logout-btn {
  background: rgba(231, 143, 10, 0.15);
  color: #fff;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
  width: 100%;
  transition: all 0.25s ease;
}

.logout-btn:hover {
  background: rgba(231, 143, 10, 0.3);
  transform: scale(1.05);
}

/* Responsive Sidebar */
v-main { margin-left: var(--sidebar-width, 220px); }
@media (max-width: 768px) { v-main { margin-left: 0; }
  .sidebar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    height: 75px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -3px 15px rgba(0,0,0,0.15);
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 0.6rem;
    justify-content: space-around;
    margin-top: 0;
  }

  .logout-wrapper {
    display: none;
  }

  .sidebar-btn {
    flex: 1;
    font-size: 0.9rem;
    padding: 0.55rem;
    border-left: none;
    border-bottom: 3px solid transparent;
    border-radius: 10px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
  }

  .sidebar-btn.active {
    border-bottom: 3px solid #E78F0A;
    background: rgba(231, 143, 10, 0.15);
  }
}
</style>
