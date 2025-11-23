<script setup lang="ts">
import {ZoneStatus} from "@/ipc/models.ts";
import {useAppStore} from "@/stores/app.ts";
import {setEnhancer, setExtraBass, setPureDirect, setSoundProgram} from "@/ipc/yamaha.ts";
import {debounce} from "@/util.ts";

const props = defineProps<{ zoneStatus?: ZoneStatus, deviceId: string, disabled?: boolean }>()

const app = useAppStore()
const availablePrograms = ref<string[]>([])
const ZONE_STATUS_FIELDS = ['input', 'input_text', 'surr_decoder_type', 'adaptive_drc', 'dialogue_level', 'dialogue_lift', 'subwoofer_volume', 'dts_dialogue_control', 'adaptive_dsp_level', 'party_enable']

onMounted(() => {
  app.getProgramList(props.deviceId).then(programs => {
    availablePrograms.value = programs
  })
})

const DEBOUNCE_TIME = 500
const updatePureDirect = debounce(() => setPureDirect(props.deviceId, props.zoneStatus?.pure_direct ?? false), DEBOUNCE_TIME)
const updateExtraBass = debounce(() => setExtraBass(props.deviceId, props.zoneStatus?.extra_bass ?? false), DEBOUNCE_TIME)
const updateEnhancer = debounce(() => setEnhancer(props.deviceId, props.zoneStatus?.enhancer ?? false), DEBOUNCE_TIME)
const updateSoundProgram = debounce(() => props.zoneStatus ? setSoundProgram(props.deviceId, props.zoneStatus.sound_program) : 0, DEBOUNCE_TIME)

const capitalize = (text: string) => text.replace(/_/g, ' ').split(' ').map(x => x.length > 0 ? x.charAt(0).toUpperCase() + x.substring(1).toLowerCase() : x).join(' ')

</script>

<template>
  <v-container :class="{'text-disabled': disabled}">
    <v-row align="center" no-gutters>
      <v-col>Sound Program</v-col>
      <v-col v-if="zoneStatus">
        <v-select :disabled="disabled" hide-details density="compact" variant="solo-filled" :items="availablePrograms"
                  v-model="zoneStatus.sound_program" @update:model-value="updateSoundProgram">
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="capitalize(item.raw)"></v-list-item>
          </template>
          <template v-slot:selection="{ item }">
            <span>{{ capitalize(item.raw) }}</span>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters>
      <v-col>Pure Direct</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="zoneStatus.pure_direct"
                  @update:model-value="updatePureDirect"/>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters>
      <v-col>Extra Bass</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="zoneStatus.extra_bass"
                  @update:model-value="updateExtraBass"/>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters>
      <v-col>Enhancer</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="zoneStatus.enhancer"
                  @update:model-value="updateEnhancer"/>
      </v-col>
    </v-row>
    <v-row v-for="key in ZONE_STATUS_FIELDS" no-gutters>
      <v-col>{{ key.replace('_', ' ') }}</v-col>
      <v-col>{{ zoneStatus?.[key] }}</v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>