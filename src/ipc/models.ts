export type StatusCode = string;

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
}
