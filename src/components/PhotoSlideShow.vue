<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  images: string[]
  intervalMs?: number
}>();

const current = ref(0)
const interval = ref<number | null>(null)
const intervalMs = props.intervalMs ?? 10000 * 6 * 5 // 10 seconds * 6 * 5 = 300 seconds (5 minutes)

const direction = ref<'left' | 'right'>('left')

function startInterval() {
  clearIntervalIfNeeded()
  interval.value = setInterval(nextAuto, intervalMs)
}
function clearIntervalIfNeeded() {
  if (interval.value) clearInterval(interval.value)
}
function resetInterval() {
  startInterval()
}
function nextAuto() {
  direction.value = 'left'
  current.value = (current.value + 1) % props.images.length
}
function next() {
  direction.value = 'left'
  current.value = (current.value + 1) % props.images.length
  resetInterval()
}
function prev() {
  direction.value = 'right'
  current.value = (current.value - 1 + props.images.length) % props.images.length
  resetInterval()
}

const touchStartX = ref(0)
const touchEndX = ref(0)

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0].screenX
}
function handleTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}
function handleSwipe() {
  const delta = touchEndX.value - touchStartX.value
  if (Math.abs(delta) > 50) {
    if (delta < 0) next()
    else prev()
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
}

onMounted(() => {
  startInterval();
  window.addEventListener('keydown', handleKeydown);
})
onUnmounted(() => {
  clearIntervalIfNeeded();
  window.removeEventListener('keydown', handleKeydown);
})
</script>

<template>
  <div class="w-full h-[calc(100vh-6rem)] bg-black flex items-center justify-center" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
      <transition :name="direction === 'left' ? 'slide-left' : 'slide-right'" mode="out-in">
        <img alt="" v-if="props.images.length" :key="current" :src="props.images[current]" class="object-contain w-full h-full bg-black"/>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>