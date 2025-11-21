<script setup lang="ts">

import {useAppStore} from "@/stores/app.ts";
import {getSignalInfo, getZoneStatus} from "@/api/yamaha.ts";
import {SignalInfo, ZoneStatus} from "@/models/yamaha.ts";

const app = useAppStore()
const deviceId = useRoute().params.id
const device = app.getDeviceById(deviceId)
const deviceInfo = app.getDeviceInfo(deviceId).Ok!

const DEVICE_INFO_FIELDS = ['model_name', 'serial_number', 'system_version']
const ZONE_STATUS_FIELDS = ['power', 'input', 'input_text', 'sound_program', 'surr_decoder_type', 'pure_direct', 'enhancer', 'dialogue_level', 'dialogue_lift', 'subwoofer_volume', 'extra_bass', 'adaptive_drc', 'dts_dialogue_control', 'adaptive_dsp_level', 'party_enable']

let timer: ReturnType<typeof setInterval>;
let zoneStatus = ref<ZoneStatus>();
let signalInfo = ref<SignalInfo>();

async function refreshDeviceInfo() {
  zoneStatus.value = await getZoneStatus(deviceId)
  signalInfo.value = await getSignalInfo(deviceId)
}

onMounted(() => {
  refreshDeviceInfo()
  timer = setInterval(() => refreshDeviceInfo(), 5000)
})

onUnmounted(() => clearInterval(timer))

</script>

<template>
  <v-btn to="/">Back</v-btn>
  <h1>{{ device.name }}</h1>
  <h2>{{ device.ip }}</h2>

  <v-card>
    <v-card-title>Device Info</v-card-title>
    <v-card-text>
      <v-row v-for="key in DEVICE_INFO_FIELDS" no-gutters>
        <v-col>{{ key.replace('_', ' ') }}</v-col>
        <v-col>{{ deviceInfo[key] }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card>
    <v-card-title>Zone Status</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          Volume
        </v-col>
        <v-col>
          {{ `${zoneStatus?.actual_volume.value} ${zoneStatus?.actual_volume.unit}` }}
        </v-col>
      </v-row>
      <v-row v-for="key in ZONE_STATUS_FIELDS" no-gutters>
        <v-col>{{ key.replace('_', ' ') }}</v-col>
        <v-col>{{ zoneStatus?.[key] }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card>
    <v-card-title>Signal Info</v-card-title>
    <v-card-text>
      {{ signalInfo }}
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>