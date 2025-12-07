<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import {useUserData} from "@/stores/userDataStore.ts";
import { useTheme } from "vuetify";

const theme = useTheme()
const user = useUserData()

function applyTheme() {
  if (user.theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.global.name.value = isDark ? 'dark' : 'light'
  } else {
    theme.global.name.value = user.theme
  }
}

applyTheme()

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (user.theme === 'system') applyTheme()
})
watch(() => user.theme, () => applyTheme())

</script>
