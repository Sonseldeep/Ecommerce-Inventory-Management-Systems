/* eslint-disable no-unused-vars */


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
        status: nextStatus,  
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

