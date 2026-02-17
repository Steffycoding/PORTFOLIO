<template>
  <!-- Fullscreen canvas — sits behind all page content -->
  <canvas ref="bgCanvas" class="bg-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const bgCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

interface Bubble { x: number; y: number; r: number; speed: number; opacity: number; wobble: number; wobbleSpeed: number; wobbleAmt: number }
interface Star    { x: number; y: number; r: number; twinkleSpeed: number; twinkleOffset: number }
let bubbles: Bubble[] = []
let stars: Star[] = []

function createBubble(w: number, h: number, randomY = false): Bubble {
  const r = Math.random() * 22 + 6
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + r + 10,
    r, speed: Math.random() * 0.6 + 0.25,
    opacity: Math.random() * 0.25 + 0.06,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.02 + 0.008,
    wobbleAmt: Math.random() * 18 + 5,
  }
}

function initParticles(w: number, h: number) {
  bubbles = Array.from({ length: 28 }, () => createBubble(w, h, true))
  stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    twinkleSpeed: Math.random() * 0.02 + 0.008,
    twinkleOffset: Math.random() * Math.PI * 2, // unique phase = no synced blinking
  }))
}

function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, isDark: boolean) {
  ctx.clearRect(0, 0, w, h)

  // Stars — sine wave on alpha creates the twinkle
  for (const s of stars) {
    const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset))
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = isDark ? `rgba(180,240,255,${alpha})` : `rgba(0,80,220,${alpha * 0.55})`
    ctx.fill()
    // soft glow halo per star
    const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
    glow.addColorStop(0, isDark ? `rgba(100,220,255,${alpha * 0.45})` : `rgba(0,80,220,${alpha * 0.2})`)
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
    ctx.fillStyle = glow; ctx.fill()
  }

  // Bubbles — rise upward with a horizontal sine wobble
  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i]
    if (!b) continue // guard: skip if resize cleared the array mid-frame
    b.y -= b.speed; b.wobble += b.wobbleSpeed
    const bx = b.x + Math.sin(b.wobble) * b.wobbleAmt

    // off-centre radial gradient = glassy sphere illusion
    const grad = ctx.createRadialGradient(bx - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.05, bx, b.y, b.r)
    grad.addColorStop(0, isDark ? `rgba(200,255,255,${b.opacity * 1.8})` : `rgba(255,255,255,${b.opacity * 2.2})`)
    grad.addColorStop(0.5, isDark ? `rgba(0,188,212,${b.opacity})` : `rgba(0,87,255,${b.opacity})`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(bx, b.y, b.r, 0, Math.PI * 2)
    ctx.fillStyle = grad; ctx.fill()

    // rim stroke
    ctx.beginPath(); ctx.arc(bx, b.y, b.r, 0, Math.PI * 2)
    ctx.strokeStyle = isDark ? `rgba(0,220,240,${b.opacity * 1.5})` : `rgba(0,100,255,${b.opacity * 1.2})`
    ctx.lineWidth = 0.8; ctx.stroke()
    // specular dot — top-left highlight makes it look 3D
    ctx.beginPath(); ctx.arc(bx - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${b.opacity * 2.5})`; ctx.fill()

    if (b.y + b.r < 0) bubbles[i] = createBubble(w, h) // recycle off-screen bubbles
  }
}

onMounted(() => {
  const canvas = bgCanvas.value; if (!canvas) return
  const ctx = canvas.getContext('2d')!
  let w = canvas.width = window.innerWidth
  let h = canvas.height = window.innerHeight
  initParticles(w, h); let t = 0

  // Debounce resize — prevents initParticles firing mid-frame and wiping the array
  let resizeTimer: ReturnType<typeof setTimeout>
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      initParticles(w, h)
    }, 120)
  }
  window.addEventListener('resize', onResize)

  // rAF loop — reads live theme each frame so dark/light switches instantly
  const loop = () => { drawFrame(ctx, w, h, t++, theme.global.current.value.dark); animationId = requestAnimationFrame(loop) }
  loop()
  ;(canvas as any)._cleanup = () => window.removeEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (bgCanvas.value && (bgCanvas.value as any)._cleanup) (bgCanvas.value as any)._cleanup()
})
</script>

<style scoped>
/* Fixed behind everything, never intercepts clicks */
.bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>