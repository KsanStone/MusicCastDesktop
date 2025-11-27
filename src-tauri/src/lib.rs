use futures::future::try_join_all;
use log::{debug};
use tauri::async_runtime::spawn_blocking;
use yamaha_rs::{DeviceFeatures, DeviceInfo, NetUsbPlayInfo, ResponseCode, SignalInfo, YamahaDevice, ZoneProgramList, ZoneStatus};

#[tauri::command]
async fn discover_devices() -> Vec<YamahaDevice> {
    spawn_blocking(yamaha_rs::discover_yamaha_devices)
        .await
        .unwrap()
}

#[tauri::command]
async fn get_device_info(ip: String) -> Result<DeviceInfo, ResponseCode> {
    spawn_blocking(move || yamaha_rs::get_device_info(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_device_info_all(ips: Vec<String>) -> Vec<Result<DeviceInfo, ResponseCode>> {
    let mut futures = Vec::new();
    for ip in ips {
        debug!("Getting device info for {}", ip);
        futures.push(spawn_blocking(move || yamaha_rs::get_device_info(&ip)));
    }

    let results: Vec<Result<DeviceInfo, ResponseCode>> = try_join_all(futures).await.unwrap();
    debug!("Got device info for {} devices", results.len());
    results
}

#[tauri::command]
async fn get_zone_status(ip: String, zone: String) -> Result<ZoneStatus, ResponseCode> {
    spawn_blocking(move || yamaha_rs::get_zone_status(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_signal_info(ip: String, zone: String) -> Result<SignalInfo, ResponseCode> {
    spawn_blocking(move || yamaha_rs::get_signal_info(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_zone_program_list(ip: String, zone: String) -> Result<ZoneProgramList, ResponseCode> {
    spawn_blocking(move || yamaha_rs::get_zone_program_list(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn toggle_zone_power(ip: String, zone: String) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::toggle_zone_power(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_volume_up(ip: String, zone: String) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_volume_up(&ip, &zone))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_volume_down(ip: String, zone: String) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_volume_down(&ip, &zone))
        .await
        .unwrap()
}


#[tauri::command]
async fn set_enhancer(ip: String, zone: String, enabled: bool) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_enhancer(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_mute(ip: String, zone: String, enabled: bool) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_mute(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_extra_bass(ip: String, zone: String, enabled: bool) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_extra_bass(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_pure_direct(ip: String, zone: String, enabled: bool) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_pure_direct(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_sound_program(ip: String, zone: String, program: String) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_sound_program(&ip, &zone, &program))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_direct(ip: String, zone: String, enabled: bool) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_direct(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_balance(ip: String, zone: String, balance: i32) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_balance(&ip, &zone, balance))
        .await
        .unwrap()
}

#[tauri::command]
async fn get_features(ip: String) -> Result<DeviceFeatures, ResponseCode> {
    spawn_blocking(move || yamaha_rs::get_features(&ip))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_3d_surround(ip: String, zone: String, enabled: bool) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_3d_surround(&ip, &zone, enabled))
        .await
        .unwrap()
}

#[tauri::command]
async fn set_sleep(ip: String, zone: String, time: u32) -> Result<(), ResponseCode> {
    spawn_blocking(move || yamaha_rs::set_sleep(&ip, &zone, time))
        .await
        .unwrap()
}

#[tauri::command]
async fn net_usb_get_play_info(ip: String) -> Result<NetUsbPlayInfo, ResponseCode> {
    spawn_blocking(move || yamaha_rs::net_usb_get_play_info(&ip))
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
            net_usb_get_play_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
