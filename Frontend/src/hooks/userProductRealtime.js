import { useEffect } from "react";
import { createProductsHub } from "../realtime/signalr";

export default function useProductRealtime(onUpdate) {
  useEffect(() => {
    const hub = createProductsHub();

    const handleUpdate = (product) => onUpdate(product);
    const handleCreate = (product) => onUpdate(product, true);

    hub.start().catch(console.error);

    hub.on("ProductUpdated", handleUpdate);
    hub.on("ProductCreated", handleCreate);

    return () => {
      hub.off("ProductUpdated", handleUpdate);
      hub.off("ProductCreated", handleCreate);

      hub.stop();
    };
  }, [onUpdate]);
}