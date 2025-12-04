<script setup lang="ts">
import {DeviceFeatures, NetUsbPlayInfo, SignalInfo, Zone, ZoneStatus} from "@/ipc/models.ts";
import {debounce} from "@/util.ts";
import {setNetUsbPlayback, toggleNetUsbRepeat, toggleNetUsbShuffle} from "@/ipc/yamaha.ts";

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
  if (!props.zoneStatus) return ""
  // The name is similar enough, display only the nice version.
  if (props.zoneStatus.input_text.replace(/ /g, '').toLowerCase() == props.zoneStatus.input)
    return [props.zoneStatus.input_text]
  else // Otherwise, display both
    return [props.zoneStatus.input_text, props.zoneStatus.input]
})

const signalInfoText = computed(() => {
  let list = [];
  if (props.signalInfo?.audio.format) list.push(props.signalInfo.audio.format)
  if (props.signalInfo?.audio.fs) list.push(props.signalInfo.audio.fs)
  if (props.signalInfo?.audio.bit) list.push(props.signalInfo.audio.bit)
  list = list.filter(x => x !== "---")
  list = list.concat(inputLabel.value)
  return list.join(' \u2022 ')
})

const trackLength = computed(() => props.netUsbPlayInfo?.total_time)
const trackProgress = computed(() => props.netUsbPlayInfo?.play_time)
const playState = computed(() => props.netUsbPlayInfo?.playback)
const shuffleState = computed(() => props.netUsbPlayInfo?.shuffle)
const repeatState = computed(() => props.netUsbPlayInfo?.repeat)
const timeNotValid = computed(() => ((trackProgress.value ?? 0) + (trackLength.value ?? 0) === 0) || trackProgress.value === -60000)
const repeatIcon = computed(() => {
  switch (repeatState.value ?? 'off') {
    case "all": return "mdi-repeat"
    case "one": return "mdi-repeat-once"
    case "off": return "mdi-repeat-off"
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

</script>

<template>
  <div class="text-center pa-3">
    <div class="d-flex align-center justify-center flex-wrap" v-if="playInfoType === 'netusb'">
      <v-img :src="netUsbPlayInfo?.albumart_url ? `http://${deviceIp}${netUsbPlayInfo.albumart_url}` : undefined"
             alt="playback cover art" class="rounded border-sm flex-grow-0" aspect-ratio="1" width="275px">
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
          <p class="text-h3">{{ netUsbPlayInfo.track }}</p>
          <p class="text-h4">{{ netUsbPlayInfo.artist }}</p>
          <p class="text-subtitle-1">{{ netUsbPlayInfo.album }}</p>
        </div>
        <div class="flex-grow-1"></div>
        <div>
          <v-container fluid>
            <v-row no-gutters>
              <v-col>
                <v-slider hide-details readonly :model-value="trackProgress" :max="trackLength" :thumb-size="isTrackNotLoaded || timeNotValid ? 0 : undefined"
                          :disabled="isTrackNotLoaded || timeNotValid"></v-slider>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="2" class="text-left">
                <span :class="{'text-disabled' : timeNotValid || isTrackNotLoaded}">{{ formatTime(timeNotValid ? -1 : trackProgress ?? -1) }}</span>
              </v-col>
              <v-col>
                <p class="text-sm-caption">
                  <span>{{ signalInfoText }}</span>
                </p>
              </v-col>
              <v-col cols="2" class="text-right">
                <span :class="{'text-disabled' : timeNotValid || isTrackNotLoaded}">{{ formatTime(timeNotValid ? -1 : trackLength ?? -1) }}</span>
              </v-col>
            </v-row>
          </v-container>
          <div class="d-flex ga-2 justify-center">
            <v-btn :disabled="isTrackNotLoaded" :variant="(repeatState ?? 'off') === 'off' ? 'outlined' : 'elevated'"
                   :icon="repeatIcon" color="primary" @click="toggleRepeat"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated" icon="mdi-skip-previous" color="primary" @click="skipPrevious"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated"
                   :icon="playState === 'play' ? 'mdi-pause' : 'mdi-play'" color="primary" @click="togglePlay"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated" icon="mdi-skip-next" color="primary" @click="skipNext"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" :variant="(shuffleState ?? 'off') === 'off' ? 'outlined' : 'elevated'"
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