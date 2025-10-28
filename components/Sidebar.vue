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
  padding: 0.75rem 0;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 1.1rem;
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

/* Hover effect - light grayish-blue */
.sidebar-btn:hover {
  background: rgba(173, 190, 210, 0.3); /* soft gray-blue */
  border-left: 4px solid rgba(173, 190, 210, 0.5);
  color: #fff;
  transform: translateX(4px);
  box-shadow: 0 3px 10px rgba(173, 190, 210, 0.2);
}


.sidebar-btn.active {
  background: rgba(173, 190, 210, 0.25);
  border-left: 4px solid rgba(173, 190, 210, 0.5);
  color: #fff;
  box-shadow: 0 4px 12px rgba(173, 190, 210, 0.25);
}

/* ----------------- Mobile Footer Nav ----------------- */
@media (max-width: 768px) {
  .sidebar-btn {
    flex: 1;
    font-size: 0.85rem;
    padding: 0.45rem 0;
    font-weight: 600;
    border-left: none;
    border-bottom: 3px solid transparent;
    border-radius: 10px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
  }

  .sidebar-btn:hover {
    transform: translateY(-1px);
    background: rgba(173, 190, 210, 0.25);
  }

  .sidebar-btn.active {
    border-bottom: 3px solid rgba(173, 190, 210, 0.6);
    background: rgba(173, 190, 210, 0.2);
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
