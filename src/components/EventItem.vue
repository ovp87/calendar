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

  function isAllDay(event: CalendarEvent) {
    return (
        event.start.getHours() === 0 &&
        event.start.getMinutes() === 0 &&
        event.end.getHours() === 0 &&
        event.end.getMinutes() === 0
    )
  }

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
    <div :class="[event.owner === 'rita' ? 'bg-rita' : '',event.owner === 'ola' ? 'bg-ola' : '']" class="group absolute inset-1 flex flex-col rounded-lg p-2 text-xs/5 break-words whitespace-pre-line">
      <p class="font-semibold" :class="[event.owner === 'rita' ? 'bg-rita' : '',event.owner === 'ola' ? 'bg-ola' : '']">{{ event.title }}</p>
      <p class="text-black">
        <span v-if="isAllDay(event)">Hele dagen</span>
        <span v-else>
          <time :datetime="event.start.toISOString()">{{ event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</time>
          -
          <time :datetime="event.end.toISOString()">{{ event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</time>
        </span>
      </p>
    </div>
  </li>
</template>

