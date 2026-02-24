import type { UserPhoto } from "@/types";
import { getImageUrl } from "@/utils/profile";

interface PhotoGalleryProps {
  photos: UserPhoto[];
  onPhotoClick: (idx: number) => void;
  styles: Record<string, string>;
}

const PhotoGallery = ({ photos, onPhotoClick, styles }: PhotoGalleryProps) => {
  return (
    <div className={`${styles.galleryCard} ${styles.fullWidth}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Photos</h3>
        <span className={styles.infoLabel}>
          {photos.length} photo{photos.length !== 1 && "s"}
        </span>
      </div>

      <div className={styles.galleryGrid}>
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className={styles.galleryItem}
            onClick={() => onPhotoClick(idx)}
          >
            <img
              src={getImageUrl(photo.photoUrl)}
              alt={`Photo ${idx + 1}`}
              className={styles.galleryImg}
            />
            {photo.displayOrder === 0 && (
              <div className={styles.galleryPrimary} />
            )}
          </div>
        ))}

        {photos.length === 0 && (
          <>
            <div className={styles.galleryEmpty}>No photos</div>
            <div className={styles.galleryEmpty}>+</div>
            <div className={styles.galleryEmpty}>+</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;
