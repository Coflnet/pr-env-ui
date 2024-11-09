<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'


const props = defineProps({
  formState: {
    type: Object,
    required: true,
  },
  createNewEnvironment: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(["submit", "switchEditMode", "deleteEnvironment"]);

function validate(state: any): FormError[] {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  if (!state.gitRepository) errors.push({ path: 'gitRepository', message: 'Please enter a repository name' })
  if (!state.gitOrganization) errors.push({ path: 'gitOrganization', message: 'Please enter a organization/username' })
  return errors
}

const mode = ref(props.createNewEnvironment ? 'create' : 'view');

const title = computed(() => {
  if (mode.value === 'view') {
    return 'View Environment'
  } else if (mode.value === 'edit') {
    return 'Edit Environment'
  } else if (mode.value === 'create') {
    return 'Create Environment'
  }
});

const readModeActive = computed(() => {
  return props.formState.editMode === false;
});

const switchMode = () => {
  emits('switchEditMode');
}

const switchModeLabel = computed(() => {
  if (props.formState.editMode)
    return 'Read-only'
  return 'Edit'
});

const saveButtonLabel = computed(() => {
  if (props.createNewEnvironment)
    return "Create";
  return "Edit";
})

function onSubmit(event: FormSubmitEvent<any>) {
  emits('submit', event.data);
}

function deleteEnv() {
  emits('deleteEnvironment')
}

</script>

<template>

  <UDashboardPanelContent class="pb-24">
    <UForm :state="props.formState" :validate="validate" :validate-on="['submit']" @submit="onSubmit">
      <UDashboardSection :title>
        <template #links>
          <UButton :label="switchModeLabel" color="black" @click="switchMode" v-if="!props.createNewEnvironment" />
        </template>

        <UFormGroup name="name" label="Name" description="The display name of the Preview Environment" required
          class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput v-model="props.formState.name" autocomplete="off" size="md" :disabled="readModeActive" />
        </UFormGroup>

        <UFormGroup name="email" label="Github Owner" description="The organization name or the username" required
          class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
          <UInput v-model="props.formState.gitOrganization" autocomplete="off" size="md" :disabled="readModeActive" />
        </UFormGroup>

        <UFormGroup name="email" label="Github Owner" description="Use the format <owner>/<repository>" required
          class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
          <UInput v-model="props.formState.gitRepository" autocomplete="off" size="md" :disabled="readModeActive" />
        </UFormGroup>
      </UDashboardSection>

      <UDivider />

      <UDashboardSection>
        <template #links>
          <UButton label="Delete" color="red" v-if="!props.createNewEnvironment" @click="deleteEnv" />
          <UButton :label="saveButtonLabel" type="submit" :disabled="readModeActive" />
        </template>
      </UDashboardSection>

    </UForm>
  </UDashboardPanelContent>
</template>
