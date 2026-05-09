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
// import styles from "./ProductFormModal.module.css"; // Import the CSS module

// export default function ProductFormModal({
//   editData,
//   categories,
//   submitting,
//   onSubmit,
//   onClose,
// }) {
//   const isEdit = !!editData;
//   const [form, setForm] = useState(
//     isEdit ? { ...editData } : { ...EMPTY_FORM },
//   );

//   const [filesToUpload, setFilesToUpload] = useState([]);
//   const [selectedFileValue, setSelectedFileValue] = useState([]);
//   const [fileError, setFileError] = useState("");

//   const fileUploaderRef = useRef(null);
//   const [existingImages, setExistingImages] = useState([]);
//   const [loadingImages, setLoadingImages] = useState(false);
//   const [imageUpdating, setImageUpdating] = useState(false);

//   useEffect(() => {
//     if (isEdit && editData?.id) {
//       // eslint-disable-next-line react-hooks/immutability
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
//       const res = await replaceProductImageApi(
//         editData.id,
//         imageId,
//         file,
//         false,
//       );
//       setExistingImages((prev) =>
//         prev.map((img) =>
//           img.id === imageId
//             ? { ...img, imageUrl: res.data?.data?.imageUrl || img.imageUrl }
//             : img,
//         ),
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
//       const file = new File([blob], `product-image-${imageId}`, {
//         type: blob.type || "image/jpeg",
//       });
//       await replaceProductImageApi(editData.id, imageId, file, true);
//       setExistingImages((prev) =>
//         prev.map((img) => ({ ...img, isPrimary: img.id === imageId })),
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
//         toast.error(
//           `Cannot add products to inactive category '${selectedCategory.name}'. Contact admin to activate this category.`,
//         );
//         return;
//       }
//     }
//     const payload = {
//       ...form,
//       price: Number(form.price),
//       discountPrice:
//         form.discountPrice === "" || form.discountPrice === null
//           ? null
//           : Number(form.discountPrice),
//       quantityInStock: Number(form.quantityInStock),
//       reorderLevel: Number(form.reorderLevel),
//       categoryId: form.categoryId === "" ? null : form.categoryId,
//     };
//     if (isEdit) {
//       delete payload.sku;
//     }
//     onSubmit(payload, filesToUpload);
//   };
//   const clearFiles = () => {
//     setSelectedFileValue([]);
//     setFilesToUpload([]);
//     setFileError("");
//   };
//   const handleFilesChanged = (e) => {
//     const allSelectedFiles = e.value || [];
//     setSelectedFileValue(allSelectedFiles);
//     const validImageFiles = allSelectedFiles.filter((file) =>
//       file.type.startsWith("image/"),
//     );
//     setFilesToUpload(validImageFiles);
//     if (validImageFiles.length < allSelectedFiles.length) {
//       setFileError(
//         "Only image files are allowed. Invalid files have been ignored.",
//       );
//     } else {
//       setFileError("");
//     }
//   };

//   return (
//     <div
//       className={styles.modalBackdrop}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className={styles.modalContainer}>
//         <div className={styles.modalHeader}>
//           <h2 className={styles.modalTitle}>
//             {isEdit ? " Edit Product" : "➕ New Product"}
//           </h2>
//           <button onClick={onClose} className={styles.closeButton}>
//             ✕
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className={styles.formGrid}>
//             <div>
//               <label className={styles.label}>Product Name *</label>
//               <input
//                 className={styles.input}
//                 value={form.name}
//                 onChange={set("name")}
//                 required
//                 placeholder="e.g. Wireless Headphones"
//               />
//             </div>

//             <div>
//               <label className={styles.label}>SKU *</label>
//               <input
//                 className={`${styles.input} ${isEdit ? styles.inputDisabled : ""}`}
//                 value={form.sku}
//                 onChange={set("sku")}
//                 required
//                 disabled={isEdit}
//                 placeholder="e.g. SKU-001"
//               />
//               {isEdit && (
//                 <p className={styles.inputHelperText}>SKU cannot be changed</p>
//               )}
//             </div>

//             <div>
//               <label className={styles.label}>Description</label>
//               <textarea
//                 className={styles.textarea}
//                 value={form.description}
//                 onChange={set("description")}
//                 placeholder="Product description…"
//               />
//             </div>

//             <div className={styles.fieldGrid}>
//               <div>
//                 <label className={styles.label}>Price (Rs.) *</label>
//                 <NumberBox
//                   value={form.price}
//                   onValueChanged={setDx("price")}
//                   format="#,##0.##"
//                   min={0}
//                   showSpinButtons
//                   placeholder="1,000.00"
//                 >
//                   <Validator>
//                     <RequiredRule message="Price is required" />
//                   </Validator>
//                 </NumberBox>
//               </div>
//               <div>
//                 <label className={styles.label}>Discount Price (Rs.)</label>
//                 <NumberBox
//                   value={form.discountPrice}
//                   onValueChanged={setDx("discountPrice")}
//                   format="#,##0.##"
//                   min={0}
//                   showSpinButtons
//                   placeholder="Optional"
//                 />
//               </div>
//             </div>

//             <div className={styles.fieldGrid}>
//               <div>
//                 <label className={styles.label}>Stock Qty</label>
//                 <NumberBox
//                   value={form.quantityInStock}
//                   onValueChanged={setDx("quantityInStock")}
//                   format="#0"
//                   min={0}
//                   step={1}
//                   showSpinButtons
//                 />
//               </div>
//               <div>
//                 <label className={styles.label}>Reorder Level</label>
//                 <NumberBox
//                   value={form.reorderLevel}
//                   onValueChanged={setDx("reorderLevel")}
//                   format="#0"
//                   min={0}
//                   step={1}
//                   showSpinButtons
//                 />
//               </div>
//             </div>

//             <div>
//               <label className={styles.label}>Category *</label>
//               {(() => {
//                 const activeCategories = categories.filter(
//                   (c) => c.isActive === true,
//                 );
//                 return (
//                   <>
//                     <select
//                       className={styles.select}
//                       value={form.categoryId}
//                       onChange={set("categoryId")}
//                       required
//                       disabled={activeCategories.length === 0}
//                     >
//                       <option value="">
//                         {activeCategories.length === 0
//                           ? "— No Active Categories —"
//                           : "— Select Category —"}
//                       </option>
//                       {activeCategories.map((c) => (
//                         <option key={c.id} value={c.id}>
//                           {c.name}
//                         </option>
//                       ))}
//                     </select>
//                     {activeCategories.length === 0 && (
//                       <p
//                         className={styles.inputHelperText}
//                         style={{ color: "#dc2626" }}
//                       >
//                         ⚠️ No active categories available. Contact admin.
//                       </p>
//                     )}
//                   </>
//                 );
//               })()}
//             </div>

//             {isEdit &&
//               form.categoryId &&
//               (() => {
//                 const selectedCategory = categories.find(
//                   (c) => c.id === form.categoryId,
//                 );
//                 return selectedCategory &&
//                   selectedCategory.isActive === false ? (
//                   <div className={styles.warningBox}>
//                     <div className={styles.warningIcon}>⚠️</div>
//                     <div>
//                       <p className={styles.warningTitle}>Inactive Category</p>
//                       <p className={styles.warningText}>
//                         This product is assigned to an inactive category:{" "}
//                         <strong>{selectedCategory.name}</strong>.
//                       </p>
//                     </div>
//                   </div>
//                 ) : null;
//               })()}

//             <div>
//               <label className={styles.label}>Status</label>
//               <select
//                 className={styles.select}
//                 value={String(form.isActive)}
//                 onChange={(e) =>
//                   setForm((s) => ({
//                     ...s,
//                     isActive: e.target.value === "true",
//                   }))
//                 }
//               >
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>

//             {isEdit && (
//               <div className={styles.existingImagesSection}>
//                 <label className={styles.label}>Current Images</label>
//                 {loadingImages ? (
//                   <p>Loading images...</p>
//                 ) : existingImages.length === 0 ? (
//                   <p>No images uploaded yet</p>
//                 ) : (
//                   <div className={styles.imageGrid}>
//                     {existingImages.map((image) => (
//                       <div
//                         key={image.id}
//                         className={`${styles.imageCard} ${image.isPrimary ? styles.imageCardPrimary : ""}`}
//                       >
//                         <img
//                           src={image.imageUrl}
//                           alt="Product"
//                           className={styles.image}
//                         />
//                         {image.isPrimary && (
//                           <div className={styles.primaryBadge}>PRIMARY</div>
//                         )}
//                         <div className={styles.imageOverlay}>
//                           <label
//                             className={`${styles.overlayButton} ${styles.replaceButton}`}
//                           >
//                             Replace{" "}
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) handleReplaceImage(image.id, file);
//                               }}
//                               style={{ display: "none" }}
//                               disabled={imageUpdating}
//                             />
//                           </label>
//                           {!image.isPrimary && (
//                             <button
//                               type="button"
//                               onClick={() => handleSetPrimary(image.id)}
//                               disabled={imageUpdating}
//                               className={`${styles.overlayButton} ${styles.setPrimaryButton}`}
//                             >
//                               Primary
//                             </button>
//                           )}
//                           <button
//                             type="button"
//                             onClick={() => handleDeleteImage(image.id)}
//                             disabled={imageUpdating}
//                             className={`${styles.overlayButton} ${styles.deleteImageButton}`}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className={styles.fileUploaderSection}>
//               <div className={styles.fileUploaderHeader}>
//                 <label className={styles.label}>
//                   {isEdit ? "Add More Images" : "Product Images"}
//                 </label>
//                 {selectedFileValue.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={clearFiles}
//                     className={styles.clearButton}
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//               <FileUploader
//                 ref={fileUploaderRef}
//                 multiple={true}
//                 accept="image/*"
//                 uploadMode="useForm"
//                 value={selectedFileValue}
//                 onValueChanged={handleFilesChanged}
//                 labelText="Drop image files here or click to browse"
//               />
//               {fileError && <div className={styles.fileError}>{fileError}</div>}
//             </div>

//             <div className={styles.actionsContainer}>
//               <button
//                 type="submit"
//                 className={styles.submitButton}
//                 disabled={submitting || imageUpdating || !!fileError}
//               >
//                 {submitting
//                   ? "Saving…"
//                   : isEdit
//                     ? "Update Product"
//                     : "Create Product"}
//               </button>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import { useState, useRef } from "react";
import toast from "react-hot-toast";
import NumberBox from "devextreme-react/number-box";
import FileUploader from "devextreme-react/file-uploader";
import { Validator, RequiredRule } from "devextreme-react/validator";

import { EMPTY_FORM } from "../../categories/constant";
import { useProductImages } from "../hooks/useProductImages";
import "./ProductFormModal.css";

// ── Sub-component: active category select ─────────────────────────
function ActiveCategorySelect({ categories, value, onChange }) {
  const active = categories.filter((c) => c.isActive === true);
  const noActive = active.length === 0;

  return (
    <>
      <select
        className="pf-select"
        value={value}
        onChange={onChange}
        required
        disabled={noActive}
      >
        <option value="">
          {noActive ? "— No Active Categories —" : "— Select Category —"}
        </option>
        {active.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {noActive && (
        <p className="pf-helper-text pf-helper-text--error">
           No active categories available. Contact admin.
        </p>
      )}
    </>
  );
}

// ── Sub-component: inactive category warning ───────────────────────
function InactiveCategoryWarning({ categories, categoryId }) {
  const selected = categories.find((c) => c.id === categoryId);
  if (!selected || selected.isActive !== false) return null;

  return (
    <div className="pf-warning-box">
      <span className="pf-warning-icon">⚠️</span>
      <div>
        <p className="pf-warning-title">Inactive Category</p>
        <p className="pf-warning-text">
          This product is assigned to an inactive category:{" "}
          <strong>{selected.name}</strong>.
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function ProductFormModal({
  editData,
  categories,
  submitting,
  onSubmit,
  onClose,
}) {
  const isEdit = !!editData;

  const [form, setForm] = useState(
    isEdit ? { ...editData } : { ...EMPTY_FORM }
  );
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [selectedFileValue, setSelectedFileValue] = useState([]);
  const [fileError, setFileError] = useState("");

  const fileUploaderRef = useRef(null);

  // Shared image hook — only active in edit mode
  const {
    images: existingImages,
    loading: loadingImages,
    updating: imageUpdating,
    deleteImage,
    replaceImage,
    setPrimaryImage,
  } = useProductImages(isEdit ? editData?.id : null);

  // ── Field helpers ──────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((s) => ({ ...s, [field]: e.target.value }));

  const setDx = (field) => (e) => {
    const isInteger = field === "quantityInStock" || field === "reorderLevel";
    const value = isInteger && e.value !== null ? Math.trunc(e.value) : e.value;
    setForm((s) => ({ ...s, [field]: value }));
  };

  // ── File handling ──────────────────────────────────────────────
  const handleFilesChanged = (e) => {
    const all = e.value || [];
    setSelectedFileValue(all);
    const valid = all.filter((f) => f.type.startsWith("image/"));
    setFilesToUpload(valid);
    setFileError(
      valid.length < all.length
        ? "Only image files are allowed. Invalid files have been ignored."
        : ""
    );
  };

  const clearFiles = () => {
    setSelectedFileValue([]);
    setFilesToUpload([]);
    setFileError("");
  };

  // ── Submit ─────────────────────────────────────────────────────
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
          `Cannot add products to inactive category '${selectedCategory.name}'. Contact admin.`
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

    if (isEdit) delete payload.sku;

    onSubmit(payload, filesToUpload);
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      className="pf-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pf-container">
        {/* Header */}
        <div className="pf-header">
          <h2 className="pf-title">
            {isEdit ? " Edit Product" : "➕ New Product"}
          </h2>
          <button className="pf-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pf-form-grid">

            {/* Product Name */}
            <div>
              <label className="pf-label">Product Name *</label>
              <input
                className="pf-input"
                value={form.name}
                onChange={set("name")}
                required
                placeholder="e.g. Wireless Headphones"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="pf-label">SKU *</label>
              <input
                className={`pf-input ${isEdit ? "pf-input--disabled" : ""}`}
                value={form.sku}
                onChange={set("sku")}
                required
                disabled={isEdit}
                placeholder="e.g. SKU-001"
              />
              {isEdit && (
                <p className="pf-helper-text">SKU cannot be changed</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="pf-label">Description</label>
              <textarea
                className="pf-textarea"
                value={form.description}
                onChange={set("description")}
                placeholder="Product description…"
              />
            </div>

            {/* Price + Discount */}
            <div className="pf-field-row">
              <div>
                <label className="pf-label">Price (Rs.) *</label>
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
                <label className="pf-label">Discount Price (Rs.)</label>
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

            {/* Stock + Reorder */}
            <div className="pf-field-row">
              <div>
                <label className="pf-label">Stock Qty</label>
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
                <label className="pf-label">Reorder Level</label>
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

            {/* Category */}
            <div>
              <label className="pf-label">Category *</label>
              <ActiveCategorySelect
                categories={categories}
                value={form.categoryId}
                onChange={set("categoryId")}
              />
            </div>

            {/* Inactive category warning (edit mode) */}
            {isEdit && (
              <InactiveCategoryWarning
                categories={categories}
                categoryId={form.categoryId}
              />
            )}

            {/* Existing Images (edit mode) */}
            {isEdit && (
              <div className="pf-existing-images">
                <label className="pf-label">Current Images</label>

                {loadingImages ? (
                  <p className="pf-state-text">Loading images…</p>
                ) : existingImages.length === 0 ? (
                  <p className="pf-state-text">No images uploaded yet</p>
                ) : (
                  <div className="pf-image-grid">
                    {existingImages.map((image) => (
                      <div
                        key={image.id}
                        className={`pf-image-card ${image.isPrimary ? "pf-image-card--primary" : ""}`}
                      >
                        <img
                          src={image.imageUrl}
                          alt="Product"
                          className="pf-image"
                        />
                        {image.isPrimary && (
                          <span className="pf-primary-badge">PRIMARY</span>
                        )}
                        <div className="pf-image-overlay">
                          <label className="pf-overlay-btn pf-overlay-btn--replace">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              disabled={imageUpdating}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) replaceImage(image.id, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                          {!image.isPrimary && (
                            <button
                              type="button"
                              className="pf-overlay-btn pf-overlay-btn--primary"
                              onClick={() => setPrimaryImage(image.id)}
                              disabled={imageUpdating}
                            >
                               Primary
                            </button>
                          )}
                          <button
                            type="button"
                            className="pf-overlay-btn pf-overlay-btn--delete"
                            onClick={() => deleteImage(image.id)}
                            disabled={imageUpdating}
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

            {/* File Uploader */}
            <div className="pf-file-section">
              <div className="pf-file-header">
                <label className="pf-label">
                  {isEdit ? "Add More Images" : "Product Images"}
                </label>
                {selectedFileValue.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="pf-clear-btn"
                  >
                    Clear
                  </button>
                )}
              </div>
              <FileUploader
                ref={fileUploaderRef}
                multiple
                accept="image/*"
                uploadMode="useForm"
                value={selectedFileValue}
                onValueChanged={handleFilesChanged}
                labelText="Drop image files here or click to browse"
              />
              {fileError && (
                <p className="pf-file-error">{fileError}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pf-actions">
              <button
                type="submit"
                className="pf-btn pf-btn--submit"
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
                className="pf-btn pf-btn--cancel"
                onClick={onClose}
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