<script setup lang="ts">

import {useAppStore} from "@/stores/app.ts";
import {getNetUsbPlayInfo, getSignalInfo, getYpaoConfig, getZoneStatus, toggleZonePower} from "@/ipc/yamaha.ts";
import {
  BROWSABLE_INPUTS,
  DeviceFeatures,
  DeviceInfo, DiscoveredDevice,
  NetUsbPlayInfo,
  SignalInfo,
  YpaoConfig,
  Zone,
  ZoneStatus
} from "@/ipc/models.ts";
import VolumeControl from "@/components/VolumeControl.vue";
import PlaybackCard from "@/components/PlaybackCard.vue";
import NetUsbListBrowser from "@/components/NetUsbListBrowser.vue";
import AppTitle from "@/components/nav/AppTitle.vue";
import {useRouter} from "vue-router";

const app = useAppStore()
const deviceId = useRoute().params.id as string

let device: DiscoveredDevice;
let deviceInfo: DeviceInfo;
const loaded = ref(false)
let timer: ReturnType<typeof setInterval>;
const zoneStatus = ref<ZoneStatus>();
const signalInfo = ref<SignalInfo>();
const features = ref<DeviceFeatures>();
const netUsbPlayInfo = ref<NetUsbPlayInfo>();
const ypaoConfig = ref<YpaoConfig>();

const isOn = computed(() => zoneStatus.value?.power === 'on')
const zone = computed(() => features.value?.zone?.find((z: Zone) => z.id === "main"))
const netUsbBrowser = computed(() => zoneStatus.value?.input && BROWSABLE_INPUTS.includes(zoneStatus.value?.input))

const inputList = computed(() => {
  if (!features.value || !zone.value) return []
  return features.value.system.input_list.filter(x => zone.value!.input_list.includes(x.id))
})
const inputPlayInfoType = computed(() => inputList.value.find(x => x.id == zoneStatus.value?.input)?.play_info_type)
const supportedFunctions = computed(() => features.value?.system.func_list ?? [])

async function refreshDeviceInfo() {
  zoneStatus.value = await getZoneStatus(deviceId)
  signalInfo.value = await getSignalInfo(deviceId)
  if (inputPlayInfoType.value === 'netusb')
    netUsbPlayInfo.value = await getNetUsbPlayInfo(deviceId)
  if (supportedFunctions.value.includes("ypao_volume"))
    ypaoConfig.value = await getYpaoConfig(deviceId)
}

onMounted(() => {
  if (!app.deviceManageable(deviceId)) {
    return useRouter().replace('/')
  }
  device = app.getDeviceById(deviceId)!
  deviceInfo = app.getDeviceInfo(deviceId).Ok!
  loaded.value = true

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
  <div class="d-flex flex-column items-center justify-center ga-4 sm:ga-6 lg:ga-8 flex-grow-1" v-if="loaded">
    <AvrCard :device="device" :info="deviceInfo" page-mode @togglePower="togglePower" :is-on="isOn"/>

    <v-card>
      <volume-control :zone-status="zoneStatus" :device-id="deviceId" :disabled="!isOn"
                      :range-step="zone?.range_step ?? []"/>
    </v-card>

    <v-card>
      <playback-card :device-ip="deviceId" :signal-info="signalInfo" :zone-status="zoneStatus"
                     :playInfoType="inputPlayInfoType"
                     :net-usb-play-info="netUsbPlayInfo" :zone="zone" :features="features"/>
    </v-card>

    <div class="d-flex flex-row sm:flex-column w-100 ga-4 sm:ga-6 lg:ga-8">
      <v-card class="w-50">
        <net-usb-list-browser :device-id="deviceId" :input="zoneStatus!.input" v-if="netUsbBrowser"/>
      </v-card>
      <v-card style="max-height: 564px" class="d-flex flex-column align-stretch"
              :class="{'w-50': netUsbBrowser}">
        <v-card-title style="line-height: 48px">Inputs</v-card-title>
        <v-divider></v-divider>
        <input-selector :features="features" :zone="zone" :zone-status="zoneStatus" :device-id="deviceId"
                        :disabled="zoneStatus?.power !== 'on'" class="overflow-y-scroll hide-scrollbar mt-3 mb-3"/>
      </v-card>
    </div>

    <v-card>
      <avr-settings :zone-status="zoneStatus" :device-id="deviceId" class="pa-3" :disabled="!isOn" :zone="zone"
                    :features="features" :ypao_config="ypaoConfig"/>
    </v-card>
  </div>
</template>

<style scoped>

</style>