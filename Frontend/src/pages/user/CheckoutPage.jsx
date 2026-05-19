import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyAddressesApi } from "../../api/addressApi";
import { checkoutApi } from "../../api/orderApi";

import "./CheckoutPage.css";

const PAYMENT_METHOD_MAP = {
  COD: 1,
  ONLINE: 2,
};

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyAddressesApi();
        const list = res.data?.data || [];
        setAddresses(list);
        const def = list.find((x) => x.isDefault);
        setAddressId(def?.id || list?.[0]?.id || "");
      } catch (e) {
        toast.error(e?.response?.data?.message || "Failed to load addresses");
      }
    })();
  }, []);

  const placeOrder = async () => {
    if (!addressId) return toast.error("Please add/select an address");

    const payload = {
      addressId,
      paymentMethod: PAYMENT_METHOD_MAP[paymentMethod],
    };

    setLoading(true);
    try {
      const res = await checkoutApi(payload);
      toast.success(res.data?.message || "Order placed successfully");
      navigate("/orders");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-card">
        <select
          className="checkout-select"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
        >
          <option value="">Select address</option>
          {addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}, {a.addressLine1}, {a.city}
            </option>
          ))}
        </select>

        <select
          className="checkout-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>

        <button
          className="checkout-btn"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}