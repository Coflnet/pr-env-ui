<script setup lang="ts">
import type { PreviewEnvironment } from '~/types'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  env: PreviewEnvironment
}>();

const previewEnvironmentStore = usePreviewEnvironmentInstanceStore()

const { instances } = storeToRefs(previewEnvironmentStore);
const { loadInstances } = previewEnvironmentStore;

await loadInstances(props.env.id);

const displayColumns = [
  {
    key: 'gitSettings.branch',
    label: 'Git Branch'
  },
  {
    key: 'publicFacingUrl',
    label: "Preview URL",
  }
]

</script>

<template>

  <UDashboardPanelContent class="pb-24">
    <UDashboardSection title="Instances" description="Here are the instances for "
      :links="[{ label: 'Save changes', color: 'black' }]" />

    <UDivider />

    <UTable :rows="instances" :columns="displayColumns" />
  </UDashboardPanelContent>
</template>
