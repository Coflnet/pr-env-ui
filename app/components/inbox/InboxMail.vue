<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useGithubStore } from '../../stores/github.ts'

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
  editModeActive: {
    type: Boolean,
    default: false
  }
})

const githubStore = useGithubStore()
const { repositories } = storeToRefs(githubStore)

console.log(repositories)
const repositoryDropDownList = computed(() => {
  return repositories.value.map((repo: any) => {
    return `${repo.owner}/${repo.name}`;
  });
})

const emits = defineEmits(["submit", "switchEditMode", "deleteEnvironment"]);

function validate(state: any): FormError[] {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  return errors
}

const title = computed(() => {
  if (props.createNewEnvironment) {
    return 'Create Environment'
  }

  return "View Environment";

});

const readModeActive = computed(() => {
  if (props.createNewEnvironment)
    return false;
  return !props.formState.editMode;
});

const saveButtonLabel = computed(() => {
  if (props.createNewEnvironment)
    return "Create Environment";

  if (props.editModeActive)
    return "Edit Environment";

  return "View Environment";
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

        <UFormGroup name="name" label="Name" description="The display name of the Preview Environment" required
          class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
          <UInput v-model="props.formState.name" autocomplete="off" size="md" :disabled="readModeActive" />
        </UFormGroup>

        <UFormGroup name="Github Repositories" description="Select the repository you want to use" v-if="repositories"
          class="grid grid-cols-2 gap-2" label="Github Repository" :ui="{ container: '' }">
          <USelect :options="repositoryDropDownList" :disabled="readModeActive" size="md" autocomplete="off"
            v-model="props.formState.gitRepositoryCombined" />
        </UFormGroup>

        <div v-else>
          <UFormGroup name="email" label="Github Owner" description="The organization name or the username"
            class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
            <UInput v-model="props.formState.gitOrganization" autocomplete="off" size="md" :disabled="readModeActive" />
          </UFormGroup>

          <UFormGroup name="email" label="Github Owner" description="Use the format <owner>/<repository>"
            class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
            <UInput v-model="props.formState.gitRepository" autocomplete="off" size="md" :disabled="readModeActive" />
          </UFormGroup>
        </div>

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
