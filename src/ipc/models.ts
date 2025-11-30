export type StatusCode = string;

export const STEP_VOL_DB = "actual_volume_db"
export const STEP_VOL = "volume"
export const STEP_VOL_NUMERIC = "actual_volume_numeric"
export const VOL_DB = "db"
export const VOL_NUMERIC = "numeric"
export const BROWSABLE_INPUTS = ['server', 'net_radio', 'usb', 'tidal', 'deezer', 'qobu']

export interface Result<T, E> {
    Ok: T | undefined;
    Err: E | undefined;
}

export interface DiscoveredDevice {
    name: string;
    ip: string;
}

export type DeviceInfo = IDeviceInfo & { [key: string]: any }

export interface IDeviceInfo {
    model_name: string;
    destination: string;
    device_id: string;
    system_id: string;
    system_version: number;
    api_version: number;
    netmodule_generation: number;
    netmodule_version: string;
    netmodule_checksum: string;
    serial_number: string;
    operation_mode: string;
    update_error_code: string;
    net_module_num: number;
    update_data_type: number;
    analytics_info: AnalyticsInfo;
}

export interface AnalyticsInfo {
    uuid: string;
}


export type ZoneStatus = IZoneStatus & { [key: string]: any }

export interface IZoneStatus {
    power: string;
    sleep: number;
    volume: number;
    mute: boolean;
    max_volume: number;
    input: string;
    input_text: string;
    distribution_enable: boolean;
    sound_program: string;
    surr_decoder_type: string;
    pure_direct: boolean;
    enhancer: boolean;
    tone_control: ToneControl;
    dialogue_level: number;
    dialogue_lift: number;
    subwoofer_volume: number;
    link_control: string;
    link_audio_delay: string;
    disable_flags: number;
    contents_display: boolean;
    actual_volume: ActualVolume;
    party_enable: boolean;
    extra_bass: boolean;
    adaptive_drc: boolean;
    dts_dialogue_control: number;
    adaptive_dsp_level: boolean;
}

export interface ToneControl {
    mode: string;
    bass: number;
    treble: number;
}

export interface ActualVolume {
    mode: string;
    value: number;
    unit: string;
}

export interface ZoneProgramList {
    sound_program_list: string[];
}

export interface SignalInfo {
    audio: AudioSignal;
}

export interface AudioSignal {
    error: number;
    format: string;
    fs: string;
    bit: string;
    bitrate: number;
}

export interface DeviceFeatures {
    system: System;
    zone: Zone[];
    tuner: Tuner;
    netusb: NetUsb;
    distribution: Distribution;
    ccs: Ccs;
}

export interface System {
    func_list: string[];
    zone_num: number;
    input_list: SystemInput[];
    bluetooth?: SystemBluetooth;
    web_control_url?: string;
    party_volume_list?: string[];
    hdmi_standby_through_list?: string[];
    works_with_sonos?: WorksWithSonos;
}

export interface SystemInput {
    id: string;
    distribution_enable: boolean;
    rename_enable: boolean;
    account_enable: boolean;
    play_info_type: string;
}

export interface SystemBluetooth {
    update_cancelable: boolean;
    tx_connectivity_type_max?: number;
}

export interface WorksWithSonos {
    zone: SonosZone[];
}

export interface SonosZone {
    id: string;
    input_list: string[];
}

export interface Zone {
    id: string;
    zone_b?: boolean;
    func_list: string[];
    input_list: string[];
    sound_program_list?: string[];
    surr_decoder_type_list?: string[];
    tone_control_mode_list?: string[];
    link_control_list?: string[];
    link_audio_delay_list?: string[];
    range_step: RangeStep[];
    scene_num?: number;
    cursor_list?: string[];
    menu_list?: string[];
    actual_volume_mode_list?: string[];
    ccs_supported?: string[];
}

export interface RangeStep {
    id: string;
    min: number;
    max: number;
    step: number;
}

export interface Tuner {
    func_list: string[];
    range_step: TunerRangeStep[];
    preset: TunerPreset;
}

export interface TunerRangeStep {
    id: string;
    min: number;
    max: number;
    step: number;
}

export interface TunerPreset {
    type: string;
    num: number;
}

export interface NetUsb {
    func_list: string[];
    preset: NetUsbPreset;
    recent_info: NetUsbRecentInfo;
    play_queue: NetUsbQueue;
    mc_playlist: NetUsbMcPlaylist;
    net_radio_type: string;
    tidal?: NetUsbTidal;
    qobuz?: NetUsbQobuz;
}

export interface NetUsbPreset {
    num: number;
}

export interface NetUsbRecentInfo {
    num: number;
}

export interface NetUsbQueue {
    size: number;
}

export interface NetUsbMcPlaylist {
    size: number;
    num: number;
}

export interface NetUsbTidal {
    mode: string;
}

export interface NetUsbQobuz {
    login_type: string;
}

export interface Distribution {
    version: number;
    compatible_client: number[];
    client_max: number;
    server_zone_list: string[];
    mc_surround?: McSurround;
}

export interface McSurround {
    version: number;
    func_list: string[];
    master_role: McRole;
    slave_role: McRole;
}

export interface McRole {
    surround_pair?: boolean;
    stereo_pair?: boolean;
    subwoofer_pair?: boolean;
    surround_pair_l_or_r?: boolean;
    surround_pair_lr?: boolean;
}

export interface Ccs {
    supported: boolean;
}

export type PlaybackCommand =
    | 'play'
    | 'stop'
    | 'pause'
    | 'play_pause'
    | 'previous'
    | 'next'
    | 'fast_reverse_start'
    | 'fast_reverse_end'
    | 'fast_forward_start'
    | 'fast_forward_end';

export type NetUsbPlayStatus =
    | "play"
    | "stop"
    | "pause"
    | "fast_reverse"
    | "fast_forward";

export type NetUsbRepeatMode =
    | "off"
    | "one"
    | "all";

export type NetUsbShuffleMode =
    | "off"
    | "on"
    | "songs"
    | "albums";

export interface NetUsbPlayInfo {
    input: string;
    play_queue_type: string;
    playback: NetUsbPlayStatus;
    repeat: NetUsbRepeatMode;
    shuffle: NetUsbShuffleMode;

    play_time: number;
    total_time: number;

    artist: string;
    album: string;
    track: string;

    albumart_url: string;
    albumart_id: number;

    usb_devicetype: string;
    auto_stopped: boolean;

    attribute: number;

    repeat_available: NetUsbRepeatMode[];
    shuffle_available: NetUsbShuffleMode[];
}

export interface NetUsbListItem {
    text: string;
    thumbnail?: string;

    attribute: number;
    subtexts?: string[];
}

export interface NetUsbListInfo {
    input: string;
    menu_layer: number;
    max_line: number;
    index: number;
    playing_index: number;
    menu_name: string;
    list_info: NetUsbListItem[];
}

export type ListControlType = 'select' | 'play' | 'return';

export interface ListItemAttributes {
    /** Bit 1: Can be selected (e.g., it is a Folder, Container, or Menu Item) */
    isSelectable: boolean;
    /** Bit 2: Can be played immediately (e.g., a Song or Radio Station) */
    isPlayable: boolean;
    /** Bit 3: Is a search entry point (Requires setSearchString before selecting) */
    isSearchable: boolean;
    /** Bit 4: Has album art available */
    hasArtwork: boolean;
    /** Bit 0: Name exceeds max byte limit (mostly for internal UI logic) */
    isNameTruncated: boolean;
}

/**
 * Parses the raw integer attribute from Yamaha MusicCast into usable flags.
 */
export function getListItemAttributes(item: NetUsbListItem): ListItemAttributes {
    const attr = item.attribute;

    return {
        // Bit 0: 0x01 (1)
        isNameTruncated: (attr & 0x01) !== 0,

        // Bit 1: 0x02 (2) -> Folder/Menu
        isSelectable: (attr & 0x02) !== 0,

        // Bit 2: 0x04 (4) -> Song/Station
        isPlayable: (attr & 0x04) !== 0,

        // Bit 3: 0x08 (8) -> Search Button
        isSearchable: (attr & 0x08) !== 0,

        // Bit 4: 0x10 (16)
        hasArtwork: (attr & 0x10) !== 0,
    };
}