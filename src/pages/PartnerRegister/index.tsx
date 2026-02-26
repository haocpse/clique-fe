import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./PartnerRegister.module.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuth } from "@/hooks/useAuth";
import { partnerService } from "@/services/partner.service";
import { ROUTES } from "@/constants";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerPartner } = useAuth();

  const [step, setStep] = useState(location.state?.startStep || 1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Account Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Partner Details
  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerPartner({ email, password, confirmPassword });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLoading(true);
    try {
      const res = await partnerService.uploadImage(file);
      setImages((prev) => [
        ...prev,
        { id: res.data.data.id, url: res.data.data.imageUrl },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!organizationName.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in the required fields (Name, Phone, Address).");
      return;
    }

    setLoading(true);
    try {
      await partnerService.createPartner({
        organizationName,
        description,
        phone,
        website,
        address,
        imageIds: images.map((img) => img.id),
      });
      navigate(ROUTES.HOME);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create partner profile.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <>
      <Header />
      <div className={styles.registerWrapper}>
        <div className={styles.registerCard}>
          <h1 className={styles.title}>Partner Registration</h1>
          <div className={styles.stepIndicator}>Step {step} of 2</div>
          <p className={styles.subtitle}>
            {step === 1 ? "Create your partner account." : "Tell us about your organization."}
          </p>

          {error && <div className={styles.error}>{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleAccountSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.registerBtn} disabled={loading}>
                {loading ? "Creating Account..." : "Next Step"}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePartnerSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Organization Name *"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  className={styles.textarea}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Address *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className={styles.imageUploadGroup}>
                <label className={styles.uploadLabel}>
                  <span>Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                </label>
                <div className={styles.imagePreviewContainer}>
                  {images.map((img, idx) => (
                    <div key={img.id} className={styles.imagePreviewWrapper}>
                      <img src={img.url} alt="preview" className={styles.imagePreview} />
                      <button type="button" className={styles.removeImageBtn} onClick={() => removeImage(idx)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.registerBtn} disabled={loading}>
                {loading ? "Submitting..." : "Complete Registration"}
              </button>
            </form>
          )}

          <div className={styles.footer}>
            Already a member? <Link to={ROUTES.LOGIN}>Sign In</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PartnerRegister;
