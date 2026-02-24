import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyProfile.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ROUTES } from "@/constants";
import type { UserResponse } from "@/types";
import { getDisplayName, getInitial } from "@/utils/profile";
import Lightbox from "@/components/ui/Lightbox";
import ProfileHeroCard from "./components/ProfileHeroCard";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileAbout from "./components/ProfileAbout";
import PhotoGallery from "./components/PhotoGallery";
import AvailabilitySection from "./components/AvailabilitySection";

const MyProfile = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileData(JSON.parse(localStorage.getItem("profile")!));
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const photos = profileData?.photos ?? [];
  const sortedPhotos = [...photos].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const primaryPhoto = sortedPhotos[0];
  const initial = getInitial(profile, profileData?.email);
  const displayName = getDisplayName(profile);

  /* ─── Empty profile ─── */
  if (!profile) {
    return (
      <>
        <Header />
        <div className={styles.pageWrapper}>
          <div className={styles.profileLayout}>
            <div className={styles.emptyCard}>
              <h2>Welcome to Clique!</h2>
              <p>You haven't created your profile yet. Let's get started!</p>
              <button
                className={styles.createBtn}
                onClick={() => navigate(ROUTES.PROFILE_CREATE)}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <div className={styles.profileLayout}>
          {error && <div className={styles.error}>{error}</div>}

          <ProfileHeroCard
            displayName={displayName}
            birthday={profile.birthday}
            occupation={profile.occupation}
            city={profile.city}
            country={profile.country}
            primaryPhoto={primaryPhoto}
            initial={initial}
            styles={styles}
          />

          <ProfileSidebar
            profile={profile}
            profileData={profileData!}
            onEditClick={() => navigate(ROUTES.PROFILE_EDIT)}
            styles={styles}
          />

          <ProfileAbout profile={profile} styles={styles} />

          <PhotoGallery
            photos={photos}
            onPhotoClick={(idx) => setLightboxIdx(idx)}
            styles={styles}
          />

          <AvailabilitySection styles={styles} />

          {/* Actions */}
          <div className={`${styles.actionsRow} ${styles.fullWidth}`}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(ROUTES.PROFILE_EDIT)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Lightbox */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <Lightbox
          photos={photos}
          activeIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNavigate={(idx) => setLightboxIdx(idx)}
          styles={styles}
        />
      )}
    </>
  );
};

export default MyProfile;
