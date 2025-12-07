// Utilities
import {defineStore} from 'pinia'
import {DeviceFeatures, DeviceInfo, DiscoveredDevice, Result, StatusCode} from "../ipc/models.ts";
import {discoverDevices, getAllDeviceInfo, getFeatures, getZoneProgramList} from "../ipc/yamaha.ts";
import {useUserData} from "@/stores/userDataStore.ts";

export const useAppStore = defineStore('app', {
    state: () => ({
        discoveredDevices: [] as DiscoveredDevice[],
        deviceInfo: {} as { [key: string]: Result<DeviceInfo, StatusCode> },
        programList: {} as { [key: string]: string[] },
        deviceFeatures: {} as { [key: string]: DeviceFeatures },
        loaded: false,
    }),
    getters: {
        getDeviceById(state) {
            const userData = useUserData()
            return (id: string) => state.discoveredDevices.find(device => device.ip === id)
                ?? userData.manuallyAddedDevices.map(x => ({
                    name: '',
                    ip: x
                })).find(device => device.ip === id)
        },
        getDeviceInfo(state) {
            return (id: string) => state.deviceInfo[id]
        },
        /**
         * Check if the device has been discovered and can be managed.
         */
        deviceManageable(state) {
            return (id: string) => !!state.deviceInfo[id]?.Ok
        },
        manageableDevices(state) {
            return () => state.discoveredDevices.filter(device => state.deviceInfo[device.ip]?.Ok)
        }
    },
    actions: {
        async init() {
            if (this.loaded) return
            try {
                console.log("Discovering devices...")
                let newDevices = await discoverDevices()
                for (let device of newDevices) {
                    if (!this.discoveredDevices.find(d => d.ip === device.ip)) {
                        this.discoveredDevices.push(device)
                    }
                }
                console.log("Discovered devices:", this.discoveredDevices)
            } catch (ignored) {
                console.error(ignored)
            } finally {
                this.loaded = true
            }
            console.log("Loading device info...")
            await this.loadDeviceInfo()
        },
        async loadDeviceInfo() {
            const userData = useUserData()
            const discoveredIps = this.discoveredDevices.map(device => device.ip).filter(ip => !this.deviceInfo[ip])
            const ips = [...new Set([...userData.manuallyAddedDevices, ...discoveredIps])]
            let info = await getAllDeviceInfo(ips)
            info.forEach((info, idx) => this.deviceInfo[ips[idx]] = info)
        },
        async refresh() {
            this.loaded = false
            await this.init()
        },
        async getProgramList(ip: string) {
            if (this.deviceInfo[ip]?.Ok) {
                if (this.programList[ip] !== undefined) return this.programList[ip]
                try {
                    const programs = (await getZoneProgramList(ip)).sound_program_list
                    this.programList[ip] = programs
                    return programs
                } catch (e) {
                    this.programList[ip] = [] // Mark as empty if we failed to get it
                    console.error("Failed to get program list for device", ip, e)
                }
            }
            return []
        },
        async getDeviceFeatures(ip: string) {
            if (this.deviceInfo[ip]?.Ok) {
                if (this.deviceFeatures[ip] !== undefined) return this.deviceFeatures[ip]
                try {
                    const features = await getFeatures(ip)
                    this.deviceFeatures[ip] = features
                    return features
                } catch (e) {
                    console.error("Failed to get device features for device", ip, e)
                }
            }
        }
    }
})
