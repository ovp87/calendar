<script setup lang="ts">
  import type { CalendarEvent } from '../utils/calendarUtils'

  defineProps<{
    event: CalendarEvent
    col: number
    gridRow: number
    gridSpan: number
    column: number
    columnCount: number
  }>()
</script>
<template>
  <li
      class="relative mt-px flex"
      :style="{
      gridColumn: col,
      gridRow: `${gridRow} / span ${gridSpan}`,
      width: `calc(100% / ${columnCount})`,
      left: `calc(${column} * 100% / ${columnCount})`,
      position: 'relative'
    }"
  >
    <div class="group absolute inset-1 flex flex-col rounded-lg bg-green-50 p-2 text-xs/5 hover:bg-green-100 break-words whitespace-pre-line">
      <p class="font-semibold text-green-700">{{ event.title }}</p>
      <p class="text-black">
        <time :datetime="event.start.toISOString()">{{ event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</time>
      </p>
    </div>
  </li>
</template>

