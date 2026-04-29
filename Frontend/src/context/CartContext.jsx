


import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMyCartApi } from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  const refreshCartCount = async () => {
    if (!isAuthenticated) return setCount(0);
    try {
      const res = await getMyCartApi();
      const items = res.data?.data?.items || [];
      setCount(items.reduce((s, i) => s + Number(i.quantity || 0), 0));
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCartCount();
  }, [isAuthenticated]);

  const value = useMemo(() => ({ count, refreshCartCount }), [count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);