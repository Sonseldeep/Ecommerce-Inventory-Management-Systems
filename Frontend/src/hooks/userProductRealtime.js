// import { useEffect } from "react";
// import { createProductsHub } from "../realtime/signalr";


// export default function useProductRealtime(onUpdate) {
//   useEffect(() => {
//     // const token = localStorage.getItem("accessToken");
//     // const hub = createProductsHub(token);
//     const hub = createProductsHub();

//     hub.start().catch(console.error);

//     hub.on("ProductUpdated", (product) => onUpdate(product));
//     hub.on("ProductCreated", (product) => onUpdate(product, true));

//     return () => {
//       hub.stop();
//     };
//   }, [onUpdate]);
// }


// src/hooks/useProductRealtime.js

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
      // IMPORTANT: remove listeners
      hub.off("ProductUpdated", handleUpdate);
      hub.off("ProductCreated", handleCreate);

      hub.stop();
    };
  }, [onUpdate]);
}