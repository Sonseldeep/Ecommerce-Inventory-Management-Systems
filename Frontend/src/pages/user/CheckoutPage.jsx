

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyAddressesApi } from "../../api/addressApi";
import { checkoutApi } from "../../api/orderApi";

// map UI values -> backend enum int
const PAYMENT_METHOD_MAP = {
  COD: 1,
  ONLINE: 2, // adjust if your enum is different
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
      paymentMethod: PAYMENT_METHOD_MAP[paymentMethod], // send int
    };

    setLoading(true);
    try {
      const res = await checkoutApi(payload);
      toast.success(res.data?.message || "Order placed successfully");
      navigate("/orders");
    } catch (e) {
      console.log("checkout error", e?.response?.data);
      toast.error(e?.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <select
          className="w-full border p-2 rounded-lg"
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
          className="w-full border p-2 rounded-lg"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>

        <button
          className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-60"
          onClick={placeOrder}
          disabled={loading}
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}