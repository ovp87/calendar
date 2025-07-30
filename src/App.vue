<script setup lang="ts">
  import Calendar from "./components/Calendar.vue";
  import {computed, onMounted, ref} from "vue";
  import {type CalendarEvent, getMonday, getWeekNumber} from "./utils/calendarUtils.ts";
  import { loadIcs } from './utils/icsLoader'
  import { CalendarDaysIcon} from "@heroicons/vue/24/outline";
  import Header from "./components/Header.vue";
  import WeeklyList from "./components/WeeklyList.vue";


  const weekStart = ref(getMonday(new Date()))
  const events = ref<CalendarEvent[]>([])

  const mode = ref<'weekly-calendar' | 'weekly-list'>('weekly-calendar');
  function nextWeek() {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + 7)
    weekStart.value = getMonday(d)
  }

  const weekNumber = computed(() => getWeekNumber(weekStart.value));

  function setMode(newMode: 'weekly-calendar' | 'weekly-list') {
    console.log('Setting mode to:', newMode);
    mode.value = newMode;
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
  });

  async function loadCalendars() {
    try {
      const [olaEvents, ritaEvents] = await Promise.all([
        loadIcs('http://localhost:3001/calendars/ola/calendar.ics', 'ola', 'google'),
        loadIcs('http://localhost:3001/calendars/rita/calendar.ics', 'rita', 'icloud')
      ])
      events.value = [...olaEvents, ...ritaEvents]
    } catch (error) {
      console.error('Failed to load calendars:', error)
    }
  }

  onMounted(() => {
    loadCalendars()
  });
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <Header :mode="mode" @set-mode="setMode" :week-number="weekNumber" @next-week="nextWeek" @prev-week="prevWeek" :week-start="weekStart" :next-week="nextWeek" :prev-week="prevWeek" />
    <div class="flex-1 flex flex-col">
      <Calendar v-if="mode === 'weekly-calendar'" :week-days="weekDays" :week-start="weekStart" :events="events"/>
      <WeeklyList v-if="mode === 'weekly-list'" :week-days="weekDays" :events="events" :week-start="weekStart"/>

    </div>
  </div>
</template>