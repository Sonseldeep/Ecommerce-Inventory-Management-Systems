import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyProfileApi } from "../../api/userApi";
import { changePasswordApi } from "../../api/authApi";

import TextBox from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import { Eye, EyeOff } from "lucide-react";

import "./UserProfilePage.css";



export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfileApi();
        setProfile(res.data?.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();

   
    if (!formData.currentPassword.trim()) {
      return toast.error("Current password is required");
    }

    if (!formData.newPassword.trim()) {
      return toast.error("New password is required");
    }

    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (!formData.confirmPassword.trim()) {
      return toast.error("Confirm password is required");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setSubmitting(true);

    try {
      await changePasswordApi({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Password changed successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Change password failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">

      <h1 className="profile-title">My Profile</h1>

      
      <div className="profile-card">

        
        <div className="profile-info">
          <div className="profile-info-item">
            <p className="profile-info-label">Full Name</p>
            <p className="profile-info-value">{profile?.fullName}</p>
          </div>

          <div className="profile-info-item">
            <p className="profile-info-label">Email</p>
            <p className="profile-info-value">{profile?.email}</p>
          </div>

          <div className="profile-info-item">
            <p className="profile-info-label">Role</p>
            <p className="profile-info-value">{profile?.role}</p>
          </div>
        </div>

        
        <div className="profile-status-card">
          <p className="profile-status-label">Email Status</p>
          <p className={`profile-status-value ${profile?.isEmailVerified ? "verified" : "not-verified"}`}>
            {profile?.isEmailVerified ? " Verified" : " Not Verified"}
          </p>
        </div>
      </div>


      <div className="password-form-container">
        <h2 className="password-form-title">Change Password</h2>

        <form onSubmit={changePassword}>
      
          <div className="password-field">
            <label className="password-field-label">
              Current Password *
            </label>
            <div className="password-field-wrapper">
              <TextBox
                value={formData.currentPassword}
                onValueChanged={(e) => setFormData({ ...formData, currentPassword: e.value })}
                mode={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                stylingMode="outlined"
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="password-field">
            <label className="password-field-label">
              New Password *
            </label>
            <div className="password-field-wrapper">
              <TextBox
                value={formData.newPassword}
                onValueChanged={(e) => setFormData({ ...formData, newPassword: e.value })}
                mode={showNew ? "text" : "password"}
                placeholder="Enter new password (min 6 characters)"
                stylingMode="outlined"
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

    
          <div className="password-field">
            <label className="password-field-label">
              Confirm Password *
            </label>
            <div className="password-field-wrapper">
              <TextBox
                value={formData.confirmPassword}
                onValueChanged={(e) => setFormData({ ...formData, confirmPassword: e.value })}
                mode={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                stylingMode="outlined"
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

        
          <Button
            className="password-form-submit"
            text={submitting ? "Updating..." : "Update Password"}
            type="default"
            stylingMode="contained"
            useSubmitBehavior={true}
            disabled={submitting}
          />
        </form>
      </div>
    </div>
  );
}






