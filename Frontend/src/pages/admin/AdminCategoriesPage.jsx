

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
} from "../../api/categoryApi";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  // pagination + search
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const load = async () => {
    const res = await getCategoriesApi({
      search,
      sortBy,
      sortOrder,
      pageNumber,
      pageSize,
    });

    const payload = res.data?.data;
    setItems(payload?.items || []);
    setTotalPages(payload?.totalPages || 1);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [search, sortBy, sortOrder, pageNumber, pageSize]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategoryApi(editId, form);
        toast.success("Category updated");
      } else {
        await createCategoryApi(form);
        toast.success("Category created");
      }
      setForm({ name: "", description: "" });
      setEditId(null);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  const onEdit = (c) => {
    setEditId(c.id);
    setForm({ name: c.name || "", description: c.description || "" });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      await deleteCategoryApi(id);
      toast.success("Category deleted");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin - Categories</h1>

      {/* Search + Sort */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          className="border rounded p-2 w-full md:max-w-sm"
          placeholder="Search category name"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPageNumber(1); }}
        />
        <div className="flex gap-2">
          <select
            className="border rounded p-2"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPageNumber(1); }}
          >
            <option value="name">Name</option>
          </select>
          <select
            className="border rounded p-2"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setPageNumber(1); }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white p-4 rounded-xl shadow grid gap-3 max-w-xl">
        <input
          className="border p-2 rounded"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          required
        />
        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
        />
        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded">
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button
              type="button"
              className="border px-4 py-2 rounded"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th>Description</th>
              <th className="w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">{c.name}</td>
                <td>{c.description || "-"}</td>
                <td className="space-x-2">
                  <button className="text-blue-600" onClick={() => onEdit(c)}>Edit</button>
                  <button className="text-red-600" onClick={() => onDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!items.length && (
          <div className="text-center text-gray-400 py-6">No categories</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPageNumber(p)}
            className={`px-3 py-1 border rounded ${p === pageNumber ? "bg-black text-white" : ""}`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}