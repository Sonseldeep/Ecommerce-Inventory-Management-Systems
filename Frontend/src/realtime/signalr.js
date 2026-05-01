

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const API_BASE = "https://localhost:7278";

//
// ============================
// 1. PUBLIC PRODUCTS HUB
// (No authentication required)
// ============================
//
export const createProductsHub = () => {
  return new HubConnectionBuilder()
    .withUrl(`${API_BASE}/hubs/products`) // public hub
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
};

//
// ============================
// 2. USER NOTIFICATIONS HUB
// (Requires JWT authentication)
// ============================
//
// export const createNotificationsHub = (token) => {
//   return new HubConnectionBuilder()
//     .withUrl(`${API_BASE}/hubs/notifications`, {
//       accessTokenFactory: () => token, // secure user-specific data
//     })
//     .withAutomaticReconnect()
//     .configureLogging(LogLevel.Information)
//     .build();
// };

export const createNotificationsHub = () => {
  return new HubConnectionBuilder()
    .withUrl(`${API_BASE}/hubs/notifications`, {
      accessTokenFactory: () => localStorage.getItem("accessToken"),
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
};

//
// ============================
// 3. OPTIONAL: ADMIN HUB (if needed)
// ============================
//
// export const createAdminHub = (token) => {
//   return new HubConnectionBuilder()
//     .withUrl(`${API_BASE}/hubs/admin`, {
//       accessTokenFactory: () => token,
//     })
//     .withAutomaticReconnect()
//     .configureLogging(LogLevel.Information)
//     .build();
// };
export const createAdminHub = () => {
  return new HubConnectionBuilder()
    .withUrl(`${API_BASE}/hubs/admin`, {
      accessTokenFactory: () => localStorage.getItem("accessToken"),
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
};