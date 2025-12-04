<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";

const app = useAppStore()
</script>

<template>
  <v-app-bar>
    <app-title/>
    <v-btn prepend-icon="mdi-refresh" @click="app.refresh()" variant="tonal" :disabled="!app.loaded">Re-discover devices</v-btn>
  </v-app-bar>
</template>

<style scoped>

</style>