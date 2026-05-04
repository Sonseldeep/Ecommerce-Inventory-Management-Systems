// import { useEffect } from "react";
// import { createNotificationsHub, createProductsHub } from "../realtime/signalr";

// export default function useAdminAnalyticsRealtime(onRefresh) {
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");

//     const notificationsHub = createNotificationsHub(token);
//     const productsHub = createProductsHub(token);

//     notificationsHub.start().catch(console.error);
//     productsHub.start().catch(console.error);

//     notificationsHub.on("OrderPlaced", () => onRefresh());
//     productsHub.on("ProductUpdated", () => onRefresh());
//     productsHub.on("ProductCreated", () => onRefresh());

//     return () => {
//       notificationsHub.stop();
//       productsHub.stop();
//     };
//   }, [onRefresh]);
// }




// src/hooks/useAdminAnalyticsRealtime.js

import { useEffect } from "react";
import {
  createNotificationsHub,
  createProductsHub,
} from "../realtime/signalr";

export default function useAdminAnalyticsRealtime(onRefresh) {
  useEffect(() => {
    const notificationsHub = createNotificationsHub();
    const productsHub = createProductsHub();

    const refresh = () => onRefresh();

    notificationsHub.start().catch(console.error);
    productsHub.start().catch(console.error);

    notificationsHub.on("OrderPlaced", refresh);
    productsHub.on("ProductUpdated", refresh);
    productsHub.on("ProductCreated", refresh);

    return () => {
      // cleanup listeners (CRITICAL)
      notificationsHub.off("OrderPlaced", refresh);
      productsHub.off("ProductUpdated", refresh);
      productsHub.off("ProductCreated", refresh);

      notificationsHub.stop();
      productsHub.stop();
    };
  }, [onRefresh]);
}