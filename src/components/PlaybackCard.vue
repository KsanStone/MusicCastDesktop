<script setup lang="ts">
import {DeviceFeatures, NetUsbPlayInfo, SignalInfo, Zone, ZoneStatus} from "@/ipc/models.ts";
import {debounce} from "@/util.ts";
import {setNetUsbPlayback, setPlayPosition, toggleNetUsbRepeat, toggleNetUsbShuffle} from "@/ipc/yamaha.ts";

const props = defineProps<{
  deviceIp: string,
  signalInfo?: SignalInfo
  zoneStatus?: ZoneStatus,
  netUsbPlayInfo?: NetUsbPlayInfo,
  playInfoType: string | undefined,
  features?: DeviceFeatures,
  zone?: Zone
}>()

const inputLabel = computed(() => {
  if (!props.zoneStatus) return []
  // The name is similar enough, display only the nice version.
  if (props.zoneStatus.input_text.replace(/ /g, '').toLowerCase() == props.zoneStatus.input)
    return [props.zoneStatus.input_text]
  else // Otherwise, display both
    return [props.zoneStatus.input, props.zoneStatus.input_text]
})

const signalInfoText = computed(() => {
  let list = [];
  if (props.signalInfo?.audio.format) list.push(props.signalInfo.audio.format)
  if (props.signalInfo?.audio.fs) list.push(props.signalInfo.audio.fs)
  if (props.signalInfo?.audio.bit) list.push(props.signalInfo.audio.bit)
  list = list.filter(x => x !== "---").map(x => x + ' \u2022 ')
  return list.join('')
})

const trackLength = computed(() => props.netUsbPlayInfo?.total_time)
const trackProgress = computed(() => props.netUsbPlayInfo?.play_time)
const playState = computed(() => props.netUsbPlayInfo?.playback)
const shuffleState = computed(() => props.netUsbPlayInfo?.shuffle)
const repeatState = computed(() => props.netUsbPlayInfo?.repeat)
const timeNotValid = computed(() => ((trackProgress.value ?? 0) + (trackLength.value ?? 0) === 0) || trackProgress.value === -60000)
const repeatIcon = computed(() => {
  switch (repeatState.value ?? 'off') {
    case "all":
      return "mdi-repeat"
    case "one":
      return "mdi-repeat-once"
    case "off":
      return "mdi-repeat-off"
  }
})
const isTrackNotLoaded = computed(() => {
  const v = props.netUsbPlayInfo;
  if (!v) return true;

  return (
      v.playback === "stop" &&
      (v.play_time === -60000 || v.total_time === 0)
  );
});

function formatTime(seconds: number) {
  if (seconds < 0) return '';
  const s = seconds % 60;
  const m = Math.floor(seconds / 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

const DEBOUNCE_TIME = 500
const toggleShuffle = debounce(() => toggleNetUsbShuffle(props.deviceIp), DEBOUNCE_TIME)
const toggleRepeat = debounce(() => toggleNetUsbRepeat(props.deviceIp), DEBOUNCE_TIME)
const togglePlay = debounce(() => setNetUsbPlayback(props.deviceIp, "play_pause"), DEBOUNCE_TIME)
const skipNext = debounce(() => setNetUsbPlayback(props.deviceIp, "next"), DEBOUNCE_TIME)
const skipPrevious = debounce(() => setNetUsbPlayback(props.deviceIp, "previous"), DEBOUNCE_TIME)
const setPlayPos = debounce((x: number) => setPlayPosition(props.deviceIp, x), 50)

import {useDisplay} from 'vuetify'

const {md, lg} = useDisplay()

const trackClass = computed(() => lg.value ? 'text-h3' : md.value ? 'text-h4' : 'text-h5')
const artistClass = computed(() => lg.value ? 'text-h4' : md.value ? 'text-h5' : 'text-h6')
const albumClass = computed(() => lg.value ? 'text-h6' : md.value ? 'text-subtitle-1' : 'text-subtitle-2')
const imageSize = computed(() => lg.value ? 275 : md.value ? 250 : 230)

function doSetPlayPos(pos: number) {
  if (timeNotValid.value || isTrackNotLoaded.value) return
  setPlayPos(Math.round(pos))
}

</script>

<template>
  <div class="text-center pa-3">
    <div class="d-flex align-center justify-center flex-wrap" v-if="playInfoType === 'netusb'">
      <v-img :src="netUsbPlayInfo?.albumart_url ? `http://${deviceIp}${netUsbPlayInfo.albumart_url}` : undefined"
             alt="playback cover art" class="rounded border-sm flex-grow-0" aspect-ratio="1" :width="imageSize">
        <template v-slot:error>
          <div class="fill-height d-flex align-center justify-center">
            <v-icon icon="mdi-music-note-outline" color="grey lighten-2" size="40"/>
          </div>
        </template>
        <template v-slot:placeholder>
          <div class="fill-height d-flex align-center justify-center">
            <v-icon icon="mdi-music-note-outline" color="grey lighten-2" size="40"/>
          </div>
        </template>
      </v-img>
      <div class="flex-grow-1 d-flex flex-column align-self-stretch" v-if="netUsbPlayInfo">
        <div>
          <p :class="trackClass">{{ netUsbPlayInfo.track }}</p>
          <p :class="artistClass">{{ netUsbPlayInfo.artist }}</p>
          <p :class="albumClass">{{ netUsbPlayInfo.album }}</p>
        </div>
        <div class="flex-grow-1"></div>
        <div>
          <v-container fluid>
            <v-row no-gutters>
              <v-col>
                <v-slider hide-details :model-value="trackProgress" :max="trackLength"
                          :thumb-size="isTrackNotLoaded || timeNotValid ? 0 : undefined"
                          @update:model-value="doSetPlayPos"
                          :disabled="isTrackNotLoaded || timeNotValid"></v-slider>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="2" class="text-left">
                <span :class="{'text-disabled' : timeNotValid || isTrackNotLoaded}">{{
                    formatTime(timeNotValid ? -1 : trackProgress ?? -1)
                  }}</span>
              </v-col>
              <v-col>
                <p class="text-sm-caption d-flex ga-2 justify-center">
                  <span>{{ signalInfoText }}</span>
                  <InputIcon :size="16" :input="zoneStatus?.input ?? ''"/>
                  <span>{{ inputLabel.join('\u2022') }}</span>
                </p>
              </v-col>
              <v-col cols="2" class="text-right">
                <span :class="{'text-disabled' : timeNotValid || isTrackNotLoaded}">{{
                    formatTime(timeNotValid ? -1 : trackLength ?? -1)
                  }}</span>
              </v-col>
            </v-row>
          </v-container>
          <div class="d-flex ga-2 justify-center">
            <v-btn :disabled="isTrackNotLoaded" :variant="(repeatState ?? 'off') === 'off' ? 'text' : 'outlined'"
                   :icon="repeatIcon" color="primary" @click="toggleRepeat"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="text" icon="mdi-skip-previous" color="primary"
                   @click="skipPrevious"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated"
                   :icon="playState === 'play' ? 'mdi-pause' : 'mdi-play'" color="primary" @click="togglePlay"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="text" icon="mdi-skip-next" color="primary"
                   @click="skipNext"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" :variant="(shuffleState ?? 'off') === 'off' ? 'text' : 'outlined'"
                   icon="mdi-shuffle" color="primary" @click="toggleShuffle"></v-btn>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2>{{ signalInfoText }}</h2>
    </div>
  </div>
</template>

<style scoped>

</style>