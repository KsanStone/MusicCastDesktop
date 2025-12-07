<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";
import {DiscoveredDevice} from "@/ipc/models.ts";
import {useUserData} from "@/stores/userDataStore.ts";

const app = useAppStore()
const userData = useUserData()

onMounted(() => {
  if (userData.manuallyAddedDevices.length > 0)
    app.loadDeviceInfo() // prefetch known devices
  app.init()
})


const manageableDevices = computed(() => app.manageableDevices())
const otherDevices = computed(() => app.discoveredDevices.filter((device: DiscoveredDevice) => !manageableDevices.value.includes(device)))

</script>

<template>
  <div class="d-flex flex-column items-center ga-4 sm:ga-6 lg:ga-8 flex-grow-1">
    <AvrCard v-for="device in userData.manuallyAddedDevices" :device="{ ip: device, name: '' }"
             :info="app.getDeviceInfo(device)?.Ok" can-delete @delete="userData.deleteDevice(device)"/>

    <div class="d-flex align-center" v-if="userData.manuallyAddedDevices.length > 0">
      <v-divider class="flex-grow-1"></v-divider>
      <span class="mx-3 text-caption text-medium-emphasis" style="white-space: nowrap;">Discovered Yamaha Devices</span>
      <v-divider class="flex-grow-1"></v-divider>
    </div>

    <v-empty-state v-if="app.discoveredDevices.length === 0 && app.loaded"
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

    <div>
      <v-empty-state
          icon="mdi-magnify"
          title="Discovering..."
          text="Searching for Yamaha devices in Your Network..."
          v-if="!app.loaded"

      >
        <div class="mt-4" style="width: 300px; height: 50px;">
          <v-progress-linear indeterminate/>
        </div>
      </v-empty-state>
    </div>
  </div>
</template>

<style scoped>
</style>