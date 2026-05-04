

// import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

// const API_BASE = "https://localhost:7278";


// export const createProductsHub = () => {
//   return new HubConnectionBuilder()
//     .withUrl(`${API_BASE}/hubs/products`) // public hub
//     .withAutomaticReconnect()
//     .configureLogging(LogLevel.Information)
//     .build();
// };


// export const createNotificationsHub = () => {
//   return new HubConnectionBuilder()
//     .withUrl(`${API_BASE}/hubs/notifications`, {
//       accessTokenFactory: () => localStorage.getItem("accessToken"),
//     })
//     .withAutomaticReconnect()
//     .configureLogging(LogLevel.Information)
//     .build();
// };


// export const createAdminHub = () => {
//   return new HubConnectionBuilder()
//     .withUrl(`${API_BASE}/hubs/admin`, {
//       accessTokenFactory: () => localStorage.getItem("accessToken"),
//     })
//     .withAutomaticReconnect()
//     .configureLogging(LogLevel.Information)
//     .build();
// };




// src/realtime/signalr.js

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const API_BASE = "https://localhost:7278";

/**
 * Generic hub builder (clean + reusable)
 */
const createHub = (url, useAuth = false) => {
  return new HubConnectionBuilder()
    .withUrl(url, useAuth
      ? {
          accessTokenFactory: () => localStorage.getItem("accessToken"),
        }
      : undefined
    )
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();
};

// Public hub (no token)
export const createProductsHub = () =>
  createHub(`${API_BASE}/hubs/products`, false);

// Auth hub (requires token)
export const createNotificationsHub = () =>
  createHub(`${API_BASE}/hubs/notifications`, true);

export const createAdminHub = () =>
  createHub(`${API_BASE}/hubs/admin`, true);