<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";

const app = useAppStore()
</script>

<template>
  <AppBar>
    <div class="d-flex flex-row justify-end items-center ga-3">
      <AddFixedAmpDialog />
      <v-btn prepend-icon="mdi-refresh" @click="app.refresh()" variant="tonal" :disabled="!app.loaded">Re-discover
        devices
      </v-btn>
    </div>
  </AppBar>
</template>

<style scoped>

</style>