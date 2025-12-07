use futures::future::try_join_all;
use log::debug;
use tauri::async_runtime::spawn_blocking;
use yamaha_rs::enums::{ListControl, Playback, Repeat, Shuffle};
use yamaha_rs::{
    DeviceFeatures, DeviceInfo, ListInfo, NetUsbPlayInfo, RecentInfo, SignalInfo, YamahaDevice,
    YpaoConfig, ZoneProgramList, ZoneStatus,
};

#[tauri::command]
async fn discover_devices() -> Vec<YamahaDevice> {
    spawn_blocking(yamaha_rs::discover_yamaha_devices)
        .await
        .unwrap()
}

#[tauri::command]
async fn get_device_info(ip: String) -> Result<DeviceInfo, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::get_device_info(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_device_info_all(ips: Vec<String>) -> Vec<Result<DeviceInfo, yamaha_rs::error::Error>> {
    let mut futures = Vec::new();
    for ip in ips {
        debug!("Getting device info for {}", ip);
        futures.push(spawn_blocking(move || yamaha_rs::get_device_info(&ip)));
    }

    let results: Vec<Result<DeviceInfo, yamaha_rs::error::Error>> =
        try_join_all(futures).await.unwrap();
    debug!("Got device info for {} devices", results.len());
    results
}

#[tauri::command]
async fn get_zone_status(ip: String, zone: String) -> Result<ZoneStatus, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::get_zone_status(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_signal_info(ip: String, zone: String) -> Result<SignalInfo, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::get_signal_info(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_zone_program_list(
    ip: String,
    zone: String,
) -> Result<ZoneProgramList, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::get_zone_program_list(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn toggle_zone_power(ip: String, zone: String) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::toggle_zone_power(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_volume_up(ip: String, zone: String) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_volume_up(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_volume_down(ip: String, zone: String) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_volume_down(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_enhancer(
    ip: String,
    zone: String,
    enabled: bool,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_enhancer(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_mute(ip: String, zone: String, enabled: bool) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_mute(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_extra_bass(
    ip: String,
    zone: String,
    enabled: bool,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_extra_bass(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_pure_direct(
    ip: String,
    zone: String,
    enabled: bool,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_pure_direct(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_sound_program(
    ip: String,
    zone: String,
    program: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_sound_program(&ip, &zone, &program))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_direct(
    ip: String,
    zone: String,
    enabled: bool,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_direct(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_balance(
    ip: String,
    zone: String,
    balance: i32,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_balance(&ip, &zone, balance))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_features(ip: String) -> Result<DeviceFeatures, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::get_features(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_3d_surround(
    ip: String,
    zone: String,
    enabled: bool,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_3d_surround(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_sleep(ip: String, zone: String, time: u32) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_sleep(&ip, &zone, time))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_get_play_info(ip: String) -> Result<NetUsbPlayInfo, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_get_play_info(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_set_playback(
    ip: String,
    playback: Playback,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_set_playback(&ip, playback))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_set_repeat(ip: String, mode: Repeat) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_set_repeat(&ip, mode))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_set_shuffle(ip: String, mode: Shuffle) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_set_shuffle(&ip, mode))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_toggle_repeat(ip: String) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_toggle_repeat(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_toggle_shuffle(ip: String) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_toggle_shuffle(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_get_list_info(
    ip: String,
    input: String,
    index: u32,
    size: u32,
) -> Result<ListInfo, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_get_list_info(&ip, &input, index, size, "en"))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_set_list_control(
    ip: String,
    list_id: String,
    control_type: ListControl,
    index: Option<u32>,
    zone: Option<String>,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || {
        yamaha_rs::net_usb_set_list_control(&ip, &list_id, control_type, index, zone.as_deref())
    })
    .await
    .unwrap()
}

#[tauri::command]
async fn net_usb_set_search_string(
    ip: String,
    list_id: String,
    search_text: String,
    index: Option<u32>,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_set_search_string(&ip, &list_id, &search_text, index))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_input(ip: String, input: String, zone: String) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_input(&ip, &zone, &input))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_subwoofer_volume(
    ip: String,
    volume: i32,
    zone: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_subwoofer_volume(&ip, &zone, volume))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_dialogue_lift(
    ip: String,
    value: i32,
    zone: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_dialogue_lift(&ip, &zone, value))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_dialogue_level(
    ip: String,
    value: i32,
    zone: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_dialogue_level(&ip, &zone, value))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_dts_dialogue_control(
    ip: String,
    value: i32,
    zone: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_dts_dialogue_control(&ip, &zone, value))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_tone_bass(
    ip: String,
    value: i32,
    zone: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_tone_bass(&ip, &zone, value))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_tone_treble(
    ip: String,
    value: i32,
    zone: String,
) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_tone_treble(&ip, &zone, value))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_volume(ip: String, zone: String, volume: i32) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_volume(&ip, &zone, volume))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_ypao_config(ip: String) -> Result<YpaoConfig, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::get_ypao_config(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_ypao_volume(ip: String, enabled: bool) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::set_ypao_volume(&ip, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_get_recent_info(ip: String) -> Result<RecentInfo, yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_get_recent_info(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_play_position(ip: String, position: u32) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_set_play_position(&ip, position))
        .await
        .unwrap()
}

#[tauri::command]
async fn recall_recent_item(ip: String, zone: String, item: u32) -> Result<(), yamaha_rs::error::Error> {
    spawn_blocking(move || yamaha_rs::net_usb_recall_recent(&ip, &zone, item))
        .await
        .unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            discover_devices,
            get_device_info,
            get_zone_status,
            get_signal_info,
            get_zone_program_list,
            get_device_info_all,
            toggle_zone_power,
            set_volume_up,
            set_volume_down,
            set_enhancer,
            set_mute,
            set_extra_bass,
            set_pure_direct,
            set_sound_program,
            set_direct,
            set_balance,
            get_features,
            set_3d_surround,
            set_sleep,
            net_usb_get_play_info,
            net_usb_get_play_info,
            net_usb_set_playback,
            net_usb_set_repeat,
            net_usb_set_shuffle,
            net_usb_toggle_repeat,
            net_usb_toggle_shuffle,
            net_usb_get_list_info,
            net_usb_set_list_control,
            net_usb_set_search_string,
            set_input,
            set_subwoofer_volume,
            set_dialogue_lift,
            set_dialogue_level,
            set_dts_dialogue_control,
            set_tone_bass,
            set_tone_treble,
            set_volume,
            get_ypao_config,
            set_ypao_volume,
            net_usb_get_recent_info,
            set_play_position,
            recall_recent_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
