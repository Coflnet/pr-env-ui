<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { previewEnvironmentModel } from '#openapi-types'

const props = defineProps({
  formState: {
    type: Object as PropType<previewEnvironmentModel>,
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
const { loadRepositoriesOfUser } = githubStore
const { repositories } = storeToRefs(githubStore)
await loadRepositoriesOfUser()

const repositoryOwners = computed(() => {
  return [...new Set(repositories.value.map((repo) => repo.owner))]
})

const repositoriesOfOwner = computed(() => {
  if (!props.formState.gitSettings.organization)
    return []

  return repositories.value
    .filter((repo) => repo.owner === props.formState.gitSettings.organization)
    .map((repo) => repo.name)
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
  return !props.editModeActive;
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

function addEnv() {
  props.formState.applicationSettings.environmentVariables.push({ key: '', value: '' })
}

function removeEnv() {
  props.formState.applicationSettings.environmentVariables.pop()
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

        <UFormGroup name="Github User / Organization" description="Select the user / organization of the repository"
          v-if="repositories" class="grid grid-cols-2 gap-2" label="Github Repository" :ui="{ container: '' }">
          <USelect :options="repositoryOwners" :disabled="readModeActive" size="md" autocomplete="off"
            v-model="props.formState.gitSettings.organization" />
        </UFormGroup>

        <UFormGroup name="Github Repositoriy" description="Select the repository you want to use" v-if="repositories"
          class="grid grid-cols-2 gap-2" label="Github Repository" :ui="{ container: '' }">
          <USelect :options="repositoriesOfOwner" :disabled="readModeActive" size="md" autocomplete="off"
            v-model="props.formState.gitSettings.repository" />
        </UFormGroup>

        <div v-else>
          <UFormGroup name="email" label="Github Owner" description="The organization name or the username"
            class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
            <UInput v-model="props.formState.gitSettings.organization" autocomplete="off" size="md"
              :disabled="readModeActive" />
          </UFormGroup>

          <UFormGroup name="email" label="Github Owner" description="Use the format <owner>/<repository>"
            class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
            <UInput v-model="props.formState.gitSettings.repository" autocomplete="off" size="md"
              :disabled="readModeActive" />
          </UFormGroup>
        </div>

        <UFormGroup name="port" label="Port" description="The port the application will be running on" required
          class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
          <UInput v-model="props.formState.applicationSettings.port" autocomplete="off" size="md"
            :disabled="readModeActive" />
        </UFormGroup>

        <UFormGroup name="buildAllPullRequests" label="Build all Pull Requests"
          description="If enabled, all pull requests will be built and deployed" class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }">
          <UCheckbox v-model="props.formState.buildSettings.buildAllPullRequests" :disabled="readModeActive" />
        </UFormGroup>

        <UFormGroup name="buildAllPullBranches" label="Build all Branches"
          description="If enabled, all branches that are detected will be built and deployed"
          class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
          <UCheckbox v-model="props.formState.buildSettings.buildAllBranches" :disabled="readModeActive" />
        </UFormGroup>

        <UFormGroup name="environmentVariables" label="Environment Variables"
          description="Add environment variables that should be available in the container"
          class="grid grid-cols-2 gap-2" :ui="{ container: '' }">

          <div v-for="e in props.formState.applicationSettings.environmentVariables">
            <UFormGroup name="key" label="Key" class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
              <UInput autocomplete="off" size="md" v-model="e.key" :disabled="readModeActive" />
            </UFormGroup>
            <UFormGroup name="value" label="Value" class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
              <UInput autocomplete="off" size="md" v-model="e.value" :disabled="readModeActive" />
            </UFormGroup>
          </div>

          <div class="p-3" />
          <UButton label="Add Environment Variable" color="primary" size="sm" :disabled="readModeActive"
            @click="addEnv" />
          <UButton label="Remove Environment Variable" color="red" size="sm" :disabled="readModeActive"
            @click="removeEnv" />
        </UFormGroup>
      </UDashboardSection>

      <UDivider class="p-5" />

      <UFormGroup name="command" label="Command Override"
        description="Override the command of the application/container" class="grid grid-cols-2 gap-2"
        :ui="{ container: '' }">
        <UInput autocomplete="off" size="md" v-model="props.formState.applicationSettings.command"
          :disabled="readModeActive" />
      </UFormGroup>


      <UDivider class="p-5" />

      <UDashboardSection>
        <template #links>
          <UButton label="Delete" color="red" v-if="!props.createNewEnvironment" @click="deleteEnv" />
          <UButton :label="saveButtonLabel" type="submit" :disabled="readModeActive" />
        </template>
      </UDashboardSection>

    </UForm>
  </UDashboardPanelContent>
</template>
