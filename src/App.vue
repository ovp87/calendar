<script setup lang="ts">
  import Calendar from "./components/Calendar.vue";
  import {computed, onMounted, onUnmounted, ref} from "vue";
  import {type CalendarEvent, getMonday, getWeekNumber} from "./utils/calendarUtils.ts";
  import { loadIcs } from './utils/icsLoader'
  import Header from "./components/Header.vue";
  import WeeklyList from "./components/WeeklyList.vue";
  import PhotoSlideshow from './components/PhotoSlideShow.vue';

  const images = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/10.jpg',
  ];


  const weekStart = ref(getMonday(new Date()))
  const events = ref<CalendarEvent[]>([])

  const mode = ref<'weekly-calendar' | 'weekly-list' | 'photo'>('weekly-list');

  const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
  const CACHE_KEY = 'calendarEventsCache';

  function saveEventsToCache(evts: CalendarEvent[]) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(evts));
  }

  function loadEventsFromCache(): CalendarEvent[] {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    try {
      // Restore Date objects
      return JSON.parse(cached).map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end)
      }));
    } catch {
      return [];
    }
  }

  function nextWeek() {
    console.log('Next week', weekStart.value);
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + 7)
    weekStart.value = getMonday(d)
  }

  const weekNumber = computed(() => getWeekNumber(weekStart.value));

  function setMode(newMode: 'weekly-calendar' | 'weekly-list' | 'photo') {
    mode.value = newMode;
  }

  function prevWeek() {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() - 7)
    weekStart.value = getMonday(d)
  }

  function resetWeek() {
    weekStart.value = getMonday(new Date());
  }

  const weekDays = computed(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart.value)
      d.setDate(weekStart.value.getDate() + i)
      return d
    })
  });

  async function fetchCalendars() {
    try {
      const [olaEvents, ritaEvents] = await Promise.all([
        loadIcs('http://localhost:3001/calendars/ola/calendar.ics', 'ola', 'google'),
        loadIcs('http://localhost:3001/calendars/rita/calendar.ics', 'rita', 'icloud')
      ]);
      const allEvents = [...olaEvents, ...ritaEvents];
      events.value = allEvents;
      saveEventsToCache(allEvents);
    } catch (error) {
      // On error, keep current events (from cache)
      console.error('Failed to fetch calendars, using cached events:', error);
    }
  }

  onMounted(() => {
    // Load from cache first
    events.value = loadEventsFromCache();
    // Fetch from network
    fetchCalendars();
    // Set up periodic fetching
    const interval = setInterval(fetchCalendars, FETCH_INTERVAL);
    onUnmounted(() => clearInterval(interval));
  });
</script>

<template>
  <div
      class="min-h-screen flex flex-col relative"
      :class="mode === 'photo' ? 'bg-black' : ''"
  >
    <Header
        class="fixed top-0 left-0 w-full z-50"
        :mode="mode"
        @set-mode="setMode"
        :show-week-number="mode !== 'photo'"
        :week-number="weekNumber"
        @next-week="nextWeek"
        @prev-week="prevWeek"
        :week-start="weekStart"
        @reset-week="resetWeek"
    />
    <div class="flex-1 flex flex-col" :class="mode === 'photo' ? 'pt-16' : ''">
      <PhotoSlideshow v-if="mode === 'photo'" :images="images" />
      <Calendar v-if="mode === 'weekly-calendar'" :week-days="weekDays" :week-start="weekStart" :events="events"/>
      <WeeklyList v-if="mode === 'weekly-list'" :week-days="weekDays" :events="events" :week-start="weekStart"/>
    </div>
  </div>
</template>