

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCategoriesApi } from "../../api/categoryApi";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
  uploadProductImagesApi,
} from "../../api/productApi";

const emptyForm = {
  name: "", sku: "", description: "", price: "", discountPrice: "",
  quantityInStock: 0, reorderLevel: 0, categoryId: "", isActive: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [pRes, cRes] = await Promise.all([
      getProductsApi({ pageNumber: 1, pageSize: 50 }),
      getCategoriesApi()
    ]);

    setProducts(pRes.data?.data?.items || []);
    setCategories(cRes.data?.data || []);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setFiles([]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
        quantityInStock: Number(form.quantityInStock),
        reorderLevel: Number(form.reorderLevel),
      };

      let productId = editId;

      if (editId) {
        await updateProductApi(editId, payload);
        toast.success("Product updated");
      } else {
        const res = await createProductApi(payload);
        productId = res.data?.data?.id;
        toast.success("Product created");
      }

      if (productId && files.length > 0) {
        await uploadProductImagesApi(productId, files);
        toast.success("Images uploaded");
      }

      resetForm();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition";

  return (
    <div className="p-6 max-w-7xl mx-auto grid lg:grid-cols-[380px_1fr] gap-6">
      {/* LEFT FORM */}
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border p-5 space-y-4 sticky top-6 h-fit">
        <div>
          <h2 className="text-xl font-semibold">{editId ? "Edit Product" : "Create Product"}</h2>
          <p className="text-xs text-gray-500 mt-1">Manage your product details</p>
        </div>

        <input className={inputClass} placeholder="Product Name"
          value={form.name}
          onChange={(e)=>setForm(s=>({...s,name:e.target.value}))}
          required
        />

        <input className={inputClass} placeholder="SKU"
          value={form.sku}
          onChange={(e)=>setForm(s=>({...s,sku:e.target.value}))}
          disabled={!!editId}
          required
        />

        <textarea className={inputClass} placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e)=>setForm(s=>({...s,description:e.target.value}))}
        />

        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} type="number" placeholder="Price"
            value={form.price}
            onChange={(e)=>setForm(s=>({...s,price:e.target.value}))}
            required
          />

          <input className={inputClass} type="number" placeholder="Discount"
            value={form.discountPrice}
            onChange={(e)=>setForm(s=>({...s,discountPrice:e.target.value}))}
          />
        </div>

        <input className={inputClass} type="number" placeholder="Stock"
          value={form.quantityInStock}
          onChange={(e)=>setForm(s=>({...s,quantityInStock:e.target.value}))}
        />

        <select className={inputClass}
          value={form.categoryId}
          onChange={(e)=>setForm(s=>({...s,categoryId:e.target.value}))}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="border border-dashed rounded-lg p-3 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Product Images</p>
          <input type="file" multiple
            onChange={(e)=>setFiles(Array.from(e.target.files || []))}
            className="text-sm"
          />
        </div>

        <button disabled={loading} className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60">
          {loading ? "Saving..." : editId ? "Update Product" : "Create Product"}
        </button>

        {editId && (
          <button type="button" onClick={resetForm} className="w-full text-sm text-gray-500 hover:text-black">
            Cancel Edit
          </button>
        )}
      </form>

      {/* RIGHT TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <span className="text-xs text-gray-500">Total: {products.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-3">Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td>₹ {p.price}</td>
                  <td>{p.quantityInStock}</td>

                  <td className="text-right space-x-3">
                    <button className="text-blue-600 hover:underline"
                      onClick={() => { setEditId(p.id); setForm({ ...p }); }}
                    >
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline"
                      onClick={async () => { if (confirm("Delete product?")) { await deleteProductApi(p.id); load(); } }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!products.length && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// v3

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getCategoriesApi } from "../../api/categoryApi";
// import {
//   createProductApi,
//   deleteProductApi,
//   getProductsApi,
//   updateProductApi,
//   uploadProductImagesApi,
// } from "../../api/productApi";

// const emptyForm = {
//   name: "", sku: "", description: "", price: "", discountPrice: "",
//   quantityInStock: 0, reorderLevel: 0, categoryId: "", isActive: true,
// };

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editId, setEditId] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const load = async () => {
//     const [pRes, cRes] = await Promise.all([getProductsApi(), getCategoriesApi()]);
//     setProducts(pRes.data?.data || []);
//     setCategories(cRes.data?.data || []);
//   };

//   // eslint-disable-next-line react-hooks/set-state-in-effect
//   useEffect(() => { load(); }, []);

//   const resetForm = () => {
//     setForm(emptyForm);
//     setEditId(null);
//     setFiles([]);
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
//         quantityInStock: Number(form.quantityInStock),
//         reorderLevel: Number(form.reorderLevel),
//       };

//       let productId = editId;

//       if (editId) {
//         await updateProductApi(editId, payload);
//         toast.success("Product updated");
//       } else {
//         const res = await createProductApi(payload);
//         productId = res.data?.data?.id;
//         toast.success("Product created");
//       }

//       if (productId && files.length > 0) {
//         await uploadProductImagesApi(productId, files);
//         toast.success("Images uploaded");
//       }

//       resetForm();
//       load();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass =
//     "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition";

//   return (
//     <div className="p-6 max-w-7xl mx-auto grid lg:grid-cols-[380px_1fr] gap-6">

//       {/* LEFT FORM */}
//       <form
//         onSubmit={submit}
//         className="bg-white rounded-2xl shadow-sm border p-5 space-y-4 sticky top-6 h-fit"
//       >
//         <div>
//           <h2 className="text-xl font-semibold">
//             {editId ? "Edit Product" : "Create Product"}
//           </h2>
//           <p className="text-xs text-gray-500 mt-1">
//             Manage your product details
//           </p>
//         </div>

//         <input className={inputClass} placeholder="Product Name"
//           value={form.name}
//           onChange={(e)=>setForm(s=>({...s,name:e.target.value}))}
//           required
//         />

//         <input className={inputClass} placeholder="SKU"
//           value={form.sku}
//           onChange={(e)=>setForm(s=>({...s,sku:e.target.value}))}
//           disabled={!!editId}
//           required
//         />

//         <textarea className={inputClass} placeholder="Description"
//           rows={3}
//           value={form.description}
//           onChange={(e)=>setForm(s=>({...s,description:e.target.value}))}
//         />

//         <div className="grid grid-cols-2 gap-3">
//           <input className={inputClass} type="number" placeholder="Price"
//             value={form.price}
//             onChange={(e)=>setForm(s=>({...s,price:e.target.value}))}
//             required
//           />

//           <input className={inputClass} type="number" placeholder="Discount"
//             value={form.discountPrice}
//             onChange={(e)=>setForm(s=>({...s,discountPrice:e.target.value}))}
//           />
//         </div>

//         <input className={inputClass} type="number" placeholder="Stock"
//           value={form.quantityInStock}
//           onChange={(e)=>setForm(s=>({...s,quantityInStock:e.target.value}))}
//         />

//         <select className={inputClass}
//           value={form.categoryId}
//           onChange={(e)=>setForm(s=>({...s,categoryId:e.target.value}))}
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map((c) => (
//             <option key={c.id} value={c.id}>{c.name}</option>
//           ))}
//         </select>

//         {/* IMAGE UPLOAD */}
//         <div className="border border-dashed rounded-lg p-3 bg-gray-50">
//           <p className="text-xs text-gray-600 mb-2">Product Images</p>
//           <input type="file" multiple
//             onChange={(e)=>setFiles(Array.from(e.target.files || []))}
//             className="text-sm"
//           />
//         </div>

//         {/* BUTTONS */}
//         <button
//           disabled={loading}
//           className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60"
//         >
//           {loading ? "Saving..." : editId ? "Update Product" : "Create Product"}
//         </button>

//         {editId && (
//           <button
//             type="button"
//             onClick={resetForm}
//             className="w-full text-sm text-gray-500 hover:text-black"
//           >
//             Cancel Edit
//           </button>
//         )}
//       </form>

//       {/* RIGHT TABLE */}
//       <div className="bg-white rounded-2xl shadow-sm border p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Products</h2>
//           <span className="text-xs text-gray-500">
//             Total: {products.length}
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-left text-gray-500 border-b">
//               <tr>
//                 <th className="py-3">Product</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th className="text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {products.map((p) => (
//                 <tr key={p.id} className="hover:bg-gray-50 transition">
//                   <td className="py-3 font-medium">{p.name}</td>
//                   <td>₹ {p.price}</td>
//                   <td>{p.quantityInStock}</td>

//                   <td className="text-right space-x-3">
//                     <button
//                       className="text-blue-600 hover:underline"
//                       onClick={() => {
//                         setEditId(p.id);
//                         setForm({ ...p });
//                       }}
//                     >
//                       Edit
//                     </button>

//                     <button
//                       className="text-red-600 hover:underline"
//                       onClick={async () => {
//                         if (confirm("Delete product?")) {
//                           await deleteProductApi(p.id);
//                           load();
//                         }
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {!products.length && (
//                 <tr>
//                   <td colSpan="4" className="text-center py-10 text-gray-400">
//                     No products found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// v2

// const emptyForm = {
//   name: "", sku: "", description: "", price: "", discountPrice: "",
//   quantityInStock: 0, reorderLevel: 0, categoryId: "", isActive: true,
// };

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editId, setEditId] = useState(null);
//   const [files, setFiles] = useState([]);

//   const load = async () => {
//     try {
//       const [pRes, cRes] = await Promise.all([getProductsApi(), getCategoriesApi()]);
//       setProducts(pRes.data?.data || []);
//       setCategories(cRes.data?.data || []);
//     // eslint-disable-next-line no-unused-vars
//     } catch (err) { toast.error("Failed to load data"); }
//   };

//   // eslint-disable-next-line react-hooks/set-state-in-effect
//   useEffect(() => { load(); }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
//         quantityInStock: Number(form.quantityInStock),
//         reorderLevel: Number(form.reorderLevel),
//       };

//       let productId = editId;

//       // 1. Save Text Data
//       if (editId) {
//         await updateProductApi(editId, payload);
//         toast.success("Product updated");
//       } else {
//         const res = await createProductApi(payload);
//         productId = res.data?.data?.id;
//         toast.success("Product created");
//       }

//       // 2. Upload Images
//       if (productId && files.length > 0) {
//         try {
//           await uploadProductImagesApi(productId, files);
//           toast.success("Images uploaded successfully");
//         } catch (uploadErr) {
//           console.error("Upload error details:", uploadErr?.response?.data);
//           // Showing specific error message from backend
//           toast.error(uploadErr?.response?.data?.message || "Product saved, but image upload failed");
//         }
//       }

//       // 3. Cleanup
//       setForm(emptyForm);
//       setEditId(null);
//       setFiles([]);
//       e.target.reset(); 
//       load();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Operation failed");
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">Manage Inventory</h1>

//       <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-sm border grid md:grid-cols-2 gap-4">
//         <input className="border p-2 rounded" placeholder="Product Name" value={form.name} onChange={(e)=>setForm(s=>({...s,name:e.target.value}))} required />
//         <input className="border p-2 rounded" placeholder="SKU" value={form.sku} onChange={(e)=>setForm(s=>({...s,sku:e.target.value}))} required disabled={!!editId} />
//         <textarea className="border p-2 rounded md:col-span-2" placeholder="Description" value={form.description} onChange={(e)=>setForm(s=>({...s,description:e.target.value}))} />
//         <input className="border p-2 rounded" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e)=>setForm(s=>({...s,price:e.target.value}))} required />
//         <input className="border p-2 rounded" type="number" step="0.01" placeholder="Discount Price" value={form.discountPrice} onChange={(e)=>setForm(s=>({...s,discountPrice:e.target.value}))} />
//         <input className="border p-2 rounded" type="number" placeholder="Stock" value={form.quantityInStock} onChange={(e)=>setForm(s=>({...s,quantityInStock:e.target.value}))} />
        
//         <select className="border p-2 rounded" value={form.categoryId} onChange={(e)=>setForm(s=>({...s,categoryId:e.target.value}))} required>
//           <option value="">Select Category</option>
//           {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>

//         <div className="md:col-span-2 bg-gray-50 p-3 rounded border border-dashed">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
//           <input type="file" multiple onChange={(e)=>setFiles(Array.from(e.target.files || []))} className="text-sm" />
//         </div>

//         <div className="md:col-span-2 flex items-center gap-4">
//           <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
//             {editId ? "Save Changes" : "Create Product"}
//           </button>
//           {editId && (
//             <button type="button" className="text-gray-500 underline" onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel</button>
//           )}
//         </div>
//       </form>

//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-50 border-b">
//             <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Actions</th></tr>
//           </thead>
//           <tbody className="divide-y">
//             {products.map((p) => (
//               <tr key={p.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-3 font-medium">{p.name}</td>
//                 <td className="px-4 py-3">${p.price}</td>
//                 <td className="px-4 py-3">{p.quantityInStock}</td>
//                 <td className="px-4 py-3 space-x-3">
//                   <button className="text-blue-600" onClick={() => { setEditId(p.id); setForm({...p}); }}>Edit</button>
//                   <button className="text-red-600" onClick={async () => { if(confirm("Delete?")) { await deleteProductApi(p.id); load(); } }}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getCategoriesApi } from "../../api/categoryApi";
// import {
//   createProductApi,
//   deleteProductApi,
//   getProductsApi,
//   updateProductApi,
//   uploadProductImagesApi,
// } from "../../api/productApi";

// const emptyForm = {
//   name: "", sku: "", description: "", price: "", discountPrice: "",
//   quantityInStock: 0, reorderLevel: 0, categoryId: "", isActive: true,
// };

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editId, setEditId] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const load = async () => {
//     const [pRes, cRes] = await Promise.all([getProductsApi(), getCategoriesApi()]);
//     setProducts(pRes.data?.data || []);
//     setCategories(cRes.data?.data || []);
//   };

//   // eslint-disable-next-line react-hooks/set-state-in-effect
//   useEffect(() => { load(); }, []);

//   const resetForm = () => {
//     setForm(emptyForm);
//     setEditId(null);
//     setFiles([]);
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price),
//         discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
//         quantityInStock: Number(form.quantityInStock),
//         reorderLevel: Number(form.reorderLevel),
//       };

//       let productId = editId;

//       if (editId) {
//         await updateProductApi(editId, payload);
//         toast.success("Product updated");
//       } else {
//         const res = await createProductApi(payload);
//         productId = res.data?.data?.id;
//         toast.success("Product created");
//       }

//       if (productId && files.length > 0) {
//         await uploadProductImagesApi(productId, files);
//         toast.success("Images uploaded successfully");
//       }

//       resetForm();
//       await load();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto grid lg:grid-cols-[360px_1fr] gap-6">
//       {/* Left Form */}
//       <form onSubmit={submit} className="bg-white rounded-2xl shadow p-5 space-y-3 sticky top-20 h-fit">
//         <h2 className="text-xl font-bold">{editId ? "Edit Product" : "Create Product"}</h2>

//         <input className="border p-2 rounded" placeholder="Product Name" value={form.name}
//           onChange={(e)=>setForm(s=>({...s,name:e.target.value}))} required />

//         <input className="border p-2 rounded" placeholder="SKU" value={form.sku}
//           onChange={(e)=>setForm(s=>({...s,sku:e.target.value}))} required disabled={!!editId} />

//         <textarea className="border p-2 rounded" placeholder="Description" value={form.description}
//           onChange={(e)=>setForm(s=>({...s,description:e.target.value}))} />

//         <input className="border p-2 rounded" type="number" step="0.01" placeholder="Price"
//           value={form.price} onChange={(e)=>setForm(s=>({...s,price:e.target.value}))} required />

//         <input className="border p-2 rounded" type="number" step="0.01" placeholder="Discount Price"
//           value={form.discountPrice} onChange={(e)=>setForm(s=>({...s,discountPrice:e.target.value}))} />

//         <input className="border p-2 rounded" type="number" placeholder="Stock"
//           value={form.quantityInStock} onChange={(e)=>setForm(s=>({...s,quantityInStock:e.target.value}))} />

//         <select className="border p-2 rounded" value={form.categoryId}
//           onChange={(e)=>setForm(s=>({...s,categoryId:e.target.value}))} required>
//           <option value="">Select Category</option>
//           {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>

//         <div className="bg-gray-50 p-3 rounded border border-dashed">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
//           <input type="file" multiple onChange={(e)=>setFiles(Array.from(e.target.files || []))} />
//         </div>

//         <button disabled={loading} className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-60">
//           {loading ? "Saving..." : editId ? "Save Changes" : "Create Product"}
//         </button>

//         {editId && (
//           <button type="button" className="w-full text-gray-500 underline" onClick={resetForm}>
//             Cancel Edit
//           </button>
//         )}
//       </form>

//       {/* Right Table */}
//       <div className="bg-white rounded-2xl shadow p-5">
//         <h2 className="text-xl font-bold mb-4">Products</h2>
//         <table className="w-full text-sm text-left">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               <th className="px-3 py-2">Product</th>
//               <th className="px-3 py-2">Price</th>
//               <th className="px-3 py-2">Stock</th>
//               <th className="px-3 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {products.map((p) => (
//               <tr key={p.id} className="hover:bg-gray-50">
//                 <td className="px-3 py-2 font-medium">{p.name}</td>
//                 <td className="px-3 py-2">₹ {p.price}</td>
//                 <td className="px-3 py-2">{p.quantityInStock}</td>
//                 <td className="px-3 py-2 space-x-3">
//                   <button className="text-blue-600" onClick={() => { setEditId(p.id); setForm({...p}); }}>
//                     Edit
//                   </button>
//                   <button className="text-red-600" onClick={async () => {
//                     if (confirm("Delete?")) { await deleteProductApi(p.id); load(); }
//                   }}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {!products.length && <tr><td colSpan="4" className="text-center p-6 text-gray-500">No products</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }