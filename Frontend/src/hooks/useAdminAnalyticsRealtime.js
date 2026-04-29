import { useEffect } from "react";
import { createNotificationsHub, createProductsHub } from "../realtime/signalr";

export default function useAdminAnalyticsRealtime(onRefresh) {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const notificationsHub = createNotificationsHub(token);
    const productsHub = createProductsHub(token);

    notificationsHub.start().catch(console.error);
    productsHub.start().catch(console.error);

    notificationsHub.on("OrderPlaced", () => onRefresh());
    productsHub.on("ProductUpdated", () => onRefresh());
    productsHub.on("ProductCreated", () => onRefresh());

    return () => {
      notificationsHub.stop();
      productsHub.stop();
    };
  }, [onRefresh]);
}