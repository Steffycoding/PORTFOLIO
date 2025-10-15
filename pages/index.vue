<template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Access router
const router = useRouter()

onMounted(() => {
  router.push('/welcome')
})
</script>
