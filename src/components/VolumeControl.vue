<script setup lang="ts">
import {ZoneStatus} from "@/ipc/models.ts";
import {debounce} from "@/util.ts";
import {setMute, setVolumeDown, setVolumeUp} from "@/ipc/yamaha.ts";

const props = defineProps<{
  zoneStatus?: ZoneStatus,
  deviceId: string,
  disabled?: boolean
}>();

const DEBOUNCE_TIME = 50

const volumeUp = debounce(() => setVolumeUp(props.deviceId).then(() => tempIncrVol(1)), DEBOUNCE_TIME)
const volumeDown = debounce(() => setVolumeDown(props.deviceId).then(() => tempIncrVol(-1)), DEBOUNCE_TIME)

function toggleMute() {
  if (!props.zoneStatus) return
  props.zoneStatus.mute = !props.zoneStatus.mute
  setMute(props.deviceId, props.zoneStatus.mute)
}

function tempIncrVol(delta: number) {
  if (!props.zoneStatus) return
  props.zoneStatus.volume += delta
  props.zoneStatus.mute = false
  if (props.zoneStatus.volume < 1) props.zoneStatus.volume = 1
  if (props.zoneStatus.volume > props.zoneStatus.max_volume) props.zoneStatus.volume = props.zoneStatus.max_volume
}

</script>

<template>
  <div v-if="zoneStatus" class="d-flex align-center items-center px-2 ga-1">
    <v-btn variant="text" :icon="zoneStatus?.mute ? 'mdi-volume-off' : 'mdi-volume-high'" :disabled="disabled" @click="toggleMute"></v-btn>
    <span :class="{'text-disabled': disabled}">{{
        `${zoneStatus.actual_volume.value} ${zoneStatus.actual_volume.unit}`
      }}</span>
    <v-btn icon="mdi-minus" variant="text" @click="volumeDown" :disabled="disabled"></v-btn>
    <v-slider hide-details min="1" :max="zoneStatus.max_volume" :model-value="zoneStatus.volume" readonly
              :disabled="disabled"/>
    <v-btn icon="mdi-plus" variant="text" @click="volumeUp" :disabled="disabled"></v-btn>
  </div>
  <div v-else></div>
</template>

<style scoped>

</style>