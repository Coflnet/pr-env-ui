<script setup lang='ts'>
import type { PreviewEnvironment } from '~/types'
import { usePreviewEnvironmentStore } from '../stores/previewenvironment'

const { user } = useOidcAuth();

console.log({ user })

const { envs, refreshEnvs, createEnv } = usePreviewEnvironmentStore()
await refreshEnvs()
console.log(envs)


const toast = useToast()

const tabItems = [{
  label: 'All'
}, {
  label: 'Active'
}]
const selectedTab = ref(0)

const dropdownItems = [[{
  label: 'Mark as unread',
  icon: 'i-heroicons-check-circle'
}, {
  label: 'Mark as important',
  icon: 'i-heroicons-exclamation-circle'
}], [{
  label: 'Star thread',
  icon: 'i-heroicons-star'
}, {
  label: 'Mute thread',
  icon: 'i-heroicons-pause-circle'
}]]

const filteredEnvironments = computed(() => {
  return envs;
})

const selectedEnvironment = ref<PreviewEnvironment | null>()
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
  if (selectedEnv) {
    createNewEnvironment.value = false;
    formState.name = selectedEnv.name;
    formState.gitOrganization = selectedEnv.gitSettings.organization;
    formState.gitRepository = selectedEnv.gitSettings.repository;
    formState.editMode = false;
  } else {
    formState.name = '';
    formState.gitOrganization = '';
    formState.gitRepository = '';
    formState.editMode = true;
  }
});

function prepareCreateNewEnv() {
  selectedEnvironment.value = null;
  createNewEnvironment.value = true;
}

const formState = reactive({
  name: 'Test Repo',
  gitOrganization: 'Flou21',
  gitRepository: 'test-page',
  editMode: false,
});



function switchEditMode() {
  formState.editMode = !formState.editMode;
  console.log(`switching to ${formState.editMode}`);
}

async function saveEnvironment(_: any) {

  if (!createNewEnvironment.value) {
    toast.add({ title: 'Environment updates are not available right now', icon: 'i-heroicons-check-circle' })
    return;
  }

  try {
    await createEnv({
      name: formState.name,
      gitSettings: {
        organization: formState.gitOrganization,
        repository: formState.gitRepository,
      },
      containerSettings: {
        image: 'muehlhansfl',
        registry: 'index.docker.io',
      },
      applicationSettings: {
        hostname: 'preview.flou.dev',
        port: 80,
      },
    })
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
    await usePreviewenvironments('/environment/{name}', {
      method: 'DELETE',
      path: {
        name: selectedEnvironment.value.name,
      }
    })

    toast.add({ title: 'Environment deleted', icon: 'i-heroicons-check-circle', color: 'green' })
  } catch (e) {
    toast.add({ title: 'Failed to delete environment', icon: 'i-heroicons-x-mark', color: 'red' })
  }
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

      <!-- ~/components/inbox/InboxList.vue -->
      <InboxList v-model="selectedEnvironment" :envs="filteredEnvironments" />
    </UDashboardPanel>

    <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
      <template v-if="selectedEnvironment || createNewEnvironment">
        <UDashboardNavbar>
          <template #toggle>
            <UDashboardNavbarToggle icon="i-heroicons-x-mark" />

            <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
          </template>

          <template #left>
            <UTooltip text="Archive">
              <UButton icon="i-heroicons-archive-box" color="gray" variant="ghost" />
            </UTooltip>

            <UTooltip text="Move to junk">
              <UButton icon="i-heroicons-archive-box-x-mark" color="gray" variant="ghost" />
            </UTooltip>

            <UDivider orientation="vertical" class="mx-1.5" />

            <UPopover :popper="{ placement: 'bottom-start' }">
              <template #default="{ open }">
                <UTooltip text="Snooze" :prevent="open">
                  <UButton icon="i-heroicons-clock" color="gray" variant="ghost"
                    :class="[open && 'bg-gray-50 dark:bg-gray-800']" />
                </UTooltip>
              </template>

              <template #panel="{ close }">
                <DatePicker @close="close" />
              </template>
            </UPopover>
          </template>

          <template #right>
            <UTooltip text="Reply">
              <UButton icon="i-heroicons-arrow-uturn-left" color="gray" variant="ghost" />
            </UTooltip>

            <UTooltip text="Forward">
              <UButton icon="i-heroicons-arrow-uturn-right" color="gray" variant="ghost" />
            </UTooltip>

            <UDivider orientation="vertical" class="mx-1.5" />

            <UDropdown :items="dropdownItems">
              <UButton icon="i-heroicons-ellipsis-vertical" color="gray" variant="ghost" />
            </UDropdown>
          </template>
        </UDashboardNavbar>

        <!-- ~/components/inbox/InboxMail.vue -->
        <InboxMail :formState="formState" :createNewEnvironment @submit="saveEnvironment"
          @switchEditMode='switchEditMode' @deleteEnvironment="deleteEnvironment" />
      </template>
      <div v-else class="flex-1 hidden lg:flex items-center justify-center">
        <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
        <p>nothing selected, bro</p>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
