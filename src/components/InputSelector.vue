<script setup lang="ts">
import {DeviceFeatures, Zone, ZoneStatus} from "@/ipc/models.ts";
import {capitalize, debounce} from "@/util.ts";
import {setInput} from "@/ipc/yamaha.ts";

const props = defineProps<{
  deviceId: string,
  features?: DeviceFeatures,
  zone?: Zone,
  zoneStatus?: ZoneStatus
}>()

const currentInput = computed(() => props.zoneStatus?.input)
const inputList = computed(() => {
  if (!props.features || !props.zone) return []
  return props.features.system.input_list.filter(x => props.zone!.input_list.includes(x.id))
})

function getInputIcon(id: string) {
  if (id.startsWith('hdmi')) return 'mdi-video-input-hdmi'
  if (id.startsWith('av') || id === 'tv') return 'mdi-television'
  if (id.startsWith('audio')) return 'mdi-speaker'
  if (id === 'phono') return 'mdi-record-player'
  return 'mdi-network'
}

const doSetInput = debounce((id: string) => {
  if (!props.zoneStatus || props.zoneStatus.input == id) return
  setInput(props.deviceId, id)
}, 1000)

</script>

<template>
  <div v-if="features && zone" class="d-flex flex-wrap ga-3 justify-center pa-3">
    <v-btn v-for="input in inputList" :key="input.id" :variant="input.id === currentInput ? 'tonal' : 'outlined'" width="200"
           :prepend-icon="getInputIcon(input.id)"  :color="input.id === currentInput ? 'primary' : undefined" @click="doSetInput(input.id)">
      <h3>{{ capitalize(input.id) }}</h3>
    </v-btn>
  </div>
</template>

<style scoped>

</style>