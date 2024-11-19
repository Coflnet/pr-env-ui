<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { previewEnvironmentModel } from '#openapi-types'

const props = defineProps<{
  env: previewEnvironmentModel
}>();

const previewEnvironmentStore = usePreviewEnvironmentInstanceStore()

const { instances } = storeToRefs(previewEnvironmentStore);
const { loadInstances } = previewEnvironmentStore;

if (props.env?.id)
  await loadInstances(props.env.id);

watch(props.env, async (newVal) => {
  if (newVal.id)
    await loadInstances(newVal.id);
})

const displayColumns = [
  {
    key: "currentPhase",
    label: "Phase",
  },
  {
    key: 'instanceGitSettings.branch',
    label: 'Git Branch'
  },
  {
    key: 'publicFacingUrl',
    label: "Preview URL",
  }
]

</script>

<template>

  <UDashboardPanelContent class="pb-24" v-if="instances">
    <UDashboardSection title="Instances" description="Here are the instances for "
      :links="[{ label: 'Save changes', color: 'black' }]" />

    <UDivider />

    <UTable :rows="instances" :columns="displayColumns" />
  </UDashboardPanelContent>

  <UDashboardPanelContent class="pb-24" v-else>
    <UDashboardSection title="Instances" description="No instances found" />
  </UDashboardPanelContent>
</template>
