<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import ICAL from 'ical.js'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import WeekNavigation from './WeekNavigation.vue'
import WeekHeader from './WeekHeader.vue'
import EventItem from './EventItem.vue'
import { getMonday, getWeekNumber, getGridRow, getGridSpan, layoutEvents } from '../utils/calendarUtils'
import type { CalendarEvent } from '../utils/calendarUtils'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'

const DAY_START_HOUR = 6
const weekStart = ref(getMonday(new Date()))
const events = ref<CalendarEvent[]>([])

function nextWeek() {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + 7)
  weekStart.value = getMonday(d)
}

function prevWeek() {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() - 7)
  weekStart.value = getMonday(d)
}

const weekDays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(weekStart.value.getDate() + i)
    return d
  })
})

function eventsForDay(day: Date) {
  return events.value.filter(e =>
      e.start.toDateString() === day.toDateString()
  )
}

const weekNumber = computed(() => getWeekNumber(weekStart.value))

async function loadCalendars() {
  try {
    await loadOlaGoogleIcs()
  } catch (error) {
    console.error('Failed to load Google Calendar:', error)
  }
}

async function loadOlaGoogleIcs() {
  const url = 'http://localhost:3001/calendars/ola/calendar.ics'
  //const url = 'http://localhost:3001/calendar.ics'
  const res = await fetch(url)
  const icsData = await res.text()
  const jcalData = ICAL.parse(icsData)
  const comp = new ICAL.Component(jcalData)
  const vevents = comp.getAllSubcomponents('vevent')
  const newEvents: CalendarEvent[] = vevents.map((vevent: any) => {
    const event = new ICAL.Event(vevent)
    return {
      id: event.uid,
      title: event.summary,
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
      source: 'google',
      description: event.description
    }
  })
  events.value = newEvents
}

onMounted(() => {
  loadCalendars()
});
</script>


<template>
  <div class="w-full flex flex-col min-h-screen">
    <button class="bg-gray-200 text-black px-4 py-2 rounded-md my-4 mx-auto block" @click="loadCalendars">
      Load Google Calendar
    </button>
    <WeekNavigation
        :weekNumber="weekNumber"
        :prevWeek="prevWeek"
        :nextWeek="nextWeek"
    />
    <div class="flex h-full flex-col">
      <header class="flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <div class="flex items-center">
          <div class="ml-6 md:hidden">
            <Menu as="div" class="relative">
              <MenuButton class="relative flex items-center rounded-full border border-transparent text-gray-400 outline-offset-8 hover:text-gray-500">
                <span class="absolute -inset-2" />
                <span class="sr-only">Open menu</span>
                <EllipsisHorizontalIcon class="size-5" aria-hidden="true" />
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-hidden' : 'text-gray-700', 'block px-4 py-2 text-sm']">Create event</a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-hidden' : 'text-gray-700', 'block px-4 py-2 text-sm']">Go to today</a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-hidden' : 'text-gray-700', 'block px-4 py-2 text-sm']">Day view</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-hidden' : 'text-gray-700', 'block px-4 py-2 text-sm']">Week view</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-hidden' : 'text-gray-700', 'block px-4 py-2 text-sm']">Month view</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-hidden' : 'text-gray-700', 'block px-4 py-2 text-sm']">Year view</a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </header>
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