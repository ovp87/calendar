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

  const INACTIVITY_TIMEOUT = 5 * 1000 * 60; // 5 minutes
  const mode = ref<'weekly-calendar' | 'weekly-list' | 'photo' | 'play'>('photo');
  const FETCH_INTERVAL = 5 * 1000 * 60; // 5 minutes
  const CACHE_KEY = 'calendarEventsCache';
  const weekStart = ref(getMonday(new Date()))
  const events = ref<CalendarEvent[]>([])
  let inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  let interval: ReturnType<typeof setInterval>;

  const slideDirection = ref('slide-right');

  let supportedModes = [
    'photo',
    'weekly-list',
    //'weekly-calendar'
  ];

  const weekNumber = computed(() => getWeekNumber(weekStart.value));
  const modeComponent = computed(() => {
    if (mode.value === 'photo') return PhotoSlideshow;
    if (mode.value === 'weekly-calendar') return Calendar;
    if (mode.value === 'weekly-list') return WeeklyList;
    return null;
  });

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      resetWeek();
    }, INACTIVITY_TIMEOUT);
  }

  function onUserActivity() {
    resetInactivityTimer();
  }

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
    slideDirection.value = 'slide-right';
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + 7)
    weekStart.value = getMonday(d)
  }
  function prevWeek() {
    slideDirection.value = 'slide-left';
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() - 7)
    weekStart.value = getMonday(d)
  }


  function setMode(newMode: 'weekly-calendar' | 'weekly-list' | 'photo') {
    mode.value = newMode;
  }


  function resetWeek() {
    const todayMonday = getMonday(new Date());
    if (todayMonday > weekStart.value) {
      slideDirection.value = 'slide-right';
    } else if (todayMonday < weekStart.value) {
      slideDirection.value = 'slide-left';
    }
    weekStart.value = todayMonday;
  }

  const weekDays = computed(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart.value)
      d.setDate(weekStart.value.getDate() + i)
      return d
    })
  });

  function powerOff() {
    fetch('http://localhost:3001/shutdown', { method: 'POST' })
        .then(res => res.text())
        .then(msg => alert(msg))
        .catch(err => alert('Failed to power off: ' + err));
  }

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
    window.addEventListener('mousemove', onUserActivity);
    window.addEventListener('keydown', onUserActivity);
    window.addEventListener('touchstart', onUserActivity);
    resetInactivityTimer();
    // Load from cache first
    events.value = loadEventsFromCache();
    // Fetch from network
    fetchCalendars();
    // Set up periodic fetching
    interval = setInterval(fetchCalendars, FETCH_INTERVAL);
  });

  onUnmounted(() => {
    clearInterval(interval);
    window.removeEventListener('mousemove', onUserActivity);
    window.removeEventListener('keydown', onUserActivity);
    window.removeEventListener('touchstart', onUserActivity);
  });

</script>

<template>
  <div
      class="min-h-screen flex flex-col relative transition-bg"
      :class="{ 'photo-bg': mode === 'photo', 'calendar-bg': mode !== 'photo' }"
  >
    <Header
        class="fixed top-0 left-0 w-full z-50"
        :mode="mode"
        @set-mode="setMode"
        @power-off="powerOff"
        :show-week-number="mode !== 'photo'"
        :week-number="weekNumber"
        @next-week="nextWeek"
        @prev-week="prevWeek"
        :week-start="weekStart"
        @reset-week="resetWeek"
        :supported-modes="supportedModes"
    />
    <div
        class="flex-1 flex flex-col"
        :class="mode === 'photo' ? 'pt-12' : ''"
        :style="{
        '--divider-color': mode === 'photo' ? 'rgba(0,0,0,0)' : '#e5e7eb'
      }"
    >
      <Transition name="slide" mode="out-in">
        <component
            :is="modeComponent"
            :key="mode"
            :images="images"
            :week-days="weekDays"
            :week-start="weekStart"
            :events="events"
            :slide-direction="slideDirection"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.transition-bg {
  transition: background-color 0.2s;
}
.photo-bg {
  background-color: #000;
}
.calendar-bg {
  background-color: #fff;
}

/* Slide transition */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s;
  position: absolute;
  width: 100%;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>