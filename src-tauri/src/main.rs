#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Menu, MenuItem, Submenu};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // https://tauri.app/zh/v1/guides/features/menu
    // 这里使用内置菜单项
    // 自定义菜单项可以使用CustomMenuItem，结合事件监听做处理
    let submenu_main = Submenu::new(
        "QRCode".to_string(),
        Menu::new()
            .add_native_item(MenuItem::Minimize)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow)
            .add_native_item(MenuItem::Quit),
    );

    let menu = Menu::new().add_submenu(submenu_main);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
