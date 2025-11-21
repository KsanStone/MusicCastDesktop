// Utilities
import { defineStore } from 'pinia'
import {DeviceInfo, DiscoveredDevice, Result, StatusCode} from "../models/yamaha.ts";
import {discoverDevices, getAllDeviceInfo} from "../api/yamaha.ts";

export const useAppStore = defineStore('app', {
  state: () => ({
    discoveredDevices: [] as DiscoveredDevice[],
    deviceInfo: {} as { [ key: string ]: Result<DeviceInfo, StatusCode> },
    loaded: false,
    deviceInfoLoaded: false
  }),
  getters: {
    getDeviceById(state) {
      return (id: string) => state.discoveredDevices.find(device => device.ip === id)
    },
    getDeviceInfo(state) {
      return (id: string) => state.deviceInfo[id]
    }
  },
  actions: {
    async init() {
      if (this.loaded) return
      try {
        console.log("Discovering devices...")
        this.discoveredDevices = await discoverDevices()
        console.log("Discovered devices:", this.discoveredDevices)
      } catch (ignored) {}
      finally {
        this.loaded = true
      }
    },
    async loadDeviceInfo() {
      if (this.deviceInfoLoaded) return
      let ips = this.discoveredDevices.map(device => device.ip)
      let info = await getAllDeviceInfo(ips)
      info.forEach((info, idx) => this.deviceInfo[ips[idx]] = info)
      this.deviceInfoLoaded = true
    }
  }
})
