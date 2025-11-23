<script setup lang="ts">
import {SignalInfo, ZoneStatus} from "@/ipc/models.ts";

const props = defineProps<{
  signalInfo?: SignalInfo
  zoneStatus?: ZoneStatus
}>()

const inputLabel = computed(() => {
  if (!props.zoneStatus) return ""
  // The name is similar enough, display only the nice version.
  if (props.zoneStatus.input_text.replace(/ /g, '').toLowerCase() == props.zoneStatus.input)
    return " \u2022 " + props.zoneStatus.input_text
  else // Otherwise, display both
    return " \u2022 " + props.zoneStatus.input_text + " \u2022 " + props.zoneStatus.input
})

</script>

<template>
<div class="text-high-emphasis text-center pa-3">
  <span v-if="signalInfo && zoneStatus">
    {{ signalInfo.audio.format }} &#x2022; {{ signalInfo.audio.fs }} &#x2022; {{ signalInfo.audio.bit }}{{ inputLabel }}
  </span>
  <span v-else class="text-disabled"> - &#x2022; - </span>
</div>
</template>

<style scoped>

</style>