<script setup lang="ts">

import {useAppStore} from "@/stores/app.ts";
import {getSignalInfo, getZoneStatus, toggleZonePower} from "@/ipc/yamaha.ts";
import {SignalInfo, ZoneStatus} from "@/ipc/models.ts";
import VolumeControl from "@/components/VolumeControl.vue";

const app = useAppStore()
const deviceId = useRoute().params.id as string
const device = app.getDeviceById(deviceId)!
const deviceInfo = app.getDeviceInfo(deviceId).Ok!

let timer: ReturnType<typeof setInterval>;
let zoneStatus = ref<ZoneStatus>();
let signalInfo = ref<SignalInfo>();

const isOn = computed(() => zoneStatus.value?.power === 'on')

async function refreshDeviceInfo() {
  zoneStatus.value = await getZoneStatus(deviceId)
  signalInfo.value = await getSignalInfo(deviceId)
}

onMounted(() => {
  refreshDeviceInfo()
  timer = setInterval(() => refreshDeviceInfo(), 1000)
})

onUnmounted(() => clearInterval(timer))

function togglePower() {
  toggleZonePower(deviceId).catch(console.error)
}

</script>

<template>
  <div class="d-flex flex-column items-center justify-center ga-4 sm:ga-6 lg:ga-8 flex-grow-1">
    <v-btn to="/">Back</v-btn>
    <AvrCard :device="device" :info="deviceInfo" page-mode @togglePower="togglePower" :is-on="isOn"/>

    <v-card>
      <volume-control :zone-status="zoneStatus" :device-id="deviceId" :disabled="!isOn"/>
    </v-card>

    <v-card>
      <v-card-title>Zone Status</v-card-title>
      <avr-settings :zone-status="zoneStatus" :device-id="deviceId" class="pa-3" :disabled="!isOn"/>
    </v-card>

    <v-card>
      <v-card-title>Signal Info</v-card-title>
      <v-card-text>
        {{ signalInfo }}
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>

</style>