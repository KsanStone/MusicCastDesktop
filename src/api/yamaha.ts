import {DeviceInfo, DiscoveredDevice, Result, SignalInfo, StatusCode, ZoneStatus} from "../models/yamaha.ts";
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
    return await invoke("get_device_info_all", { ips });
}

export async function getZoneStatus(ip: string): Promise<ZoneStatus> {
    return await invoke("get_zone_status", { ip, zone: 'main' });
}

export async function getSignalInfo(ip: string): Promise<SignalInfo> {
    return await invoke("get_signal_info", { ip, zone: 'main' });
}