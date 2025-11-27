<script setup lang="ts">
import {NetUsbPlayInfo, SignalInfo, ZoneStatus} from "@/ipc/models.ts";

const props = defineProps<{
  deviceIp: string,
  signalInfo?: SignalInfo
  zoneStatus?: ZoneStatus,
  netUsbPlayInfo?: NetUsbPlayInfo
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
  list = list.concat(inputLabel.value)
  return list.join(' \u2022 ')
})

const trackLength = computed(() => props.netUsbPlayInfo?.total_time)
const trackProgress = computed(() => props.netUsbPlayInfo?.play_time)
const playState = computed(() => props.netUsbPlayInfo?.playback)
const shuffleState = computed(() => props.netUsbPlayInfo?.shuffle)
const repeatState = computed(() => props.netUsbPlayInfo?.repeat)
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
  if (seconds < 0) return '--:--';
  const s = seconds % 60;
  const m = Math.floor(seconds / 60);
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

</script>

<template>
  <div class="text-center pa-3">
    <div class="d-flex align-center justify-center flex-wrap">
      <v-img :src="netUsbPlayInfo?.albumart_url ? `http://${deviceIp}${netUsbPlayInfo.albumart_url}` : undefined"
             alt="playback cover art" class="rounded-lg border-sm flex-grow-0" aspect-ratio="1" width="250px">
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
                <v-slider hide-details readonly :model-value="trackProgress" :max="trackLength"
                          :disabled="isTrackNotLoaded"></v-slider>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="1" class="text-left">
                <span>{{ formatTime(trackProgress ?? -1) }}</span>
              </v-col>
              <v-col>
                <p class="text-sm-caption">
                  <span>{{ signalInfoText }}</span>
                </p>
              </v-col>
              <v-col cols="1" class="text-right">
                <span>{{ formatTime(trackLength ?? -1) }}</span>
              </v-col>
            </v-row>
          </v-container>
          <div class="d-flex ga-2 justify-center">
            <v-btn :disabled="isTrackNotLoaded" :variant="(repeatState ?? 'off') === 'off' ? 'outlined' : 'elevated'"
                   :icon="repeatIcon" color="secondary"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated" icon="mdi-rewind" color="primary"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated"
                   :icon="playState === 'play' ? 'mdi-pause' : 'mdi-play'" color="primary"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" variant="elevated" icon="mdi-fast-forward" color="primary"></v-btn>
            <v-btn :disabled="isTrackNotLoaded" :variant="(shuffleState ?? 'off') === 'off' ? 'outlined' : 'elevated'"
                   icon="mdi-shuffle" color="secondary"></v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>