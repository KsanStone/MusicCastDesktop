<script setup lang="ts">
import {DeviceInfo, DiscoveredDevice, NetUsbPlayInfo, ZoneStatus} from "@/ipc/models.ts";
import {debounce} from "@/util.ts";
import {getNetUsbPlayInfo, getZoneStatus} from "@/ipc/yamaha.ts";

const props = defineProps<{
  device: DiscoveredDevice,
  info?: DeviceInfo,
  isOn?: boolean,
  pageMode?: boolean,
  canDelete?: boolean,
  pollForStatus?: boolean,
}>()

const DEVICE_INFO_FIELDS = ['model_name', 'serial_number', 'system_version']
const emit = defineEmits(['togglePower', 'delete'])
const togglePower = debounce(() => emit('togglePower'), 1000)

let refreshInterval: ReturnType<typeof setInterval>
const netUsbPlayInfo = ref<NetUsbPlayInfo>()
const zoneStatus = ref<ZoneStatus>()

const isDeviceOn = computed(() => {
  return zoneStatus.value ? zoneStatus.value.power === 'on' : props.isOn
})

async function statusPoll() {
  try {
    netUsbPlayInfo.value = await getNetUsbPlayInfo(props.device.ip)
    zoneStatus.value = await getZoneStatus(props.device.ip)
  } catch (e) {
    netUsbPlayInfo.value = undefined
    zoneStatus.value = undefined
  }
}

onMounted(() => {
  if (props.pollForStatus) {
    statusPoll()
    refreshInterval = setInterval(statusPoll, 1000)
  }
})

onUnmounted(() => clearInterval(refreshInterval))

</script>

<template>
  <v-card :disabled="!info">
    <v-row no-gutters class="pa-3">
      <v-col cols="1" align-self="center" class="text-center">
        <v-icon icon="mdi-audio-video" :color="isDeviceOn ? 'primary' : undefined" size="48"></v-icon>
      </v-col>
      <v-col cols="3">
        <v-card-title class="pt-0">{{ info?.model_name ? info?.model_name + ' \u2022 ' : '' }}{{ device.name }}
        </v-card-title>
        <v-card-subtitle>{{ device.ip }}</v-card-subtitle>
      </v-col>
      <v-col v-if="netUsbPlayInfo && pollForStatus && zoneStatus" align-self="center">
        <div class="d-flex align-center justify-start ga-2">
          <v-img :src="netUsbPlayInfo?.albumart_url ? `http://${device.ip}${netUsbPlayInfo.albumart_url}` : undefined"
                 aspect-ratio="1" contain width="50" max-width="50" class="rounded border">
            <template v-slot:placeholder>
              <div class="fill-height d-flex align-center justify-center">
                <v-icon icon="mdi-music-note-outline" color="grey lighten-2" size="24"/>
              </div>
            </template>
          </v-img>
          <div>
            <p>{{ netUsbPlayInfo.track }}</p>
            <div class="d-flex ga-2 items-center flex-row">
              <InputIcon :input="zoneStatus.input"></InputIcon>
              <span class="text-medium-emphasis">{{ netUsbPlayInfo.artist }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col v-if="info && pageMode">
        <v-row v-for="key in DEVICE_INFO_FIELDS" no-gutters>
          <v-col class="text-medium-emphasis">{{ key.replace(/_/g, ' ') }}</v-col>
          <v-col>{{ info[key] }}</v-col>
        </v-row>
      </v-col>
      <v-col v-if="info && pageMode" cols="1" align-self="center">
        <div class="d-flex justify-end">
          <v-btn variant="text" icon="mdi-power" @click="togglePower"></v-btn>
        </div>
      </v-col>
      <v-col v-if="canDelete" cols="1" align-self="center">
        <v-btn icon="mdi-delete" @click="emit('delete')" color="error" :disabled="false"
               class="pointer-events-auto"></v-btn>
      </v-col>
      <v-col align-self="center" v-if="info && !pageMode" cols="2">
        <v-btn :to="`/device/${device.ip}`" color="primary">Manage</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>

</style>