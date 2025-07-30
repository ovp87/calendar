<template>
  <!-- Mobile weekday header -->
  <div class="grid grid-cols-7 text-sm/6 text-gray-500 sm:hidden">
    <button
        v-for="(day, i) in weekDays"
        :key="i"
        type="button"
        class="flex flex-col items-center pt-2 pb-3 capitalize"
    >
      <span :class="{
          'text-indigo-600': day.toDateString() === (new Date()).toDateString(),
          'text-gray-900': day.toDateString() !== (new Date()).toDateString()
        }">
        {{ day.toLocaleDateString('nb-NO', { weekday: 'long' }) }}
        {{ day.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit'}) }}
      </span>
    </button>
  </div>

  <!-- Desktop weekday header -->
  <div class="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm/6 text-gray-500 sm:grid">
    <div class="col-end-1 w-14" />
    <div
        v-for="(day, i) in weekDays"
        :key="i"
        class="flex items-center justify-center py-3"
    >
      <span class="flex items-baseline capitalize relative" :class="{
          'text-indigo-600': day.toDateString() === (new Date()).toDateString(),
          'text-gray-900': day.toDateString() !== (new Date()).toDateString()
        }">
        {{ day.toLocaleDateString('nb-NO', { weekday: 'long' }) }}
        {{ day.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit' }) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ weekDays: Date[] }>()
</script>