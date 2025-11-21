use futures::future::try_join_all;
use log::{debug, info};
use tauri::async_runtime::spawn_blocking;
use yamaha_rs::{DeviceInfo, ResponseCode, SignalInfo, YamahaDevice, ZoneProgramList, ZoneStatus};

#[tauri::command]
async fn discover_devices() -> Vec<YamahaDevice>{
    spawn_blocking(yamaha_rs::discover_yamaha_devices).await.unwrap()
}

#[tauri::command]
async fn get_device_info(ip: String) -> Result<DeviceInfo, ResponseCode> {
    spawn_blocking(move || {
        yamaha_rs::get_device_info(&ip)
    }).await.unwrap()
}

#[tauri::command]
async fn get_device_info_all(ips: Vec<String>) -> Vec<Result<DeviceInfo, ResponseCode>> {
    let mut futures = Vec::new();
    for ip in ips {
        debug!("Getting device info for {}", ip);
        futures.push(spawn_blocking(move || {
            yamaha_rs::get_device_info(&ip)
        }));
    }

    let results: Vec<Result<DeviceInfo, ResponseCode>> = try_join_all(futures).await.unwrap();
    debug!("Got device info for {} devices", results.len());
    results
}

#[tauri::command]
async fn get_zone_status(ip: String, zone: String) -> Result<ZoneStatus, ResponseCode> {
    spawn_blocking(move || {
        yamaha_rs::get_zone_status(&ip, &zone)
    }).await.unwrap()
}

#[tauri::command]
async fn get_signal_info(ip: String, zone: String) -> Result<SignalInfo, ResponseCode> {
    spawn_blocking(move || {
        yamaha_rs::get_signal_info(&ip, &zone)
    }).await.unwrap()
}

#[tauri::command]
async fn get_zone_program_list(ip: String, zone: String) -> Result<ZoneProgramList, ResponseCode> {
    spawn_blocking(move || {
        yamaha_rs::get_zone_program_list(&ip, &zone)
    }).await.unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![discover_devices, get_device_info, get_zone_status, get_signal_info, get_zone_program_list, get_device_info_all])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
