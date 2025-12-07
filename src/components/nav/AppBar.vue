<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";
import {useUserData} from "@/stores/userDataStore.ts";

const drawer = ref(false)
const app = useAppStore()
const user = useUserData()
</script>

<template>
  <v-app-bar class="pr-3">
    <v-app-bar-nav-icon @click="drawer = !drawer" class="mr-3"/>
    <app-title/>
    <slot/>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" app temporary absolute width="300" class="d-flex flex-column">
    <div class="d-flex ga-2 justify-center align-center pa-2">
      <v-icon icon="mdi-theme-light-dark" size="24px" />
      <span>Theme </span>
      <v-select v-model="user.theme" :items="['system', 'dark', 'light']" density="compact" hide-details variant="solo-filled"></v-select>
    </div>
    <v-divider></v-divider>
    <v-list-item title="MusicCast Desktop" to="/"></v-list-item>
    <v-divider></v-divider>
    <v-list-item link :title="device.name" v-for="device in app.manageableDevices()"
                 :to="`/device/${device.ip}`"></v-list-item>
  </v-navigation-drawer>
</template>

<style scoped>

</style>