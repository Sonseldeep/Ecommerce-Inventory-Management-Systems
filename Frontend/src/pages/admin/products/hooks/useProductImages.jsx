/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getProductImagesApi,
  deleteProductImageApi,
  replaceProductImageApi,
  uploadProductImagesApi,
} from "../../../../api/productApi";

/**
 * Shared hook for product image management.
 * Used by both ImageGalleryModal and ProductFormModal.
 */
export function useProductImages(productId) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // ── Load ──────────────────────────────────────────────────────
  const loadImages = useCallback(async () => {
    if (!productId) return;
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
  }, [productId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // ── Delete ────────────────────────────────────────────────────
  const deleteImage = useCallback(
    async (imageId) => {
      if (!window.confirm("Delete this image?")) return;
      setUpdating(true);
      try {
        await deleteProductImageApi(productId, imageId);
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to delete image");
        console.error(err);
      } finally {
        setUpdating(false);
      }
    },
    [productId]
  );

  // ── Replace ───────────────────────────────────────────────────
  const replaceImage = useCallback(
    async (imageId, file) => {
      if (!file) return;
      setUpdating(true);
      try {
        const res = await replaceProductImageApi(productId, imageId, file, false);
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, imageUrl: res.data?.data?.imageUrl || img.imageUrl }
              : img
          )
        );
        toast.success("Image replaced");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to replace image");
        console.error(err);
      } finally {
        setUpdating(false);
      }
    },
    [productId]
  );

  // ── Set Primary ───────────────────────────────────────────────
  const setPrimaryImage = useCallback(
    async (imageId) => {
      setUpdating(true);
      try {
        const image = images.find((img) => img.id === imageId);
        if (!image) return;

        const response = await fetch(image.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `product-image-${imageId}`, {
          type: blob.type || "image/jpeg",
        });

        await replaceProductImageApi(productId, imageId, file, true);

        setImages((prev) =>
          prev.map((img) => ({ ...img, isPrimary: img.id === imageId }))
        );
        toast.success("Image set as primary");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to set as primary");
        console.error(err);
      } finally {
        setUpdating(false);
      }
    },
    [productId, images]
  );

  // ── Upload New ────────────────────────────────────────────────
  const uploadImages = useCallback(
    async (files) => {
      if (!files.length) return;
      setUpdating(true);
      try {
        const results = await uploadProductImagesApi(productId, files);
        const newImages = results.map((res) => res.data?.data || res.data);
        setImages((prev) => [...prev, ...newImages]);
        toast.success("Images uploaded successfully");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to upload images");
        console.error(err);
      } finally {
        setUpdating(false);
      }
    },
    [productId]
  );

  return {
    images,
    loading,
    updating,
    deleteImage,
    replaceImage,
    setPrimaryImage,
    uploadImages,
  };
}