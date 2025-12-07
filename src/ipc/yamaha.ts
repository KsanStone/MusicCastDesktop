import {
    DeviceFeatures,
    DeviceInfo,
    DiscoveredDevice,
    ListControlType,
    NetUsbListInfo,
    NetUsbPlayInfo,
    NetUsbRepeatMode,
    NetUsbShuffleMode,
    PlaybackCommand, RecentInfoEntry,
    Result,
    SignalInfo,
    StatusCode,
    YpaoConfig,
    ZoneProgramList,
    ZoneStatus
} from "./models.ts";
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

export async function getFeatures(ip: string): Promise<DeviceFeatures> {
    return await invoke("get_features", {ip});
}

export async function getNetUsbPlayInfo(ip: string): Promise<NetUsbPlayInfo> {
    return await invoke("net_usb_get_play_info", { ip });
}

export async function setNetUsbPlayback(ip: string, playback: PlaybackCommand): Promise<void> {
    return await invoke("net_usb_set_playback", { ip, playback });
}

export async function setNetUsbRepeat(ip: string, mode: NetUsbRepeatMode): Promise<void> {
    return await invoke("net_usb_set_repeat", { ip, mode });
}

export async function setNetUsbShuffle(ip: string, mode: NetUsbShuffleMode): Promise<void> {
    return await invoke("net_usb_set_shuffle", { ip, mode });
}

export async function toggleNetUsbRepeat(ip: string): Promise<void> {
    return await invoke("net_usb_toggle_repeat", { ip });
}

export async function toggleNetUsbShuffle(ip: string): Promise<void> {
    return await invoke("net_usb_toggle_shuffle", { ip });
}

export async function getNetUsbListInfo(
    ip: string,
    input: string,
    index: number = 0,
    size: number = 8
): Promise<NetUsbListInfo> {
    return await invoke("net_usb_get_list_info", { ip, input, index, size });
}

export async function controlNetUsbList(
    ip: string,
    controlType: ListControlType,
    index?: number,
    zone: string = 'main'
): Promise<void> {
    return await invoke("net_usb_set_list_control", {
        ip,
        listId: 'main',
        controlType,
        index,
        zone
    });
}

export async function searchNetUsbList(ip: string, searchText: string, listIndex: number | undefined): Promise<void> {
    return await invoke("net_usb_set_search_string", {
        ip,
        listId: 'main',
        searchText,
        index: listIndex
    });
}

export async function setInput(
    ip: string,
    input: string,
    zone: string = 'main'
): Promise<void> {
    return await invoke("set_input", { ip, input, zone });
}

export async function setSubwooferVolume(ip: string, volume: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_subwoofer_volume", { ip, volume, zone });
}

export async function setDialogueLift(ip: string, value: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_dialogue_lift", { ip, value, zone });
}

export async function setDialogueLevel(ip: string, value: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_dialogue_level", { ip, value, zone });
}

export async function setDtsDialogueControl(ip: string, value: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_dts_dialogue_control", { ip, value, zone });
}

export async function setToneBass(ip: string, value: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_tone_bass", { ip, value, zone });
}

export async function setToneTreble(ip: string, value: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_tone_treble", { ip, value, zone });
}

export async function setZoneVolume(ip: string, volume: number, zone: string = 'main'): Promise<void> {
    return await invoke("set_volume", { ip, volume, zone });
}

export async function getYpaoConfig(ip: string): Promise<YpaoConfig> {
    return await invoke("get_ypao_config", { ip });
}

export async function setYpaoVolume(ip: string, enabled: boolean): Promise<void> {
    return await invoke("set_ypao_volume", { ip, enabled });
}

export async function getNetUsbRecentInfo(ip: string): Promise<RecentInfoEntry[]> {
    return (await invoke("net_usb_get_recent_info", { ip }) as any).recent_info;
}

export async function setPlayPosition(ip: string, position: number): Promise<void> {
    return await invoke("set_play_position", { ip, position });
}

export async function recallRecentItem(ip: string, item: number, zone: string = 'main'): Promise<void> {
    return await invoke("recall_recent_item", { ip, item, zone });
}