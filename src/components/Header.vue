<script setup lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid"
  import {CalendarDaysIcon, NumberedListIcon } from "@heroicons/vue/24/outline";
  const emit = defineEmits(['setMode']);
  defineProps<{
    mode: 'weekly-calendar' | 'weekly-list'
    nextWeek: () => void
    prevWeek: () => void
    weekNumber: number,
  }>()
</script>

<template>
  <div class="relative w-full mb-8">
    <NumberedListIcon @click="emit('setMode', 'weekly-list')" :class="[mode === 'weekly-list' ? 'text-blue-600' : 'text-gray-500']" class="absolute top-0 right-18 h-20 w-20 cursor-pointer px-4" />
    <CalendarDaysIcon @click="emit('setMode', 'weekly-calendar')" :class="[mode === 'weekly-calendar' ? 'text-blue-600' : 'text-gray-500']" class="absolute top-0 right-2 h-20 w-20 cursor-pointer px-4" />
    <div class="flex items-center justify-center gap-2 mt-4">
      <button @click="prevWeek" type="button" class="flex h-9 w-12 items-center justify-center rounded-l-md border border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
        <span class="sr-only">Previous week</span>
        <ChevronLeftIcon class="size-5" aria-hidden="true" />
      </button>
      <h1 class="text-4xl text-center mx-4">Uke {{ weekNumber }}</h1>
      <button @click="nextWeek" type="button" class="flex h-9 w-12 items-center justify-center rounded-r-md border border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
        <span class="sr-only">Next week</span>
        <ChevronRightIcon class="size-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

