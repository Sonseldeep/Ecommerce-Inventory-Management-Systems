/* eslint-disable no-unused-vars */
// v2 working 
// import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
// import { ORDER_STATUSES, isStatusLocked, canTransitionTo } from "../../constants/orderStatusConfig";

// export function useOrderStatusUpdate(updateOrderApi) {
//   const [isUpdating, setIsUpdating] = useState(false);

//   const updateStatus = useCallback(
//     async (orderId, currentStatus, newStatus) => {
//       // Validation 1: Check if current status is locked
//       if (isStatusLocked(currentStatus)) {
//         const lockedMessage =
//           currentStatus === "DELIVERED"
//             ? "Order already delivered. No further changes allowed."
//             : "Order is cancelled. No changes can be made.";
//         toast.error(lockedMessage);
//         return false;
//       }

//       // Validation 2: Check if transition is allowed
//       if (!canTransitionTo(currentStatus, newStatus)) {
//         toast.error(
//           `Cannot change status from ${currentStatus} to ${newStatus}`
//         );
//         return false;
//       }

//       setIsUpdating(true);
//       try {
//         // Call backend API
//         await updateOrderApi(orderId, { status: newStatus });

//         const newStatusLabel = ORDER_STATUSES[newStatus]?.label || newStatus;
//         toast.success(`Order status updated to ${newStatusLabel}`);
//         return true;
//       } catch (err) {
//         const errorMsg = err?.response?.data?.message;

//         // Check for specific error messages from backend
//         if (errorMsg?.includes("already")) {
//           toast.error("Order status update failed. Status may have changed.");
//         } else if (errorMsg?.includes("cannot")) {
//           toast.error(errorMsg);
//         } else {
//           toast.error(errorMsg || "Failed to update order status");
//         }
//         return false;
//       } finally {
//         setIsUpdating(false);
//       }
//     },
//     [updateOrderApi]
//   );

//   return {
//     updateStatus,
//     isUpdating,
//   };
// }

import { useState } from "react";
import toast from "react-hot-toast";
import {
  canTransitionTo,
  isStatusLocked,
} from "../constants/orderTransitionRules";

export function useOrderStatusUpdate(updateOrderApi) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (orderId, current, next) => {
    const nextStatus = Number(next);

    if (isStatusLocked(current)) {
      toast.error("This order is locked");
      return false;
    }

    if (!canTransitionTo(current, nextStatus)) {
      toast.error(`Invalid: ${current} → ${nextStatus}`);
      return false;
    }

    setIsUpdating(true);

    try {
      await updateOrderApi(orderId, {
        status: nextStatus,   // ✅ FIXED HERE
      });

      toast.success("Order updated successfully");
      return true;
    } catch (err) {
      console.log("UPDATE ERROR:", err?.response?.data);

      toast.error(
        err?.response?.data?.message || "Failed to update order"
      );

      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStatus, isUpdating };
}

// import { useState, useCallback } from "react";
// import toast from "react-hot-toast";
// import { ORDER_STATUSES, isStatusLocked, canTransitionTo } from "../../../constants/orderStatusConfig";

// export function useOrderStatusUpdate(updateOrderApi) {
//   const [isUpdating, setIsUpdating] = useState(false);

//   const updateStatus = useCallback(
//     async (orderId, currentStatus, newStatus) => {
//       // Validation 1: Check if current status is locked
//       if (isStatusLocked(currentStatus)) {
//         const config = ORDER_STATUSES[currentStatus];
//         toast.error(
//           currentStatus === "DELIVERED"
//             ? "Order already delivered. No further changes allowed."
//             : "Order is cancelled. No changes can be made."
//         );
//         return false;
//       }

//       // Validation 2: Check if transition is allowed
//       if (!canTransitionTo(currentStatus, newStatus)) {
//         toast.error(`Cannot change from ${currentStatus} to ${newStatus}`);
//         return false;
//       }

//       setIsUpdating(true);
//       try {
//         // Call backend API
//         await updateOrderApi(orderId, { status: newStatus });
        
//         toast.success(`Order status updated to ${ORDER_STATUSES[newStatus].label}`);
//         return true;
//       } catch (err) {
//         const errorMsg = err?.response?.data?.message;
        
//         // Check for specific error messages from backend
//         if (errorMsg?.includes("already")) {
//           toast.error("Order status update failed. Status may have changed.");
//         } else {
//           toast.error(errorMsg || "Failed to update order status");
//         }
//         return false;
//       } finally {
//         setIsUpdating(false);
//       }
//     },
//     [updateOrderApi]
//   );

//   return {
//     updateStatus,
//     isUpdating,
//   };
// }