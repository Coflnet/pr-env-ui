<script setup lang="ts">

const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()

const { loggedIn, user, login, logout } = useOidcAuth()
console.log(user)
console.log({ loggedIn })
console.log(user.value.userInfo.email)

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true
  }], [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/settings'
  }, {
    label: 'Command menu',
    icon: 'i-heroicons-command-line',
    shortcuts: [metaSymbol.value, 'K'],
    click: () => {
      isDashboardSearchModalOpen.value = true
    }
  }, {
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    shortcuts: ['?'],
    click: () => isHelpSlideoverOpen.value = true
  }], [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open',
    to: 'https://ui.nuxt.com/pro/getting-started',
    target: '_blank'
  }, {
    label: 'GitHub repository',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/Coflnet/pr-env',
    target: '_blank'
  },],
  [{
    label: loggedIn ? 'Sign out' : 'Sign in',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => {
      if (loggedIn)
        logout()
      else
        login()
    }
  }]
])


const userNameOrGuestName = computed(() => {
  if (loggedIn)
    return user.value.userInfo.email as string;
  return "not logged in";
});

</script>

<template>
  <UDropdown mode="hover" :items="items" :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }" class="w-full">
    <template #default="{ open }">
      <UButton color="gray" variant="ghost" class="w-full" :label="userNameOrGuestName"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']">

        <!--
        <template #leading>
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="2xs" />
        </template>
-->

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <div v-if="loggedIn">
          <p>
            Signed in as
          </p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ user.userInfo.email }}
          </p>
        </div>
        <p v-else>
          Not signed in
        </p>
      </div>
    </template>
  </UDropdown>
</template>
