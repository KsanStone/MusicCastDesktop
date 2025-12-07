<script setup lang="ts">
import {useTheme} from "vuetify";

const { size = 24, input, disabled } = defineProps<{
  input: string,
  disabled?: boolean,
  size?: number
}>()

const theme = useTheme()
const customSvgs = ['tidal', 'spotify', 'deezer', 'napster', 'qobuz', 'amazon_music']

const svgName = computed(() => {
  return `/platform/${toRaw(input)}.${toRaw(theme.name.value)}.svg`
})

const iconName = computed(() => {
  const id = input
  if (id.startsWith('hdmi')) return 'mdi-video-input-hdmi'
  if (id.startsWith('av') || id === 'tv') return 'mdi-television'
  if (id.startsWith('audio')) return 'mdi-speaker'
  if (id === 'usb') return 'mdi-usb'
  if (id === "bluetooth") return "mdi-bluetooth"
  if (id === 'phono') return 'mdi-record-player'
  return 'mdi-network'
})

</script>

<template>
  <v-img v-if="customSvgs.includes(input)" :style="{'opacity': disabled ? '0.26' : '1'}"
         :src="svgName" aspect-ratio="1" :width="size" :max-width="size"></v-img>
  <v-icon :icon="iconName" v-else :size="size"></v-icon>
</template>

<style scoped>

</style>