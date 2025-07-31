<script setup lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid"
  import {CalendarDaysIcon, NumberedListIcon, PhotoIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/outline";
  import { computed } from "vue";
  import { getWeekNumber } from "../utils/calendarUtils.ts";

  const emit = defineEmits(['next-week', 'prev-week', 'set-mode', 'reset-week']);

  const props = defineProps<{
    mode: 'weekly-calendar' | 'weekly-list' | 'photo',
    showWeekNumber?: boolean,
    weekNumber: number,
  }>();

  const currentWeekNumber = getWeekNumber(new Date());
  const showWeekNumber = computed(() => props.showWeekNumber ?? true)
</script>

<template>
  <div class="relative w-full mb-8">
    <div class="gap-x-4 absolute top-4 right-0 flex items-center justify-end px-4">
      <button @click="emit('set-mode', 'photo')" type="button">
        <span class="sr-only">Photo slideshow</span>
        <PhotoIcon :class="[props.mode === 'photo' ? 'text-blue-600' : 'text-gray-500']" class="h-12 w-12" />
      </button>
      <button @click="emit('set-mode', 'weekly-list')" type="button">
        <span class="sr-only">Weekly list view</span>
        <NumberedListIcon :class="[props.mode === 'weekly-list' ? 'text-blue-600' : 'text-gray-500']" class="h-12 w-12" />
      </button>
      <button @click="emit('set-mode', 'weekly-calendar')" type="button">
        <span class="sr-only">Weekly calendar view</span>
        <CalendarDaysIcon :class="[props.mode === 'weekly-calendar' ? 'text-blue-600' : 'text-gray-500']" class="h-12 w-12" />
      </button>

    </div>
    <div v-if="showWeekNumber" class="flex items-center justify-center gap-2 mt-4">
      <button @click="emit('prev-week')" type="button" class="cursor-pointer flex h-9 w-12 items-center justify-center rounded-l-md border border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
        <span class="sr-only">Previous week</span>
        <ChevronLeftIcon class="size-5" aria-hidden="true" />
      </button>
      <h1 class="text-4xl text-center mx-4">Uke {{ weekNumber }}</h1>
      <button @click="emit('reset-week')" v-if="weekNumber !== currentWeekNumber" type="button" class="cursor-pointer">
        <ArrowLeftStartOnRectangleIcon class="h-10 w-10"></ArrowLeftStartOnRectangleIcon>
      </button>
      <button @click="emit('next-week')" type="button" class="cursor-pointer flex h-9 w-12 items-center justify-center rounded-r-md border border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
        <span class="sr-only">Next week</span>
        <ChevronRightIcon class="size-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

