<script setup lang="ts">

import type {CalendarEvent} from "../utils/calendarUtils.ts";

function eventsForDay(day: Date) {
  return props.events
      .filter(e => e.start.toDateString() === day.toDateString())
      .sort((a, b) => {
        const aAllDay = isAllDay(a)
        const bAllDay = isAllDay(b)
        if (aAllDay && !bAllDay) return -1
        if (!aAllDay && bAllDay) return 1
        return a.start.getTime() - b.start.getTime()
      })
}

function isAllDay(event: CalendarEvent) {
  return (
      event.start.getHours() === 0 &&
      event.start.getMinutes() === 0 &&
      event.end.getHours() === 0 &&
      event.end.getMinutes() === 0
  )
}

const props = defineProps<{
  weekDays: Date[],
  events: CalendarEvent[],
  weekStart: Date
}>()
</script>


<template>
  <div class="w-full min-h-screen flex flex-col">
    <div class="flex-1 flex flex-row items-stretch">
      <div
        v-for="(day, idx) in weekDays"
        :key="day.toISOString()"
        style="height: -webkit-fill-available;"
        class="flex-1 flex flex-col h-full items-stretch justify-start py-3"
        :class="{
          'border-l border-gray-200': idx !== 0,
          'text-indigo-600': day.toDateString() === (new Date()).toDateString(),
          'text-gray-900': day.toDateString() !== (new Date()).toDateString(),
        }"
      >
        <div class="font-semibold mb-2 text-center pb-2 border-b border-gray-200">
          {{ day.toLocaleDateString('nb-no', { weekday: 'long', month: 'long', day: 'numeric' }) }}
        </div>
        <ul class="flex-1 flex flex-col w-full">
          <li v-for="event in eventsForDay(day)" :key="event.id" class="mb-1 px-2">
            <span v-if="isAllDay(event)" class="font-bold">
              {{ event.title }}
            </span>
            <div v-else class="">
              <span class="text-gray-500">
                {{ event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}:
              </span>
              {{ event.title }}
            </div>
          </li>
          <li v-if="eventsForDay(day).length === 0" class="text-gray-400 px-2">Ingen hendelser</li>
        </ul>
      </div>
    </div>
  </div>
</template>