import type { UserPhoto } from "@/types";
import { getImageUrl } from "@/utils/profile";

interface LightboxProps {
  photos: UserPhoto[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  styles: Record<string, string>;
}

const Lightbox = ({
  photos,
  activeIndex,
  onClose,
  onNavigate,
  styles,
}: LightboxProps) => {
  if (!photos[activeIndex]) return null;

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <button className={styles.lightboxClose} onClick={onClose}>
        ✕
      </button>
      {photos.length > 1 && (
        <>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex - 1 + photos.length) % photos.length);
            }}
          >
            ‹
          </button>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex + 1) % photos.length);
            }}
          >
            ›
          </button>
        </>
      )}
      <img
        src={getImageUrl(photos[activeIndex].photoUrl)}
        alt={`Photo ${activeIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;
