import {useStorage} from "@vueuse/core";

export const useUserData = defineStore('userData', {
    state: () => useStorage('userData', {
        manuallyAddedDevices: [] as string[],
        theme: 'system' as 'system' | 'light' | 'dark',
    }).value,
    actions: {
        addDevice(ip: string) {
            if (!this.manuallyAddedDevices.includes(ip))
                this.manuallyAddedDevices.push(ip)
        },
        deleteDevice(ip: string) {
            this.manuallyAddedDevices = this.manuallyAddedDevices.filter(d => d !== ip)
        }
    }
})
