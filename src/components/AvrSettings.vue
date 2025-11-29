<script setup lang="ts">
import {Zone, ZoneStatus} from "@/ipc/models.ts";
import {useAppStore} from "@/stores/app.ts";
import {setEnhancer, setExtraBass, setPureDirect, setSoundProgram} from "@/ipc/yamaha.ts";
import {debounce} from "@/util.ts";

const CONTROL_RANGE_STEPS = ['subwoofer_volume', 'dialogue_lift', 'dts_dialogue_control', 'dialogue_level', ]

const props = defineProps<{ zoneStatus?: ZoneStatus, deviceId: string, disabled?: boolean, zone?: Zone }>()

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
const rangeSteps = computed(() => props.zone?.range_step ?? [])

const rangeStep = (id: string) => rangeSteps.value.find(x => x.id === id)

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
    <v-row align="center" no-gutters v-for="range in CONTROL_RANGE_STEPS.filter(x => rangeStep(x) !== undefined)">
      <v-col>{{ capitalize(range) }}</v-col>
      <v-col v-if="zoneStatus">
        <v-slider :model-value="zoneStatus[range]" :min="rangeStep(range)!.min"
                  :max="rangeStep(range)!.max" :step="rangeStep(range)!.step"
                  show-ticks="always"
                  thumb-label
                  ></v-slider>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters v-if="rangeStep('tone_control')">
      <v-col>Bass</v-col>
      <v-col v-if="zoneStatus">
        <v-slider :model-value="zoneStatus.tone_control.bass" :min="rangeStep('tone_control')!.min"
                  :max="rangeStep('tone_control')!.max" :step="rangeStep('tone_control')!.step"
                  show-ticks="always"
                  thumb-label
        ></v-slider>
      </v-col>
    </v-row>
    <v-row align="center" no-gutters v-if="rangeStep('tone_control')">
      <v-col>Treble</v-col>
      <v-col v-if="zoneStatus">
        <v-slider :model-value="zoneStatus.tone_control.treble" :min="rangeStep('tone_control')!.min"
                  :max="rangeStep('tone_control')!.max" :step="rangeStep('tone_control')!.step"
                  show-ticks="always"
                  thumb-label
        ></v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>