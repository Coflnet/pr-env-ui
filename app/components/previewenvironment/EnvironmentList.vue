<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { previewEnvironmentModel } from '#openapi-types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<previewEnvironmentModel | null>,
    default: null
  },
  envs: {
    type: Array<previewEnvironmentModel>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const envsRefs = ref<Element[]>([])

const selectedEnv = computed({
  get() {
    return props.modelValue
  },
  set(value: previewEnvironmentModel | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedEnv, () => {
  if (!selectedEnv.value) {
    return
  }

  const ref = envsRefs.value[selectedEnv.value.name]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.envs.findIndex(envs => envs.name === selectedEnv.value?.name)

    if (index === -1) {
      selectedEnv.value = props.envs[0]
    } else if (index < props.envs.length - 1) {
      selectedEnv.value = props.envs[index + 1]
    }
  },
  arrowup: () => {
    const index = props.envs.findIndex(env => env.name === selectedEnv.value?.name)

    if (index === -1) {
      selectedEnv.value = props.envs[props.envs.length - 1]
    } else if (index > 0) {
      selectedEnv.value = props.envs[index - 1]
    }
  }
})
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div v-for="(env, index) in envs" :key="index">
      <div class="p-4 text-sm cursor-pointer border-l-2"
        :class="[env?.name ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
        selectedEnv && selectedEnv.name === env?.name ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10']"
        @click="selectedEnv = env">
        <div class="flex items-center justify-between" :class="[env?.name && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ env?.name }}
          </div>

          <span>{{ isToday(new Date()) ? format(new Date(), 'HH:mm') : format(new Date(), 'dd MMM') }}</span>
        </div>
        <p :class="[env?.name && 'font-semibold']">
          {{ env?.name }}
        </p>
        <p class="text-gray-400 dark:text-gray-500 line-clamp-1">
          {{ env?.name }}
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
