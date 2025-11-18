// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, Submenu};

fn build_native_menu() -> Menu {
    let refresh = CustomMenuItem::new("refresh", "Обновить данные");
    let open_home = CustomMenuItem::new("home", "Открыть главную");
    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "Навигация",
            Menu::new().add_item(open_home).add_item(refresh),
        ));
    menu
}

fn main() {
    tauri::Builder::default()
        .menu(build_native_menu())
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "refresh" => {
                    let _ = event.window().emit("desktop:refresh", ());
                }
                "home" => {
                    let _ = event.window().emit("desktop:navigate-home", ());
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
