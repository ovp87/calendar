<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarEvent } from "../utils/calendarUtils.ts";

const NO_EVENTS_TEXT: string = '';

const props = defineProps<{
  weekDays: Date[],
  events: CalendarEvent[],
  weekStart: Date
}>();

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

const daysWithEvents = computed(() =>
    props.weekDays.map(day => ({
      day,
      events: eventsForDay(day)
    }))
)

</script>

<template>
  <div class="w-full flex flex-col">
    <div class="grid grid-cols-7 divide-x border-t border-gray-100 divide-gray-100">
      <div v-for="({ day, events }) in daysWithEvents" :key="day.toISOString()" class="flex flex-col">
        <div class="font-semibold capitalize my-2 text-center pb-2 border-b border-gray-200" :class="{
          'text-indigo-600': day.toDateString() === (new Date()).toDateString(),
          'text-gray-900': day.toDateString() !== (new Date()).toDateString()
        }">
          {{ day.toLocaleDateString('nb-no', { weekday: 'short', month: 'short', day: 'numeric' }) }}
        </div>
        <ul class="flex flex-col">
          <li v-for="event in events" :key="event.id" class="p-2 mx-4 rounded-lg my-2" :class="{ 'bg-rita': event.owner === 'rita', 'bg-ola': event.owner === 'ola' }">
            <div>
              <span v-if="!isAllDay(event)">
                <span class="text-sm font-semibold" :class="{ 'text-rita': event.owner === 'rita', 'text-ola': event.owner === 'ola' }">
                  {{ event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                  -
                  {{ event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}:
                </span>
              </span>
              <span :class="{ 'text-rita': event.owner === 'rita', 'text-ola': event.owner === 'ola' }">
                {{ event.title }}
              </span>
              <p class="mt-1 text-sm text-gray-500 mb-4" v-if="event.description">{{ event.description }}</p>
            </div>
          </li>
          <li v-if="events.length === 0" :class="{'p-2': NO_EVENTS_TEXT.length > 0}" class="text-sm text-gray-500">
            {{ NO_EVENTS_TEXT }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>