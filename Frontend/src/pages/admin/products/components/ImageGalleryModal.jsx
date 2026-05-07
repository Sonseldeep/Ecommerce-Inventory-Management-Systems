/* eslint-disable react-hooks/immutability */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getProductImagesApi,
  deleteProductImageApi,
  replaceProductImageApi,
  uploadProductImagesApi,
} from "../../../../api/productApi";

const modalBackdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContainerStyle = {
  background: "#fff",
  borderRadius: 18,
  padding: 28,
  width: "100%",
  maxWidth: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,.2)",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 5,
};

export default function ImageGalleryModal({ productId, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ── Load images on mount ──────────────────────────────────────────
  useEffect(() => {
    loadImages();
  }, [productId]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const res = await getProductImagesApi(productId);
      setImages(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── DELETE image ──────────────────────────────────────────────────
  const handleDelete = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteProductImageApi(productId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete image");
      console.error(err);
    }
  };

  // ── SET as primary ────────────────────────────────────────────────
  const handleSetPrimary = async (imageId) => {
    try {
      const image = images.find((img) => img.id === imageId);
      if (!image) return;

      // Fetch the current image and re-upload it with isPrimary=true
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      
      // Determine file type from blob or image URL
      const fileType = blob.type || "image/jpeg";
      const fileName = `product-image-${imageId}`;

      const file = new File([blob], fileName, { type: fileType });

      await replaceProductImageApi(productId, imageId, file, true);

      // Update local state
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
      toast.success("Image set as primary");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to set as primary");
      console.error(err);
    }
  };

  // ── REPLACE image ─────────────────────────────────────────────────
  const handleReplaceImage = async (imageId, fileInput) => {
    const file = fileInput.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await replaceProductImageApi(productId, imageId, file, false);

      // Update the image in the list with new URL
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                imageUrl: res.data?.data?.imageUrl || img.imageUrl,
              }
            : img
        )
      );
      toast.success("Image replaced successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to replace image");
      console.error(err);
    } finally {
      setUploading(false);
      // Reset file input
      fileInput.value = "";
    }
  };

  // ── UPLOAD new images ─────────────────────────────────────────────
  const handleUploadNew = async (files) => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newImages = await uploadProductImagesApi(productId, files);
      // Extract image data from response
      const imageDtos = newImages.map((res) => res.data?.data || res.data);
      setImages((prev) => [...prev, ...imageDtos]);
      toast.success("Images uploaded successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload images");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={modalBackdropStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={modalContainerStyle}>
        {/* ── Header ───────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
             Product Images
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Upload New Images ────────────────────────────────────── */}
        <div
          style={{
            border: "1.5px dashed #d1d5db",
            borderRadius: 10,
            padding: "16px 14px",
            marginBottom: 24,
            background: "#f9fafb",
          }}
        >
          <label style={labelStyle}>Upload New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={(e) =>
              handleUploadNew(Array.from(e.target.files || []))
            }
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 13,
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.6 : 1,
            }}
          />
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
            JPG, PNG, WEBP • Max 5MB per image
          </p>
        </div>

        {/* ── Loading State ────────────────────────────────────────── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280" }}>
            Loading images...
          </div>
        )}

        {/* ── Empty State ──────────────────────────────────────────── */}
        {!loading && images.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
            No images uploaded yet. Upload your first image above.
          </div>
        )}

        {/* ── Images Gallery ───────────────────────────────────────── */}
        {!loading && images.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {images.map((image) => (
              <div
                key={image.id}
                style={{
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: image.isPrimary ? "3px solid #111" : "1px solid #e5e7eb",
                  backgroundColor: "#f3f4f6",
                  aspectRatio: "1",
                }}
              >
                {/* ── Image ────────────────────────────────────────── */}
                <img
                  src={image.imageUrl}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* ── Primary Badge ────────────────────────────────── */}
                {image.isPrimary && (
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "#111",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 7px",
                      borderRadius: 4,
                    }}
                  >
                    PRIMARY
                  </div>
                )}

                {/* ── Hover Actions Overlay ────────────────────────── */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,.7)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity .2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  {/* ── Replace Button ──────────────────────────────── */}
                  <label
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                     Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplaceImage(image.id, e.target)}
                      style={{ display: "none" }}
                    />
                  </label>

                  {/* ── Set Primary Button ──────────────────────────── */}
                  {!image.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(image.id)}
                      disabled={uploading}
                      style={{
                        background: "#16a34a",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: uploading ? "not-allowed" : "pointer",
                        border: "none",
                        width: "fit-content",
                      }}
                    >
                      ⭐ Primary
                    </button>
                  )}

                  {/* ── Delete Button ───────────────────────────────── */}
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={uploading}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: uploading ? "not-allowed" : "pointer",
                      border: "none",
                      width: "fit-content",
                    }}
                  >
                     Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Close Button ─────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            paddingTop: 6,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 18px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: "#f3f4f6",
              color: "#374151",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}