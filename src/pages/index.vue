<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";

const app = useAppStore()

onMounted(() => {
  app.init().then(() => {
    app.loadDeviceInfo()
  })
})

</script>

<template>
  <div v-if="!app.loaded">
    <v-progress-circular indeterminate />
  </div>
  <div v-if="app.loaded" class="flex flex-col items-center justify-center">
    <v-card v-for="device in app.discoveredDevices">
      <v-card-title>{{ device.name }}</v-card-title>
      <v-card-subtitle>{{ device.ip }}</v-card-subtitle>
      <v-card-text>
        {{ app.getDeviceInfo(device.ip)?.Ok?.model_name }}
      </v-card-text>
      <v-card-actions>
        <v-btn :to="`/device/${device.ip}`" color="primary" :disabled="!app.deviceInfoLoaded || !app.deviceInfo[device.ip] || !!app.deviceInfo[device.ip].Err">Manage</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
</style>