<script setup lang="ts">
import {RangeStep, STEP_VOL, STEP_VOL_DB, STEP_VOL_NUMERIC, VOL_DB, VOL_NUMERIC, ZoneStatus} from "@/ipc/models.ts"
import { debounce } from "@/util.ts"
import { setMute, setVolumeDown, setVolumeUp } from "@/ipc/yamaha.ts"

const props = defineProps<{
  zoneStatus?: ZoneStatus,
  rangeStep: RangeStep[]
  deviceId: string
  disabled?: boolean
}>()

const DEBOUNCE_TIME = 50

const volumeStep = computed(() => props.rangeStep.find(x => x.id == STEP_VOL)?.step ?? 1)
const volumeMin = computed(() => props.rangeStep.find(x => x.id == STEP_VOL)?.min ?? 0)
const dbStep = computed(() => props.rangeStep.find(x => x.id == STEP_VOL_DB)?.step ?? 0.5)
const numericStep = computed(() => props.rangeStep.find(x => x.id == STEP_VOL_NUMERIC)?.step ?? 0.5)

const volumeUp = debounce(() => setVolumeUp(props.deviceId).then(() => tempIncrVol(1)), DEBOUNCE_TIME)
const volumeDown = debounce(() => setVolumeDown(props.deviceId).then(() => tempIncrVol(-1)), DEBOUNCE_TIME)

function toggleMute() {
  if (!props.zoneStatus) return
  props.zoneStatus.mute = !props.zoneStatus.mute
  setMute(props.deviceId, props.zoneStatus.mute)
}

function tempIncrVol(delta: number) {
  if (!props.zoneStatus) return
  const prev = props.zoneStatus.volume
  props.zoneStatus.volume += delta * volumeStep.value
  props.zoneStatus.mute = false
  if (props.zoneStatus.volume < volumeMin.value) props.zoneStatus.volume = 0
  if (props.zoneStatus.volume > props.zoneStatus.max_volume) props.zoneStatus.volume = props.zoneStatus.max_volume
  if (prev != props.zoneStatus.volume) {
    if (props.zoneStatus.actual_volume.mode == VOL_DB)
      props.zoneStatus.actual_volume.value += dbStep.value * delta
    else if (props.zoneStatus.actual_volume.mode == VOL_NUMERIC)
      props.zoneStatus.actual_volume.value += numericStep.value * delta
  }
}

let holdTimer: any = null

function startHold(delta: number) {
  if (holdTimer) clearInterval(holdTimer)
  holdTimer = setInterval(() => {
    if (delta > 0) volumeUp()
    else volumeDown()
  }, 120)
}

function stopHold() {
  if (holdTimer) {
    clearInterval(holdTimer)
    holdTimer = null
  }
}
</script>

<template>
  <div v-if="zoneStatus" class="d-flex align-center items-center px-2 ga-1">
    <v-btn variant="text" :icon="zoneStatus?.mute ? 'mdi-volume-off' : 'mdi-volume-high'"
           :disabled="disabled" @click="toggleMute" />

    <span :class="{ 'text-disabled': disabled }" v-if="zoneStatus.volume > 0" class="text-left" style="min-width: 9ch">
      {{ `${zoneStatus.actual_volume.value} ${zoneStatus.actual_volume.unit}` }}
    </span>
    <span v-else class="text-center" style="min-width: 9ch">
      mute
    </span>

    <v-btn icon="mdi-minus" variant="text" :disabled="disabled"
           @click="volumeDown"
           @mousedown="startHold(-1)"
           @mouseup="stopHold"
           @mouseleave="stopHold" />

    <v-slider hide-details min="1" :max="zoneStatus.max_volume"
              :model-value="zoneStatus.volume" readonly :disabled="disabled" />

    <v-btn icon="mdi-plus" variant="text" :disabled="disabled"
           @click="volumeUp"
           @mousedown="startHold(1)"
           @mouseup="stopHold"
           @mouseleave="stopHold" />
  </div>

  <div v-else></div>
</template>
