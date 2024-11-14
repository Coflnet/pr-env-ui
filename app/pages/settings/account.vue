<script setup lang="ts">
</script>

<template>
  <UDashboardPanelContent class="pb-24">

    <UDashboardSection>
      <UFormGroup name="email" label="Github"
        description="This is a link to the Github App, here you can specify the repositories you can select"
        class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
        <ULink to='https://github.com/apps/preview-environment-operator' target='_blank'>Github App</ULink>
      </UFormGroup>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>
