<template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Access router
const router = useRouter()

onMounted(() => {
  // Navigate without reloading, preserves dark/light mode
  router.push('/welcome')
})
</script>
