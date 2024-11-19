<script setup lang='ts'>
import { usePreviewEnvironmentStore } from '../stores/previewenvironment'
import type { previewEnvironmentModel } from '#openapi-types'
import { storeToRefs } from 'pinia'

const previewEnvironmentStore = usePreviewEnvironmentStore()
const { refreshEnvs, createEnv, deleteEnv } = previewEnvironmentStore
const { envs } = storeToRefs(previewEnvironmentStore);

await refreshEnvs()


const toast = useToast()

const tabItems = [{
  label: 'All'
}, {
  label: 'Active'
}]
const selectedTab = ref(0)

const dropdownItems = [[]]

const filteredEnvironments = computed(() => {
  return envs.value;
})

const selectedEnvironment = ref<previewEnvironmentModel | null>()
const createNewEnvironment = ref(false);

const isMailPanelOpen = computed({
  get() {
    return !!selectedEnvironment.value
  },
  set(value: boolean) {
    if (!value) {
      selectedEnvironment.value = null
    }
  }
})

watch(selectedEnvironment, (selectedEnv) => {
  selectedEnvironmentTab.value = 0;

  if (selectedEnv) {
    createNewEnvironment.value = false;
    formState.value = selectedEnv;
  } else {
    resetFormState();
  }
});

function resetFormState() {
  formState.value = {
    id: '',
    name: '',
    gitSettings: {
      repository: '',
      organization: ''
    },
    applicationSettings: {
      port: 80,
      environmentVariables: [],
      command: ''
    },
    containerSettings: {
    },
    buildSettings: {
      buildAllPullRequests: true,
      buildAllBranches: false,
    }
  }
}

function prepareCreateNewEnv() {
  selectedEnvironment.value = null;
  createNewEnvironment.value = true;
  console.log("create new env");
  console.log(selectedEnvironmentTab)
}

const formState = ref<previewEnvironmentModel>();
resetFormState();

const editMode = ref(false);

function switchEditMode() {
  editMode.value = !editMode.value;
}

async function saveEnvironment(_: any) {

  if (!createNewEnvironment.value) {
    toast.add({ title: 'Environment updates are not available right now', icon: 'i-heroicons-check-circle' })
    return;
  }

  toast.add({ title: 'Saving environment..', icon: 'i-heroicons-refresh', color: 'blue' })

  try {
    await createEnv(formState.value)

    toast.add({ title: 'Environment updated', icon: 'i-heroicons-check-circle', color: 'green' })
  } catch (e) {
    toast.add({ title: 'Failed to update environment', icon: 'i-heroicons-x-mark', color: 'red' })
    console.error(e);
  }
}

async function deleteEnvironment() {
  if (!selectedEnvironment.value) {
    return;
  }

  try {
    await deleteEnv(selectedEnvironment.value)
    toast.add({ title: 'Environment deleted', icon: 'i-heroicons-check-circle', color: 'green' })
  } catch (e) {
    toast.add({ title: 'Failed to delete environment', icon: 'i-heroicons-x-mark', color: 'red' })
    console.log({ e })
  }
}

const switchModeLabel = computed(() => {
  if (editMode.value)
    return 'Read-only'
  return 'Edit'
});


// envionment tabs
const environmentTabs = [{
  label: 'General',
}, {
  label: 'Instances',
}]

const selectedEnvironmentTab = ref(0)

function onEnvironmentTabChange(index: number) {
  selectedEnvironmentTab.value = index;
}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="inbox" :width="800" :resizable="{ min: 300, max: 800 }">
      <UDashboardNavbar title="Environments" :badge="envs?.length ?? 0">
        <template #right>
          <UTabs v-model="selectedTab" :items="tabItems"
            :ui="{ wrapper: '', list: { height: 'h-9', tab: { height: 'h-7', size: 'text-[13px]' } } }" />

          <!-- create a new environment -->
          <UButton icon="i-heroicons-plus" size="md" class="ml-1.5 rounded-full" @click="prepareCreateNewEnv" />
        </template>
      </UDashboardNavbar>

      <PreviewenvironmentEnvironmentList v-model="selectedEnvironment" :envs="filteredEnvironments" />
    </UDashboardPanel>

    <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
      <template v-if="selectedEnvironment || createNewEnvironment">
        <UDashboardNavbar>
          <template #toggle>
            <UDashboardNavbarToggle icon="i-heroicons-x-mark" />

            <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
          </template>

          <template #left>
            <UTabs :items="environmentTabs" @change="onEnvironmentTabChange" v-model="selectedEnvironmentTab" />
            <UDivider orientation="vertical" class="mx-1.5" />
          </template>

          <template #right>
            <UButton :label="switchModeLabel" color="black" @click="switchEditMode" v-if="!createNewEnvironment" />
            <UDivider orientation="vertical" class="mx-1.5" />
            <UDropdown :items="dropdownItems">
              <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
            </UDropdown>
          </template>
        </UDashboardNavbar>

        <PreviewenvironmentEnvironmentDetails :formState="formState" :createNewEnvironment @submit="saveEnvironment"
          v-if="selectedEnvironmentTab == 0" @deleteEnvironment="deleteEnvironment" :editModeActive="editMode" />

        <PreviewenvironmentInstanceList v-if="selectedEnvironmentTab == 1" :env="selectedEnvironment" />

      </template>
      <div v-else class="flex-1 hidden lg:flex items-center justify-center">
        <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
        <p>nothing selected, bro</p>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
