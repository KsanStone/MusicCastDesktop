<script setup lang="ts">

import {useAppStore} from "@/stores/app.ts";
import {getNetUsbPlayInfo, getSignalInfo, getZoneStatus, toggleZonePower} from "@/ipc/yamaha.ts";
import {DeviceFeatures, NetUsbPlayInfo, SignalInfo, Zone, ZoneStatus} from "@/ipc/models.ts";
import VolumeControl from "@/components/VolumeControl.vue";
import PlaybackCard from "@/components/PlaybackCard.vue";
import NetUsbListBrowser from "@/components/NetUsbListBrowser.vue";

const app = useAppStore()
const deviceId = useRoute().params.id as string

onBeforeRouteUpdate((_to, _from, next) => {
  if (!app.deviceManageable(deviceId)) return next('/')
  next()
})

const device = app.getDeviceById(deviceId)!
const deviceInfo = app.getDeviceInfo(deviceId).Ok!

let timer: ReturnType<typeof setInterval>;
const zoneStatus = ref<ZoneStatus>();
const signalInfo = ref<SignalInfo>();
const features = ref<DeviceFeatures>();
const netUsbPlayInfo = ref<NetUsbPlayInfo>();

const isOn = computed(() => zoneStatus.value?.power === 'on')
const zone = computed(() => features.value?.zone?.find((z: Zone) => z.id === "main"))
// const inputInfo = computed(() => features.value?.system.input_list.find(x => x.id == zoneStatus.value?.input))

async function refreshDeviceInfo() {
  zoneStatus.value = await getZoneStatus(deviceId)
  signalInfo.value = await getSignalInfo(deviceId)
  netUsbPlayInfo.value = await getNetUsbPlayInfo(deviceId)
}

onMounted(() => {
  app.getDeviceFeatures(deviceId).then(f => features.value = f).catch(console.error)
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
      <volume-control :zone-status="zoneStatus" :device-id="deviceId" :disabled="!isOn" :range-step="zone?.range_step ?? []"/>
    </v-card>

    <v-card>
      <PlaybackCard :device-ip="deviceId" :signal-info="signalInfo" :zone-status="zoneStatus" :net-usb-play-info="netUsbPlayInfo"/>
    </v-card>

    <v-card>
      <input-selector :features="features" :zone="zone" :zone-status="zoneStatus" :device-id="deviceId"/>
    </v-card>

    <v-card v-if="zoneStatus?.power === 'on'">
      <net-usb-list-browser :device-id="deviceId" :input="zoneStatus?.input" v-if="zoneStatus?.input"/>
    </v-card>

    <v-card>
      <avr-settings :zone-status="zoneStatus" :device-id="deviceId" class="pa-3" :disabled="!isOn" :zone="zone"/>
    </v-card>
  </div>
</template>

<style scoped>

</style>