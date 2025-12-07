<script setup lang="ts">
import {DeviceInfo, DiscoveredDevice} from "@/ipc/models.ts";
import {debounce} from "@/util.ts";

defineProps<{
  device: DiscoveredDevice,
  info?: DeviceInfo,
  isOn?: boolean,
  pageMode?: boolean,
  canDelete?: boolean
}>()

const DEVICE_INFO_FIELDS = ['model_name', 'serial_number', 'system_version']
const emit = defineEmits(['togglePower', 'delete'])
const togglePower = debounce(() => emit('togglePower'), 1000)

</script>

<template>
  <v-card :disabled="!info">
    <v-row no-gutters class="pa-3">
      <v-col cols="1" align-self="center" class="text-center">
        <v-icon icon="mdi-audio-video" :color="isOn ? 'primary' : undefined" size="48"></v-icon>
      </v-col>
      <v-col>
        <v-card-title class="pt-0">{{ info?.model_name ? info?.model_name + ' \u2022 ' : '' }}{{ device.name }}
        </v-card-title>
        <v-card-subtitle>{{ device.ip }}</v-card-subtitle>
      </v-col>
      <v-col v-if="info && pageMode">
        <v-row v-for="key in DEVICE_INFO_FIELDS" no-gutters>
          <v-col class="text-medium-emphasis">{{ key.replace(/_/g, ' ') }}</v-col>
          <v-col>{{ info[key] }}</v-col>
        </v-row>
      </v-col>
      <v-col v-if="info && pageMode" cols="1" align-self="center">
        <div class="d-flex justify-end">
          <v-btn variant="text" icon="mdi-power" @click="togglePower"></v-btn>
        </div>
      </v-col>
      <v-col v-if="canDelete" cols="1" align-self="center">
        <v-btn icon="mdi-delete" @click="emit('delete')" color="error" :disabled="false"
               class="pointer-events-auto"></v-btn>
      </v-col>
      <v-col align-self="center" v-if="info && !pageMode" cols="2">
        <v-btn :to="`/device/${device.ip}`" color="primary">Manage</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>

</style>