/* eslint-disable react-hooks/immutability */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useProductImages } from "../hooks/useProductImages";
import "./ImageGalleryModal.css";

export default function ImageGalleryModal({ productId, onClose }) {
  const {
    images,
    loading,
    updating,
    deleteImage,
    replaceImage,
    setPrimaryImage,
    uploadImages,
  } = useProductImages(productId);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleUpload = (e) => {
    uploadImages(Array.from(e.target.files || []));
    e.target.value = "";
  };

  return (
    <div className="gallery-backdrop" onClick={handleBackdropClick}>
      <div className="gallery-container">

        {/* Header */}
        <div className="gallery-header">
          <h2 className="gallery-title">Product Images</h2>
          <button className="gallery-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Upload */}
        <div className="gallery-upload-zone">
          <label className="gallery-upload-label">Upload New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={updating}
            onChange={handleUpload}
            className="gallery-upload-input"
          />
          <p className="gallery-upload-hint">JPG, PNG, WEBP • Max 5MB per image</p>
        </div>

        {/* States */}
        {loading && (
          <p className="gallery-state-msg">Loading images…</p>
        )}
        {!loading && images.length === 0 && (
          <p className="gallery-state-msg gallery-state-msg--empty">
            No images uploaded yet. Upload your first image above.
          </p>
        )}

        {/* Grid */}
        {!loading && images.length > 0 && (
          <div className="gallery-grid">
            {images.map((image) => (
              <div
                key={image.id}
                className={`gallery-card ${image.isPrimary ? "gallery-card--primary" : ""}`}
              >
                <img src={image.imageUrl} alt="Product" className="gallery-card-img" />

                {image.isPrimary && (
                  <span className="gallery-primary-badge">PRIMARY</span>
                )}

                <div className="gallery-overlay">
                  <label className="gallery-overlay-btn gallery-overlay-btn--replace">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        replaceImage(image.id, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {!image.isPrimary && (
                    <button
                      className="gallery-overlay-btn gallery-overlay-btn--primary"
                      onClick={() => setPrimaryImage(image.id)}
                      disabled={updating}
                    >
                      ⭐ Primary
                    </button>
                  )}

                  <button
                    className="gallery-overlay-btn gallery-overlay-btn--delete"
                    onClick={() => deleteImage(image.id)}
                    disabled={updating}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="gallery-footer">
          <button className="gallery-close-footer-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}