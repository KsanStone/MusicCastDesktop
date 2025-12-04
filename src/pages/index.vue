<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";
import {DiscoveredDevice} from "@/ipc/models.ts";

const app = useAppStore()

onMounted(() => {
  app.init()
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
    <div class="d-flex flex-column items-center ga-4 sm:ga-6 lg:ga-8"
         :class="{'flex-grow-1': app.discoveredDevices.length === 0}">
      <v-empty-state v-if="app.discoveredDevices.length === 0"
                     icon="mdi-magnify" title="No Devices Found"
                     text="No Yamaha devices found in your network.">
      </v-empty-state>

      <AvrCard v-for="device in manageableDevices" :device="device" :info="app.getDeviceInfo(device.ip)?.Ok"/>
      <div class="d-flex align-center" v-if="otherDevices.length > 0 && manageableDevices.length > 0">
        <v-divider class="flex-grow-1"></v-divider>
        <span class="mx-3 text-caption text-medium-emphasis" style="white-space: nowrap;">Other Yamaha Devices</span>
        <v-divider class="flex-grow-1"></v-divider>
      </div>
      <AvrCard v-for="device in otherDevices" :device="device"/>
    </div>
  </div>
</template>

<style scoped>
</style>