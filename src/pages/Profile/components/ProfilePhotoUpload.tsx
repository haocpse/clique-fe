import { useState, useRef } from "react";
import { userService } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/utils/profile";
import type { UserPhoto } from "@/types";

interface ProfilePhotoUploadProps {
  initialPhotos?: UserPhoto[];
  styles: Record<string, string>;
  showPlaceholders?: boolean;
}

const ProfilePhotoUpload = ({
  initialPhotos = [],
  styles,
  showPlaceholders = false,
}: ProfilePhotoUploadProps) => {
  const [photos, setPhotos] = useState<UserPhoto[]>(initialPhotos);
  const [loading, setLoading] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refreshUser } = useAuth();

  const syncProfileToStorage = async () => {
    try {
      await refreshUser();
      const res = await userService.getMyProfile();
      localStorage.setItem("profile", JSON.stringify(res.data.data));
    } catch (err) {
      console.error("Failed to sync profile to storage", err);
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingPhotoId(id);
  };

  const handleDelete = async () => {
    if (!deletingPhotoId) return;
    setLoading(true);
    try {
      await userService.deleteUserPhoto(deletingPhotoId);
      setPhotos((prev) => prev.filter((p) => p.id !== deletingPhotoId));
      await syncProfileToStorage();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete photo.");
    } finally {
      setLoading(false);
      setDeletingPhotoId(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await userService.modifyUserPhoto(formData);
      if (res.data?.data) {
        setPhotos((prev) => [...prev, res.data.data]);
        await syncProfileToStorage();
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload photo.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Generate an array of at least 3 slots, filling up to 6 if there are photos

  return (
    <div className={styles.formSectionCard}>
      <h3 className={styles.sectionTitle}>Photos</h3>
      <p
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)",
          margin: "0 0 0.75rem",
        }}
      >
        {showPlaceholders
          ? "You can add photos after creating your profile."
          : "Manage your photos from the profile page."}
      </p>

      <div className={styles.photoGrid}>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={styles.photoSlot}
            style={{ padding: 0, overflow: "hidden", position: "relative" }}
          >
            <img
              src={getImageUrl(photo.photoUrl)}
              alt="User photo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {!showPlaceholders && (
              <button
                type="button"
                onClick={() => confirmDelete(photo.id)}
                disabled={loading}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "rgba(255, 0, 0, 0.7)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
                title="Delete photo"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {!showPlaceholders && photos.length < 6 && (
          <div
            className={styles.photoSlot}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
            onClick={() => {
              if (!loading && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            {loading ? "..." : "+"}
          </div>
        )}

        {/* Empty placeholder slots to maintain the grid look if we have fewer photos */}
        {Array.from({
          length: Math.max(
            0,
            3 - (photos.length + (!showPlaceholders ? 1 : 0)),
          ),
        }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.photoSlot}>
            +
          </div>
        ))}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {deletingPhotoId !== null && (
        <div
          className={styles.popupOverlay}
          onClick={() => setDeletingPhotoId(null)}
        >
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.popupTitle}>Delete Photo?</h3>
            <p className={styles.popupText}>
              Are you sure you want to delete this photo? This cannot be undone.
            </p>
            <div className={styles.popupActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeletingPhotoId(null)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.popupDeleteBtn}
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
