import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Profile.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { ROUTES } from "@/constants";
import type { CreateProfileRequest } from "@/types";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState<CreateProfileRequest>({
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    birthday: "",
    gender: "MALE",
    bio: "",
    city: "",
    country: "",
    occupation: "",
    company: "",
    school: "",
    heightCm: undefined,
    drinkingHabit: undefined,
    smokingHabit: undefined,
    zodiacSign: undefined,
    interestedIn: undefined,
    minAgePreference: 18,
    maxAgePreference: 30,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const res = await userService.getProfile(user.id);
        const profile = res.data.data.profile;
        if (profile) {
          setForm({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            displayName: profile.displayName || "",
            phoneNumber: profile.phoneNumber || "",
            birthday: profile.birthday || "",
            gender: profile.gender || "MALE",
            bio: profile.bio || "",
            city: profile.city || "",
            country: profile.country || "",
            occupation: profile.occupation || "",
            company: profile.company || "",
            school: profile.school || "",
            heightCm: profile.heightCm,
            drinkingHabit: profile.drinkingHabit,
            smokingHabit: profile.smokingHabit,
            zodiacSign: profile.zodiacSign,
            interestedIn: profile.interestedIn,
            minAgePreference: profile.minAgePreference ?? 18,
            maxAgePreference: profile.maxAgePreference ?? 30,
          });
        }
      } catch {
        setError("Failed to load profile.");
      } finally {
        setPageLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "heightCm" ||
        name === "minAgePreference" ||
        name === "maxAgePreference"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const validate = (): string | null => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.birthday) return "Birthday is required.";
    if (new Date(form.birthday) >= new Date())
      return "Birthday must be a past date.";
    if (
      form.heightCm !== undefined &&
      (form.heightCm < 50 || form.heightCm > 300)
    )
      return "Height must be between 50 and 300 cm.";
    if (
      form.minAgePreference !== undefined &&
      (form.minAgePreference < 18 || form.minAgePreference > 50)
    )
      return "Min age preference must be between 18 and 50.";
    if (
      form.maxAgePreference !== undefined &&
      (form.maxAgePreference < 18 || form.maxAgePreference > 50)
    )
      return "Max age preference must be between 18 and 50.";
    if (
      form.minAgePreference !== undefined &&
      form.maxAgePreference !== undefined &&
      form.minAgePreference > form.maxAgePreference
    )
      return "Min age cannot be greater than max age.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError("User not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      await userService.createProfile(user.id, form);
      await refreshUser();
      navigate(ROUTES.PROFILE_ME);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to update profile. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingText}>Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.profilePageWrapper}>
        <div className={styles.profileContainer}>
          <h1 className={styles.pageTitle}>Edit Profile</h1>
          <p className={styles.pageSubtitle}>Update your information.</p>

          <div className={styles.formCard}>
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <h3 className={styles.sectionTitle}>Basic Info</h3>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className={styles.input}
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className={styles.input}
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    className={styles.input}
                    value={form.displayName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className={styles.input}
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Birthday *</label>
                  <input
                    type="date"
                    name="birthday"
                    className={styles.input}
                    value={form.birthday}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Gender *</label>
                  <select
                    name="gender"
                    className={styles.select}
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldRowSingle}>
                <label className={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  className={styles.textarea}
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              {/* Location & Work */}
              <div className={styles.sectionSpacer}>
                <h3 className={styles.sectionTitle}>Location & Work</h3>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    className={styles.input}
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Country</label>
                  <input
                    type="text"
                    name="country"
                    className={styles.input}
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    className={styles.input}
                    value={form.occupation}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Company</label>
                  <input
                    type="text"
                    name="company"
                    className={styles.input}
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.fieldRowSingle}>
                <label className={styles.label}>School</label>
                <input
                  type="text"
                  name="school"
                  className={styles.input}
                  value={form.school}
                  onChange={handleChange}
                />
              </div>

              {/* Lifestyle */}
              <div className={styles.sectionSpacer}>
                <h3 className={styles.sectionTitle}>Lifestyle</h3>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Height (cm)</label>
                  <input
                    type="number"
                    name="heightCm"
                    className={styles.input}
                    min={50}
                    max={300}
                    value={form.heightCm ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Zodiac Sign</label>
                  <select
                    name="zodiacSign"
                    className={styles.select}
                    value={form.zodiacSign ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    {[
                      "ARIES",
                      "TAURUS",
                      "GEMINI",
                      "CANCER",
                      "LEO",
                      "VIRGO",
                      "LIBRA",
                      "SCORPIO",
                      "SAGITTARIUS",
                      "CAPRICORN",
                      "AQUARIUS",
                      "PISCES",
                    ].map((z) => (
                      <option key={z} value={z}>
                        {z.charAt(0) + z.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Drinking</label>
                  <select
                    name="drinkingHabit"
                    className={styles.select}
                    value={form.drinkingHabit ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="NO">No</option>
                    <option value="SOCIAL">Social</option>
                    <option value="REGULAR">Regular</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Smoking</label>
                  <select
                    name="smokingHabit"
                    className={styles.select}
                    value={form.smokingHabit ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="NO">No</option>
                    <option value="SOCIAL">Social</option>
                    <option value="REGULAR">Regular</option>
                  </select>
                </div>
              </div>

              {/* Preferences */}
              <div className={styles.sectionSpacer}>
                <h3 className={styles.sectionTitle}>Preferences</h3>
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Interested In</label>
                  <select
                    name="interestedIn"
                    className={styles.select}
                    value={form.interestedIn ?? ""}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
                <div />
              </div>

              <div className={styles.fieldRow}>
                <div>
                  <label className={styles.label}>Min Age</label>
                  <input
                    type="number"
                    name="minAgePreference"
                    className={styles.input}
                    min={18}
                    max={50}
                    value={form.minAgePreference ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Max Age</label>
                  <input
                    type="number"
                    name="maxAgePreference"
                    className={styles.input}
                    min={18}
                    max={50}
                    value={form.maxAgePreference ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
