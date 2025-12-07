<script setup lang="ts">
import {useUserData} from "@/stores/userDataStore.ts";
import {useAppStore} from "@/stores/app.ts";

const modalOpen = ref(false)
const address = ref('')

const userData = useUserData()
const app = useAppStore()

watch(modalOpen, () => address.value = '')

function isIpv4Address(input: string) {
  return input.match(/^(((?!25?[6-9])[12]\d|[1-9])?\d\.?\b){4}$/) !== null
}

function validate(input: string) {
  if (!input) return true
  const matches = isIpv4Address(input)
  return matches ? true : "Enter valid ip-v4 address"
}

function addDevice() {
  userData.addDevice(address.value)
  app.loadDeviceInfo()
  modalOpen.value = false
}

</script>

<template>
  <v-dialog v-model="modalOpen" max-width="400">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-plus" variant="tonal">Add device</v-btn>
    </template>

    <v-card>
      <v-card-title>Add device manually</v-card-title>
      <v-card-text>
        <span class="text-medium-emphasis">Enter the ip-address (v4) of the device, in case auto-discovery failed to find it.</span>
        <v-text-field label="IP Address" outlined :rules="[validate]" v-model="address"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="modalOpen = false">Cancel</v-btn>
        <v-btn prepent-icon="mdi-plus" color="primary" @click="addDevice" :disabled="!isIpv4Address(address)">Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>