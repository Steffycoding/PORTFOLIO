<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="sidebar-btn"
        :class="{ active: $route.path === link.path }"
      >
        {{ link.name }}
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '../composables/UseSidebar'
const { links } = useSidebar()
</script>


<style scoped>


/* ----------------- Sidebar Styling ----------------- */
.sidebar {
  width: clamp(200px, 18%, 280px);
  height: 100vh;
  background: rgba(var(--v-theme-background-rgb), 0.25);
  backdrop-filter: blur(10px);
  border-radius: 0 1.2rem 1.2rem 0;
  box-shadow: 2px 0 15px rgba(0,0,0,0.15);
  padding: 3rem 1.5rem 2rem 1.5rem; /* moved padding top up */
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.6rem; 
  margin-top: 4.5rem; 
}

/* ----------------- Buttons ----------------- */
.sidebar-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 0; /* smaller padding */
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 1.1rem; /* slightly smaller font */
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

/* ----------------- Responsive (Mobile Footer Nav) ----------------- */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    min-height: auto;
    height: 75px;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    padding: 0.5rem 1rem;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -3px 15px rgba(0,0,0,0.15);
    backdrop-filter: blur(20px);
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 0.6rem;
    width: 100%;
    justify-content: space-around;
    margin-top: 0; /* reset for mobile */
  }

  .sidebar-btn {
    flex: 1;
    font-size: 0.9rem;
    padding: 0.55rem;
    font-weight: 600;
    border-left: none;
    border-bottom: 3px solid transparent;
    border-radius: 10px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
  }

  .sidebar-btn:hover {
    transform: translateY(-2px);
    background: rgba(231, 143, 10, 0.18);
  }

  .sidebar-btn.active {
    border-bottom: 3px solid #E78F0A;
    background: rgba(231, 143, 10, 0.15);
    color: #fff;
  }
}

/* ----------------- Tablet & Medium Screens ----------------- */
@media (min-width: 769px) and (max-width: 1280px) {
  .sidebar-nav {
    gap: 2.2rem;
    margin-top: 7rem;
  }
}

/* ----------------- Large Screens ----------------- */
@media (min-width: 1281px) {
  .sidebar-nav {
    gap: 2.5rem;
    margin-top: 8rem;
  }
}

/* ----------------- Extra-Large Screens ----------------- */
@media (min-width: 1600px) {
  .sidebar-nav {
    gap: 3rem;
    margin-top: 9rem;
  }
}
</style>
