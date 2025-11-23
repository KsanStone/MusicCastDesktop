<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";
import {DiscoveredDevice} from "@/ipc/models.ts";

const app = useAppStore()

onMounted(() => {
  app.init().then(() => {
    app.loadDeviceInfo()
  })
})

const manageableDevices = computed(() => app.discoveredDevices
    .filter((device: DiscoveredDevice) => app.deviceInfoLoaded && app.deviceInfo[device.ip]?.Ok))
const otherDevices = computed(() => app.discoveredDevices.filter((device: DiscoveredDevice) => !manageableDevices.value.includes(device)))

</script>

<template>
  <div v-if="!app.loaded" class="d-flex justify-center align-center">
    <v-empty-state
        icon="mdi-magnify"
        title="Discovering..."
        text="Searching for Yamaha devices in Your Network..."
    >
      <div class="mt-4" style="width: 300px; height: 50px;">
        <v-progress-linear indeterminate/>
      </div>
    </v-empty-state>
  </div>
  <div v-else class="d-flex flex-column items-center ga-4 sm:ga-6 lg:ga-8 flex-grow-1">
    <v-sheet class="px-4 py-2 text-h6 font-weight-medium position-sticky top-0 bg-surface rounded">
      Discovered Devices
    </v-sheet>

    <AvrCard v-for="device in manageableDevices" :device="device" :info="app.getDeviceInfo(device.ip)?.Ok" />
    <div class="d-flex align-center" v-if="otherDevices.length > 0 && manageableDevices.length > 0">
      <v-divider class="flex-grow-1"></v-divider>
      <span class="mx-3 text-caption text-medium-emphasis" style="white-space: nowrap;">Other Yamaha Devices</span>
      <v-divider class="flex-grow-1"></v-divider>
    </div>
    <AvrCard v-for="device in otherDevices" :device="device" />
  </div>
</template>

<style scoped>
</style>