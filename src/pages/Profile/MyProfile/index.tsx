import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Profile.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { ROUTES } from "@/constants";
import type { UserResponse } from "@/types";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const res = await userService.getProfile(user.id);
        setProfileData(res.data.data);
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const initial =
    profile?.firstName?.charAt(0)?.toUpperCase() ||
    profileData?.email?.charAt(0)?.toUpperCase() ||
    "?";

  // No profile yet → prompt to create
  if (!profile) {
    return (
      <>
        <Header />
        <div className={styles.profilePageWrapper}>
          <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
              <div className={styles.emptyProfile}>
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
        </div>
        <Footer />
      </>
    );
  }

  const formatLabel = (val?: string) =>
    val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : "—";

  return (
    <>
      <Header />
      <div className={styles.profilePageWrapper}>
        <div className={styles.profileContainer}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.profileCard}>
            {/* Header */}
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>{initial}</div>
              <div className={styles.profileHeaderInfo}>
                <h2>
                  {profile.displayName ||
                    `${profile.firstName} ${profile.lastName || ""}`.trim()}
                </h2>
                <p>{profileData.email}</p>
              </div>
            </div>

            {/* Info grid */}
            <h3 className={styles.sectionTitle}>Basic Info</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>First Name</span>
                <span className={styles.infoValue}>{profile.firstName}</span>
              </div>
              {profile.lastName && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Name</span>
                  <span className={styles.infoValue}>{profile.lastName}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Birthday</span>
                <span className={styles.infoValue}>{profile.birthday}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Gender</span>
                <span className={styles.infoValue}>
                  {formatLabel(profile.gender)}
                </span>
              </div>
              {profile.phoneNumber && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>
                    {profile.phoneNumber}
                  </span>
                </div>
              )}
              {profile.heightCm && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Height</span>
                  <span className={styles.infoValue}>
                    {profile.heightCm} cm
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className={styles.bioSection}>
                <h3 className={styles.sectionTitle}>Bio</h3>
                <p className={styles.bioText}>"{profile.bio}"</p>
              </div>
            )}

            {/* Location & Work */}
            {(profile.city ||
              profile.country ||
              profile.occupation ||
              profile.company ||
              profile.school) && (
              <div className={styles.sectionSpacer}>
                <h3 className={styles.sectionTitle}>Location & Work</h3>
                <div className={styles.infoGrid}>
                  {profile.city && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>City</span>
                      <span className={styles.infoValue}>{profile.city}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Country</span>
                      <span className={styles.infoValue}>
                        {profile.country}
                      </span>
                    </div>
                  )}
                  {profile.occupation && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Occupation</span>
                      <span className={styles.infoValue}>
                        {profile.occupation}
                      </span>
                    </div>
                  )}
                  {profile.company && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Company</span>
                      <span className={styles.infoValue}>
                        {profile.company}
                      </span>
                    </div>
                  )}
                  {profile.school && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>School</span>
                      <span className={styles.infoValue}>{profile.school}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {(profile.drinkingHabit ||
              profile.smokingHabit ||
              profile.zodiacSign) && (
              <div className={styles.sectionSpacer}>
                <h3 className={styles.sectionTitle}>Lifestyle</h3>
                <div className={styles.infoGrid}>
                  {profile.zodiacSign && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Zodiac</span>
                      <span className={styles.infoValue}>
                        {formatLabel(profile.zodiacSign)}
                      </span>
                    </div>
                  )}
                  {profile.drinkingHabit && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Drinking</span>
                      <span className={styles.infoValue}>
                        {formatLabel(profile.drinkingHabit)}
                      </span>
                    </div>
                  )}
                  {profile.smokingHabit && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Smoking</span>
                      <span className={styles.infoValue}>
                        {formatLabel(profile.smokingHabit)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preferences */}
            {(profile.interestedIn ||
              profile.minAgePreference ||
              profile.maxAgePreference) && (
              <div className={styles.sectionSpacer}>
                <h3 className={styles.sectionTitle}>Preferences</h3>
                <div className={styles.infoGrid}>
                  {profile.interestedIn && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Interested In</span>
                      <span className={styles.infoValue}>
                        {formatLabel(profile.interestedIn)}
                      </span>
                    </div>
                  )}
                  {(profile.minAgePreference || profile.maxAgePreference) && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Age Range</span>
                      <span className={styles.infoValue}>
                        {profile.minAgePreference ?? "—"} –{" "}
                        {profile.maxAgePreference ?? "—"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account info */}
            <div className={styles.sectionSpacer}>
              <h3 className={styles.sectionTitle}>Account</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Role</span>
                  <span className={styles.infoValue}>{profileData.role}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Auth Provider</span>
                  <span className={styles.infoValue}>
                    {profileData.authProvider}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since</span>
                  <span className={styles.infoValue}>
                    {new Date(profileData.createdAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                </div>
                {profileData.lastLogin && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Last Login</span>
                    <span className={styles.infoValue}>
                      {new Date(profileData.lastLogin).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionRow}>
              <button
                className={styles.editBtn}
                onClick={() => navigate(ROUTES.PROFILE_EDIT)}
              >
                Edit Profile
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyProfile;
