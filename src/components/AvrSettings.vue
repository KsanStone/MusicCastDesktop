<script setup lang="ts">
import {DeviceFeatures, YpaoConfig, Zone, ZoneStatus} from "@/ipc/models.ts";
import {useAppStore} from "@/stores/app.ts";
import {
  setDialogueLevel,
  setDialogueLift, setDtsDialogueControl,
  setEnhancer,
  setExtraBass,
  setPureDirect,
  setSoundProgram,
  setSubwooferVolume, setToneBass, setToneTreble, setYpaoVolume
} from "@/ipc/yamaha.ts";
import {debounce, capitalize} from "@/util.ts";

const props = defineProps<{ zoneStatus?: ZoneStatus, deviceId: string, disabled?: boolean, zone?: Zone, features?: DeviceFeatures, ypao_config?: YpaoConfig }>()

const app = useAppStore()
const availablePrograms = ref<string[]>([])
const surrDecoderTypes = computed(() => props.zone?.surr_decoder_type_list ?? [])

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
const updateYpaoVolume = debounce(() => props.ypao_config ? setYpaoVolume(props.deviceId, props.ypao_config.ypao_volume) : 0, DEBOUNCE_TIME)
const SLIDER_DEBOUNCE_TIME = 50
const updateSubwooferVolume = debounce(() => props.zoneStatus ? setSubwooferVolume(props.deviceId, props.zoneStatus.subwoofer_volume) : 0, SLIDER_DEBOUNCE_TIME)
const updateDialogLift = debounce(() => props.zoneStatus ? setDialogueLift(props.deviceId, props.zoneStatus.dialogue_lift) : 0, SLIDER_DEBOUNCE_TIME)
const updateDtsDialogeControl = debounce(() => props.zoneStatus ? setDtsDialogueControl(props.deviceId, props.zoneStatus.dts_dialogue_control) : 0, SLIDER_DEBOUNCE_TIME)
const updateDialogLevel = debounce(() => props.zoneStatus ? setDialogueLevel(props.deviceId, props.zoneStatus.dialogue_level) : 0, SLIDER_DEBOUNCE_TIME)
const updateBass = debounce(() => props.zoneStatus ? setToneBass(props.deviceId, props.zoneStatus.tone_control.bass) : 0, SLIDER_DEBOUNCE_TIME)
const updateTreble = debounce(() => props.zoneStatus ? setToneTreble(props.deviceId, props.zoneStatus.tone_control.treble) : 0, SLIDER_DEBOUNCE_TIME)

const CONTROL_RANGE_STEPS = [
  {'id': 'subwoofer_volume', 'update': updateSubwooferVolume},
  {'id': 'dialogue_lift', 'update': updateDialogLift},
  {'id': 'dts_dialogue_control', 'update': updateDtsDialogeControl},
  {'id': 'dialogue_level', 'update': updateDialogLevel},
  {
    'id': 'tone_control',
    'name': 'Bass',
    'update': updateBass,
    'get': () => props.zoneStatus?.tone_control.bass,
    'set': (v: number) => props.zoneStatus!.tone_control.bass = v
  },
  {
    'id': 'tone_control',
    'name': 'Treble',
    'update': updateTreble,
    'get': () => props.zoneStatus?.tone_control.treble,
    'set': (v: number) => props.zoneStatus!.tone_control.treble = v
  },
]

const rangeSteps = computed(() => props.zone?.range_step ?? [])
const supportedFunctions = computed(() => props.features?.system.func_list ?? [])

const rangeStep = (id: string) => rangeSteps.value.find(x => x.id === id)

</script>

<template>
  <v-container :class="{'text-disabled': disabled}">
    <v-row align="center" no-gutters class="setting-row">
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
    <v-row align="center" no-gutters class="setting-row">
      <v-col>Surround decoder type</v-col>
      <v-col v-if="zoneStatus">
        <v-select :disabled="disabled" hide-details density="compact" variant="solo-filled" :items="surrDecoderTypes"
                  v-model="zoneStatus.surr_decoder_type" @update:model-value="() => {}">
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="capitalize(item.raw)"></v-list-item>
          </template>
          <template v-slot:selection="{ item }">
            <span>{{ capitalize(item.raw) }}</span>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters class="setting-row" v-if="supportedFunctions.includes('ypao_volume') && ypao_config">
      <v-col>YPAO Volume</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="ypao_config.ypao_volume"
                  @update:model-value="updateYpaoVolume"/>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters class="setting-row">
      <v-col>Pure Direct</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="zoneStatus.pure_direct"
                  @update:model-value="updatePureDirect"/>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters class="setting-row">
      <v-col>Extra Bass</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="zoneStatus.extra_bass"
                  @update:model-value="updateExtraBass"/>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters class="setting-row">
      <v-col>Enhancer</v-col>
      <v-col v-if="zoneStatus">
        <v-switch :disabled="disabled" hide-details density="compact" v-model="zoneStatus.enhancer"
                  @update:model-value="updateEnhancer"/>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters v-for="range in CONTROL_RANGE_STEPS.filter(x => rangeStep(x.id) !== undefined)"
           class="setting-row">
      <v-col>{{ capitalize(range.name ?? range.id) }}</v-col>
      <v-col v-if="zoneStatus">
        <v-slider :model-value="range.get ? range.get() : zoneStatus[range.id]" :min="rangeStep(range.id)!.min"
                  :max="rangeStep(range.id)!.max" :step="rangeStep(range.id)!.step"
                  :disabled="disabled"
                  show-ticks="always"
                  thumb-label hide-details
                  @update:model-value="range.set ? range.set($event) : (zoneStatus[range.id] = $event); range.update()"
        ></v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.setting-row {
  height: 48px;
}
</style>