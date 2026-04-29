import { useEffect } from "react";
import { createProductsHub } from "../realtime/signalr";


export default function useProductRealtime(onUpdate) {
  useEffect(() => {
    // const token = localStorage.getItem("accessToken");
    // const hub = createProductsHub(token);
    const hub = createProductsHub();

    hub.start().catch(console.error);

    hub.on("ProductUpdated", (product) => onUpdate(product));
    hub.on("ProductCreated", (product) => onUpdate(product, true));

    return () => {
      hub.stop();
    };
  }, [onUpdate]);
}