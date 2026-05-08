import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import NumberBox from "devextreme-react/number-box";
import FileUploader from "devextreme-react/file-uploader";
import { Validator, RequiredRule } from "devextreme-react/validator";

import { EMPTY_FORM } from "../../categories/constant";
import {
  getProductImagesApi,
  deleteProductImageApi,
  replaceProductImageApi,
} from "../../../../api/productApi";
import styles from "./ProductFormModal.module.css"; // Import the CSS module

export default function ProductFormModal({
  editData,
  categories,
  submitting,
  onSubmit,
  onClose,
}) {
  const isEdit = !!editData;
  const [form, setForm] = useState(
    isEdit ? { ...editData } : { ...EMPTY_FORM },
  );

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [selectedFileValue, setSelectedFileValue] = useState([]);
  const [fileError, setFileError] = useState("");

  const fileUploaderRef = useRef(null);
  const [existingImages, setExistingImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageUpdating, setImageUpdating] = useState(false);

  useEffect(() => {
    if (isEdit && editData?.id) {
      // eslint-disable-next-line react-hooks/immutability
      loadExistingImages(editData.id);
    }
  }, [isEdit, editData?.id]);

  const loadExistingImages = async (productId) => {
    setLoadingImages(true);
    try {
      const res = await getProductImagesApi(productId);
      setExistingImages(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load images:", err);
    } finally {
      setLoadingImages(false);
    }
  };
  const set = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));
  const setDx = (field) => (e) => {
    const isIntegerField =
      field === "quantityInStock" || field === "reorderLevel";
    let value = e.value;
    if (isIntegerField && value !== null) {
      value = Math.trunc(value);
    }
    setForm((s) => ({ ...s, [field]: value }));
  };
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    setImageUpdating(true);
    try {
      await deleteProductImageApi(editData.id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    } finally {
      setImageUpdating(false);
    }
  };
  const handleReplaceImage = async (imageId, file) => {
    if (!file) return;
    setImageUpdating(true);
    try {
      const res = await replaceProductImageApi(
        editData.id,
        imageId,
        file,
        false,
      );
      setExistingImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, imageUrl: res.data?.data?.imageUrl || img.imageUrl }
            : img,
        ),
      );
      toast.success("Image replaced");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to replace image");
    } finally {
      setImageUpdating(false);
    }
  };
  const handleSetPrimary = async (imageId) => {
    if (!editData?.id) return;
    setImageUpdating(true);
    try {
      const image = existingImages.find((img) => img.id === imageId);
      if (!image) return;
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `product-image-${imageId}`, {
        type: blob.type || "image/jpeg",
      });
      await replaceProductImageApi(editData.id, imageId, file, true);
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, isPrimary: img.id === imageId })),
      );
      toast.success("Image set as primary");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to set as primary");
    } finally {
      setImageUpdating(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileError) {
      toast.error("Please resolve the file upload error before submitting.");
      return;
    }
    if (form.categoryId) {
      const selectedCategory = categories.find((c) => c.id === form.categoryId);
      if (!selectedCategory) {
        toast.error("Invalid category selected.");
        return;
      }
      if (selectedCategory.isActive === false) {
        toast.error(
          `Cannot add products to inactive category '${selectedCategory.name}'. Contact admin to activate this category.`,
        );
        return;
      }
    }
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice:
        form.discountPrice === "" || form.discountPrice === null
          ? null
          : Number(form.discountPrice),
      quantityInStock: Number(form.quantityInStock),
      reorderLevel: Number(form.reorderLevel),
      categoryId: form.categoryId === "" ? null : form.categoryId,
    };
    if (isEdit) {
      delete payload.sku;
    }
    onSubmit(payload, filesToUpload);
  };
  const clearFiles = () => {
    setSelectedFileValue([]);
    setFilesToUpload([]);
    setFileError("");
  };
  const handleFilesChanged = (e) => {
    const allSelectedFiles = e.value || [];
    setSelectedFileValue(allSelectedFiles);
    const validImageFiles = allSelectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    setFilesToUpload(validImageFiles);
    if (validImageFiles.length < allSelectedFiles.length) {
      setFileError(
        "Only image files are allowed. Invalid files have been ignored.",
      );
    } else {
      setFileError("");
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? " Edit Product" : "➕ New Product"}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>Product Name *</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={set("name")}
                required
                placeholder="e.g. Wireless Headphones"
              />
            </div>

            <div>
              <label className={styles.label}>SKU *</label>
              <input
                className={`${styles.input} ${isEdit ? styles.inputDisabled : ""}`}
                value={form.sku}
                onChange={set("sku")}
                required
                disabled={isEdit}
                placeholder="e.g. SKU-001"
              />
              {isEdit && (
                <p className={styles.inputHelperText}>SKU cannot be changed</p>
              )}
            </div>

            <div>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={form.description}
                onChange={set("description")}
                placeholder="Product description…"
              />
            </div>

            <div className={styles.fieldGrid}>
              <div>
                <label className={styles.label}>Price (Rs.) *</label>
                <NumberBox
                  value={form.price}
                  onValueChanged={setDx("price")}
                  format="#,##0.##"
                  min={0}
                  showSpinButtons
                  placeholder="1,000.00"
                >
                  <Validator>
                    <RequiredRule message="Price is required" />
                  </Validator>
                </NumberBox>
              </div>
              <div>
                <label className={styles.label}>Discount Price (Rs.)</label>
                <NumberBox
                  value={form.discountPrice}
                  onValueChanged={setDx("discountPrice")}
                  format="#,##0.##"
                  min={0}
                  showSpinButtons
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div>
                <label className={styles.label}>Stock Qty</label>
                <NumberBox
                  value={form.quantityInStock}
                  onValueChanged={setDx("quantityInStock")}
                  format="#0"
                  min={0}
                  step={1}
                  showSpinButtons
                />
              </div>
              <div>
                <label className={styles.label}>Reorder Level</label>
                <NumberBox
                  value={form.reorderLevel}
                  onValueChanged={setDx("reorderLevel")}
                  format="#0"
                  min={0}
                  step={1}
                  showSpinButtons
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Category *</label>
              {(() => {
                const activeCategories = categories.filter(
                  (c) => c.isActive === true,
                );
                return (
                  <>
                    <select
                      className={styles.select}
                      value={form.categoryId}
                      onChange={set("categoryId")}
                      required
                      disabled={activeCategories.length === 0}
                    >
                      <option value="">
                        {activeCategories.length === 0
                          ? "— No Active Categories —"
                          : "— Select Category —"}
                      </option>
                      {activeCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {activeCategories.length === 0 && (
                      <p
                        className={styles.inputHelperText}
                        style={{ color: "#dc2626" }}
                      >
                        ⚠️ No active categories available. Contact admin.
                      </p>
                    )}
                  </>
                );
              })()}
            </div>

            {isEdit &&
              form.categoryId &&
              (() => {
                const selectedCategory = categories.find(
                  (c) => c.id === form.categoryId,
                );
                return selectedCategory &&
                  selectedCategory.isActive === false ? (
                  <div className={styles.warningBox}>
                    <div className={styles.warningIcon}>⚠️</div>
                    <div>
                      <p className={styles.warningTitle}>Inactive Category</p>
                      <p className={styles.warningText}>
                        This product is assigned to an inactive category:{" "}
                        <strong>{selectedCategory.name}</strong>.
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}

            <div>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={String(form.isActive)}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    isActive: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {isEdit && (
              <div className={styles.existingImagesSection}>
                <label className={styles.label}>Current Images</label>
                {loadingImages ? (
                  <p>Loading images...</p>
                ) : existingImages.length === 0 ? (
                  <p>No images uploaded yet</p>
                ) : (
                  <div className={styles.imageGrid}>
                    {existingImages.map((image) => (
                      <div
                        key={image.id}
                        className={`${styles.imageCard} ${image.isPrimary ? styles.imageCardPrimary : ""}`}
                      >
                        <img
                          src={image.imageUrl}
                          alt="Product"
                          className={styles.image}
                        />
                        {image.isPrimary && (
                          <div className={styles.primaryBadge}>PRIMARY</div>
                        )}
                        <div className={styles.imageOverlay}>
                          <label
                            className={`${styles.overlayButton} ${styles.replaceButton}`}
                          >
                            Replace{" "}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleReplaceImage(image.id, file);
                              }}
                              style={{ display: "none" }}
                              disabled={imageUpdating}
                            />
                          </label>
                          {!image.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(image.id)}
                              disabled={imageUpdating}
                              className={`${styles.overlayButton} ${styles.setPrimaryButton}`}
                            >
                              Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={imageUpdating}
                            className={`${styles.overlayButton} ${styles.deleteImageButton}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={styles.fileUploaderSection}>
              <div className={styles.fileUploaderHeader}>
                <label className={styles.label}>
                  {isEdit ? "Add More Images" : "Product Images"}
                </label>
                {selectedFileValue.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFiles}
                    className={styles.clearButton}
                  >
                    Clear
                  </button>
                )}
              </div>
              <FileUploader
                ref={fileUploaderRef}
                multiple={true}
                accept="image/*"
                uploadMode="useForm"
                value={selectedFileValue}
                onValueChanged={handleFilesChanged}
                labelText="Drop image files here or click to browse"
              />
              {fileError && <div className={styles.fileError}>{fileError}</div>}
            </div>

            <div className={styles.actionsContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting || imageUpdating || !!fileError}
              >
                {submitting
                  ? "Saving…"
                  : isEdit
                    ? "Update Product"
                    : "Create Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// import { useState, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import NumberBox from "devextreme-react/number-box";
// import FileUploader from "devextreme-react/file-uploader";
// import { Validator, RequiredRule } from "devextreme-react/validator";

// import { EMPTY_FORM } from "../../categories/constant";
// import {
//   getProductImagesApi,
//   deleteProductImageApi,
//   replaceProductImageApi,
// } from "../../../../api/productApi";

// const inputStyle = {
//   width: "100%",
//   border: "1.5px solid #e5e7eb",
//   borderRadius: 9,
//   padding: "9px 12px",
//   fontSize: 13,
//   outline: "none",
//   boxSizing: "border-box",
//   color: "#111",
//   background: "#fff",
// };

// const labelStyle = {
//   display: "block",
//   fontSize: 12,
//   fontWeight: 600,
//   color: "#374151",
//   marginBottom: 5,
// };

// export default function ProductFormModal({
//   editData,
//   categories,
//   submitting,
//   onSubmit,
//   onClose,
// }) {
//   const isEdit = !!editData;
//   const [form, setForm] = useState(isEdit ? { ...editData } : { ...EMPTY_FORM });

//   // State for files to be uploaded
//   const [filesToUpload, setFilesToUpload] = useState([]);
//   // State to control the FileUploader's value directly
//   const [selectedFileValue, setSelectedFileValue] = useState([]);
//   const [fileError, setFileError] = useState("");

//   const fileUploaderRef = useRef(null);
//   const [existingImages, setExistingImages] = useState([]);
//   const [loadingImages, setLoadingImages] = useState(false);
//   const [imageUpdating, setImageUpdating] = useState(false);

//   useEffect(() => {
//     if (isEdit && editData?.id) {
//       loadExistingImages(editData.id);
//     }
//   }, [isEdit, editData?.id]);

//   const loadExistingImages = async (productId) => {
//     setLoadingImages(true);
//     try {
//       const res = await getProductImagesApi(productId);
//       setExistingImages(res.data?.data || []);
//     } catch (err) {
//       console.error("Failed to load images:", err);
//     } finally {
//       setLoadingImages(false);
//     }
//   };

//   const set = (field) => (e) =>
//     setForm((s) => ({ ...s, [field]: e.target.value }));

//   const setDx = (field) => (e) => {
//     const isIntegerField =
//       field === "quantityInStock" || field === "reorderLevel";
//     let value = e.value;
//     if (isIntegerField && value !== null) {
//       value = Math.trunc(value);
//     }
//     setForm((s) => ({ ...s, [field]: value }));
//   };

//   const handleDeleteImage = async (imageId) => {
//     if (!window.confirm("Delete this image?")) return;
//     setImageUpdating(true);
//     try {
//       await deleteProductImageApi(editData.id, imageId);
//       setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
//       toast.success("Image deleted");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to delete image");
//     } finally {
//       setImageUpdating(false);
//     }
//   };

//   const handleReplaceImage = async (imageId, file) => {
//     if (!file) return;
//     setImageUpdating(true);
//     try {
//       const res = await replaceProductImageApi(editData.id, imageId, file, false);
//       setExistingImages((prev) =>
//         prev.map((img) =>
//           img.id === imageId
//             ? { ...img, imageUrl: res.data?.data?.imageUrl || img.imageUrl }
//             : img
//         )
//       );
//       toast.success("Image replaced");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to replace image");
//     } finally {
//       setImageUpdating(false);
//     }
//   };

//   const handleSetPrimary = async (imageId) => {
//     if (!editData?.id) return;
//     setImageUpdating(true);
//     try {
//       const image = existingImages.find((img) => img.id === imageId);
//       if (!image) return;
//       const response = await fetch(image.imageUrl);
//       const blob = await response.blob();
//       const file = new File([blob], `product-image-${imageId}`, { type: blob.type || "image/jpeg" });
//       await replaceProductImageApi(editData.id, imageId, file, true);
//       setExistingImages((prev) =>
//         prev.map((img) => ({ ...img, isPrimary: img.id === imageId }))
//       );
//       toast.success("Image set as primary");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to set as primary");
//     } finally {
//       setImageUpdating(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (fileError) {
//       toast.error("Please resolve the file upload error before submitting.");
//       return;
//     }
//     if (form.categoryId) {
//       const selectedCategory = categories.find((c) => c.id === form.categoryId);
//       if (!selectedCategory) {
//         toast.error("Invalid category selected.");
//         return;
//       }
//       if (selectedCategory.isActive === false) {
//         toast.error(`Cannot add products to inactive category '${selectedCategory.name}'. Contact admin to activate this category.`);
//         return;
//       }
//     }
//     const payload = {
//       ...form,
//       price: Number(form.price),
//       discountPrice: form.discountPrice === "" || form.discountPrice === null ? null : Number(form.discountPrice),
//       quantityInStock: Number(form.quantityInStock),
//       reorderLevel: Number(form.reorderLevel),
//       categoryId: form.categoryId === "" ? null : form.categoryId,
//     };
//     if (isEdit) {
//       delete payload.sku;
//     }
//     onSubmit(payload, filesToUpload);
//   };

//   // --- CORRECTED CLEAR FUNCTION ---
//   const clearFiles = () => {
//     setSelectedFileValue([]); // Clear the controlled value
//     setFilesToUpload([]);     // Clear the files intended for upload
//     setFileError("");         // Clear any error
//   };

//   // --- CORRECTED VALUE CHANGE HANDLER ---
//   const handleFilesChanged = (e) => {
//     const allSelectedFiles = e.value || [];
//     setSelectedFileValue(allSelectedFiles); // Keep UI in sync with selection

//     const validImageFiles = allSelectedFiles.filter((file) =>
//       file.type.startsWith("image/")
//     );

//     setFilesToUpload(validImageFiles); // State for valid files to be submitted

//     if (validImageFiles.length < allSelectedFiles.length) {
//       setFileError("Only image files are allowed. Invalid files have been ignored.");
//     } else {
//       setFileError("");
//     }
//   };

//   return (
//     <div
//       style={{
//         position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000,
//         display: "flex", alignItems: "center", justifyContent: "center",
//       }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div
//         style={{
//           background: "#fff", borderRadius: 18, padding: 28, width: "100%", maxWidth: 500,
//           maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
//         }}
//       >
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
//           <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
//             {isEdit ? " Edit Product" : "➕ New Product"}
//           </h2>
//           <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280" }}>
//             ✕
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//             {/* ... other form inputs ... */}
//              <div>
//               <label style={labelStyle}>Product Name *</label>
//               <input style={inputStyle} value={form.name} onChange={set("name")} required placeholder="e.g. Wireless Headphones" />
//             </div>
//             <div>
//               <label style={labelStyle}>SKU *</label>
//               <input style={{ ...inputStyle, background: isEdit ? "#f9fafb" : "#fff" }} value={form.sku} onChange={set("sku")} required disabled={isEdit} placeholder="e.g. SKU-001" />
//               <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 3, display: isEdit ? "block" : "none" }}>SKU cannot be changed</p>
//             </div>
//             <div>
//               <label style={labelStyle}>Description</label>
//               <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} value={form.description} onChange={set("description")} placeholder="Product description…" />
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               <div>
//                 <label style={labelStyle}>Price (Rs.) *</label>
//                 <NumberBox value={form.price} onValueChanged={setDx("price")} format="#,##0.##" min={0} showSpinButtons placeholder="1,000.00">
//                   <Validator><RequiredRule message="Price is required" /></Validator>
//                 </NumberBox>
//               </div>
//               <div>
//                 <label style={labelStyle}>Discount Price (Rs.)</label>
//                 <NumberBox value={form.discountPrice} onValueChanged={setDx("discountPrice")} format="#,##0.##" min={0} showSpinButtons placeholder="Optional" />
//               </div>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               <div>
//                 <label style={labelStyle}>Stock Qty</label>
//                 <NumberBox value={form.quantityInStock} onValueChanged={setDx("quantityInStock")} format="#0" min={0} step={1} showSpinButtons />
//               </div>
//               <div>
//                 <label style={labelStyle}>Reorder Level</label>
//                 <NumberBox value={form.reorderLevel} onValueChanged={setDx("reorderLevel")} format="#0" min={0} step={1} showSpinButtons />
//               </div>
//             </div>
//             <div>
//               <label style={labelStyle}>Category *</label>
//               {(() => {
//                 const activeCategories = categories.filter((c) => c.isActive === true);
//                 return (
//                   <>
//                     <select style={inputStyle} value={form.categoryId} onChange={set("categoryId")} required disabled={activeCategories.length === 0}>
//                       <option value="">{activeCategories.length === 0 ? "— No Active Categories —" : "— Select Category —"}</option>
//                       {activeCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
//                     </select>
//                     {activeCategories.length === 0 && (
//                       <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4, fontWeight: 500 }}>⚠️ No active categories available. Contact admin to activate a category.</p>
//                     )}
//                   </>
//                 );
//               })()}
//             </div>
//              {isEdit && form.categoryId && (() => {
//               const selectedCategory = categories.find((c) => c.id === form.categoryId);
//               return selectedCategory && selectedCategory.isActive === false ? (
//                 <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
//                   <div style={{ fontSize: 18, marginTop: 2 }}>⚠️</div>
//                   <div>
//                     <p style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", margin: "0 0 4px 0" }}>Inactive Category</p>
//                     <p style={{ fontSize: 11, color: "#b91c1c", margin: 0 }}>This product is assigned to an inactive category: <strong>{selectedCategory.name}</strong>. New products cannot be added to this category until it's reactivated.</p>
//                   </div>
//                 </div>
//               ) : null;
//             })()}
//             <div>
//               <label style={labelStyle}>Status</label>
//               <select style={inputStyle} value={String(form.isActive)} onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.value === "true" }))}>
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>

//             {/* Existing Images Section */}
//             {isEdit && (
//               <div style={{ border: "1.5px solid #d1d5db", borderRadius: 10, padding: "14px", background: "#fafafa" }}>
//                 <label style={labelStyle}>Current Images</label>
//                 {loadingImages ? <p style={{ fontSize: 12, color: "#6b7280" }}>Loading images...</p> : existingImages.length === 0 ? <p style={{ fontSize: 12, color: "#9ca3af" }}>No images uploaded yet</p> : (
//                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
//                     {existingImages.map((image) => (
//                       <div key={image.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: image.isPrimary ? "2px solid #111" : "1px solid #e5e7eb", backgroundColor: "#f3f4f6", aspectRatio: "1" }}>
//                         <img src={image.imageUrl} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
//                         {image.isPrimary && <div style={{ position: "absolute", top: 2, right: 2, background: "#111", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 4px", borderRadius: 3 }}>PRIMARY</div>}
//                         <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity .2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}>
//                           <label style={{ background: "#3b82f6", color: "#fff", padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: imageUpdating ? "not-allowed" : "pointer", border: "none", textAlign: "center", display: "block", opacity: imageUpdating ? 0.5 : 1 }}>
//                              Replace <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleReplaceImage(image.id, file); }} style={{ display: "none" }} disabled={imageUpdating} />
//                           </label>
//                           {!image.isPrimary && <button type="button" onClick={() => handleSetPrimary(image.id)} disabled={imageUpdating} style={{ background: "#16a34a", color: "#fff", padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: imageUpdating ? "not-allowed" : "pointer", border: "none", opacity: imageUpdating ? 0.5 : 1 }}>Primary</button>}
//                           <button type="button" onClick={() => handleDeleteImage(image.id)} disabled={imageUpdating} style={{ background: "#dc2626", color: "#fff", padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: imageUpdating ? "not-allowed" : "pointer", border: "none", opacity: imageUpdating ? 0.5 : 1 }}>Delete</button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* --- CORRECTED NEW IMAGES SECTION --- */}
//             <div style={{ border: "1.5px dashed #d1d5db", borderRadius: 10, padding: "12px 14px", background: "#f9fafb" }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
//                 <label style={labelStyle}>{isEdit ? "Add More Images" : "Product Images"}</label>
//                 {/* Show button if ANY file is selected (valid or not) */}
//                 {selectedFileValue.length > 0 && (
//                   <button type="button" onClick={clearFiles} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 5, fontSize: 11, fontWeight: 600, padding: "3px 8px", cursor: "pointer" }}>
//                     Clear
//                   </button>
//                 )}
//               </div>
//               <FileUploader
//                 ref={fileUploaderRef}
//                 multiple={true}
//                 accept="image/*"
//                 uploadMode="useForm"
//                 value={selectedFileValue} // Controlled component
//                 onValueChanged={handleFilesChanged} // Use new handler
//                 labelText="Drop image files here or click to browse"
//               />
//               {fileError && <div style={{ color: "red", fontSize: 12, marginTop: 8 }}>{fileError}</div>}
//             </div>

//             {/* Actions */}
//             <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
//               <button type="submit" disabled={submitting || imageUpdating || !!fileError} style={{ flex: 1, padding: "10px 18px", borderRadius: 9, border: "none", cursor: submitting || imageUpdating || !!fileError ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, background: "#111", color: "#fff", opacity: submitting || imageUpdating || !!fileError ? 0.65 : 1, transition: "opacity .15s" }}>
//                 {submitting ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
//               </button>
//               <button type="button" onClick={onClose} style={{ padding: "10px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: "#f3f4f6", color: "#374151" }}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
