<script setup lang="ts">
import { useRoute } from 'vue-router'
import SneakyAI from '~/components/SneakyAI.vue'
import { computed } from 'vue'

const route = useRoute()

const isWelcomePage = computed(() => route.path === '/welcome')
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />

  <SneakyAI v-if="!isWelcomePage" />
</template>