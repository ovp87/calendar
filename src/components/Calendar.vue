<script setup lang="ts">

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import WeekHeader from './WeekHeader.vue'
import EventItem from './EventItem.vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import { layoutEvents, getGridRow, getGridSpan } from '../utils/calendarUtils'
import type { CalendarEvent } from '../utils/calendarUtils'

const DAY_START_HOUR = 6 // 06:00

function eventsForDay(day: Date) {
  return props.events.filter(e => e.start.toDateString() === day.toDateString())
}

const props = defineProps<{
  weekDays: Date[],
  events: CalendarEvent[],
  weekStart: Date
}>()


</script>


<template>
  <div class="w-full flex flex-col min-h-screen">
    <div class="flex h-full flex-col">
      <div class="flex-auto flex flex-col">
        <div class="isolate flex flex-auto flex-col overflow-y-auto bg-white">
          <div style="width: 165%" class="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
            <div class="sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black/5 sm:pr-8">
              <WeekHeader :weekDays="weekDays" />
            </div>
            <div class="flex flex-auto">
              <div class="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
              <div class="grid flex-auto grid-cols-1 grid-rows-1">
                <!-- Horizontal lines -->
                <div class="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100" style="grid-template-rows: repeat(48, minmax(3.5rem, 1fr))">
                  <div class="row-end-1 h-7" />
                  <template v-for="i in 24" :key="i">
                    <div>
                      <div class="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs/5 text-gray-600">
                        {{ ((DAY_START_HOUR + i - 1) % 24).toString().padStart(2, '0') }}:00
                      </div>
                    </div>
                    <div />
                  </template>
                </div>
                <!-- Vertical lines -->
                <div class="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                  <div class="col-start-1 row-span-full" />
                  <div class="col-start-2 row-span-full" />
                  <div class="col-start-3 row-span-full" />
                  <div class="col-start-4 row-span-full" />
                  <div class="col-start-5 row-span-full" />
                  <div class="col-start-6 row-span-full" />
                  <div class="col-start-7 row-span-full" />
                  <div class="col-start-8 row-span-full w-8" />
                </div>
                <!-- Events -->
                <ol
                    class="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                    style="grid-template-rows: 1.75rem repeat(48, minmax(0, 1fr)) auto"
                >
                  <template v-for="(day, dayIdx) in weekDays" :key="dayIdx">
                    <template v-for="event in layoutEvents(eventsForDay(day))" :key="event.id">
                      <EventItem
                          :event="event"
                          :col="dayIdx + 1"
                          :gridRow="getGridRow(event.start, DAY_START_HOUR)"
                          :gridSpan="getGridSpan(event.start, event.end)"
                          :column="event.column"
                          :columnCount="event.columnCount"
                      />
                    </template>
                  </template>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>