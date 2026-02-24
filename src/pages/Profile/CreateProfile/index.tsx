import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Profile.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import { ROUTES } from "@/constants";
import type { CreateProfileRequest } from "@/types";
import ProfileFormFields from "../components/ProfileFormFields";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";

const CreateProfile = () => {
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
        "Failed to create profile. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.profilePageWrapper}>
        <form className={styles.profileContainer} onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <h1 className={styles.pageTitle}>Create Your Profile</h1>
            <p className={styles.pageSubtitle}>
              Tell us about yourself so we can find your perfect match.
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <ProfileFormFields
            form={form}
            handleChange={handleChange}
            styles={styles}
            showPlaceholders
          />

          <ProfilePhotoUpload styles={styles} showPlaceholders />

          {/* Actions */}
          <div className={styles.actionsCard}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProfile;
