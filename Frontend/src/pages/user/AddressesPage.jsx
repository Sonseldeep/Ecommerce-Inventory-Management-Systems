import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createAddressApi,
  deleteAddressApi,
  getMyAddressesApi,
  setDefaultAddressApi,
} from "../../api/addressApi";

const init = {
  fullName: "", phoneNumber: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "Nepal", isDefault: false
};

export default function AddressesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(init);

  const load = async () => {
    const res = await getMyAddressesApi();
    setItems(res.data?.data || []);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createAddressApi(form);
      setForm(init);
      await load();
      toast.success("Address added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white p-4 rounded-xl shadow space-y-2">
        <h2 className="font-bold text-lg">Add Address</h2>
        {Object.keys(init).filter(k=>k!=="isDefault").map((k)=>(
          <input key={k} className="w-full border p-2 rounded" placeholder={k}
            value={form[k]} onChange={(e)=>setForm(s=>({...s,[k]:e.target.value}))}/>
        ))}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isDefault}
            onChange={(e)=>setForm(s=>({...s,isDefault:e.target.checked}))}/>
          Set default
        </label>
        <button className="bg-black text-white px-4 py-2 rounded">Save</button>
      </form>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg mb-3">My Addresses</h2>
        <div className="space-y-2">
          {items.map(a=>(
            <div key={a.id} className="border rounded p-3">
              <p>{a.fullName}, {a.addressLine1}, {a.city}</p>
              <div className="flex gap-3 mt-2 text-sm">
                {!a.isDefault && <button onClick={async()=>{await setDefaultAddressApi(a.id); load();}} className="text-blue-600">Set default</button>}
                <button onClick={async()=>{await deleteAddressApi(a.id); load();}} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}