<script setup lang="ts">
const teams = [{
  label: 'Preview Environments',
}]

const actions = [{
  label: 'Create team',
  icon: 'i-heroicons-plus-circle'
}, {
  label: 'Manage teams',
  icon: 'i-heroicons-cog-8-tooth'
}]

const team = ref(teams[0])
</script>

<template>
  <UDropdown v-slot="{ open }" mode="hover" :items="[teams, actions]" class="w-full" :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }">
    <UButton color="gray" variant="ghost" :class="[open && 'bg-gray-50 dark:bg-gray-800']" class="w-full">
      <span class="truncate text-gray-900 dark:text-white font-semibold">{{ team.label }}</span>
    </UButton>
  </UDropdown>
</template>
