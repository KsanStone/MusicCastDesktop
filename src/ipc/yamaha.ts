import {DeviceInfo, DiscoveredDevice, Result, SignalInfo, StatusCode, ZoneProgramList, ZoneStatus} from "./models.ts";
import {invoke} from "@tauri-apps/api/core";

export async function discoverDevices(): Promise<DiscoveredDevice[]> {
    return await invoke("discover_devices")
        .then(devices => devices as DiscoveredDevice[])
        .then(devices => devices.sort((a, b) => a.name.localeCompare(b.name)));
}

export async function getDeviceInfo(ip: string): Promise<Result<DeviceInfo, StatusCode>> {
    return await invoke("get_device_info", {ip});
}

export async function getAllDeviceInfo(ips: string[]): Promise<Result<DeviceInfo, StatusCode>[]> {
    return await invoke("get_device_info_all", {ips});
}

export async function getZoneStatus(ip: string): Promise<ZoneStatus> {
    return await invoke("get_zone_status", {ip, zone: 'main'});
}

export async function getSignalInfo(ip: string): Promise<SignalInfo> {
    return await invoke("get_signal_info", {ip, zone: 'main'});
}

export async function getZoneProgramList(ip: string): Promise<ZoneProgramList> {
    return await invoke("get_zone_program_list", {ip, zone: 'main'});
}

export async function toggleZonePower(ip: string): Promise<void> {
    return await invoke("toggle_zone_power", {ip, zone: 'main'});
}

export async function setVolumeUp(ip: string): Promise<void> {
    return await invoke("set_volume_up", {ip, zone: 'main'});
}

export async function setVolumeDown(ip: string): Promise<void> {
    return await invoke("set_volume_down", {ip, zone: 'main'});
}

export async function setEnhancer(ip: string, enabled: boolean): Promise<void> {
    return await invoke("set_enhancer", {ip, zone: 'main', enabled});
}

export async function setPureDirect(ip: string, enabled: boolean): Promise<void> {
    return await invoke("set_pure_direct", {ip, zone: 'main', enabled});
}

export async function setMute(ip: string, enabled: boolean): Promise<void> {
    return await invoke("set_mute", {ip, zone: 'main', enabled});
}

export async function setExtraBass(ip: string, enabled: boolean): Promise<void> {
    return await invoke("set_extra_bass", {ip, zone: 'main', enabled});
}

export async function setSoundProgram(ip: string, program: string): Promise<void> {
    return await invoke("set_sound_program", {ip, zone: 'main', program});
}