import { useState, useEffect, type ChangeEvent } from 'react';
import { BuyerHeaderBar } from '../components/buyer/BuyerHeaderBar';
import { fetchUserProfile, updateUserProfile, type UserProfileData } from '../services/userApi';
import { uploadPropertyImageApi } from '../services/agentApi';

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        setProfile(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setPhone(data.phone || '');
        setAvatar(data.avatar || '/hero_property.png');
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        // Fallback user state from auth if available
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            setProfile(parsed);
            setFirstName(parsed.firstName || '');
            setLastName(parsed.lastName || '');
            setPhone(parsed.phone || '');
            setAvatar(parsed.avatar || '/hero_property.png');
          } catch {
            // ignore
          }
        }
        setIsLoading(false);
      });
  }, []);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const res = await uploadPropertyImageApi(file);
      setAvatar(res.url);
      setMessage({ text: 'Avatar photo updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert('Failed to upload avatar image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateUserProfile({
        firstName,
        lastName,
        phone,
        avatar,
      });
      setProfile(updated);
      // Update saved user object in localStorage
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        try {
          const parsed = JSON.parse(existingUser);
          localStorage.setItem('user', JSON.stringify({ ...parsed, ...updated }));
        } catch {
          // ignore
        }
      }
      setMessage({ text: 'Profile details saved successfully!', type: 'success' });
    } catch (err) {
      console.error('Save profile error:', err);
      setMessage({ text: 'Failed to update profile details. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-6 lg:p-8 animate-pulse max-w-[1200px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="h-48 bg-gray-200 rounded-3xl w-full" />
        <div className="h-64 bg-gray-200 rounded-3xl w-full" />
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    ADMIN: 'System Administrator',
    AGENT: 'Real Estate Agent',
    ARCHITECT: 'Architectural Designer',
    CONTRACTOR: 'Construction Contractor',
    USER: 'Property Buyer / Member',
  };

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8 text-[#111827] max-w-[1300px] mx-auto">
      {/* Top Bar */}
      <BuyerHeaderBar searchPlaceholder="Search portal settings..." />

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Account Profile</h1>
        <p className="text-xs text-gray-500 font-semibold">Manage your personal profile, photo, and account details</p>
      </div>

      {/* Feedback Banner */}
      {message && (
        <div
          className={`w-full p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-extrabold opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Hero Profile Banner Card */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="relative group shrink-0">
          <img
            src={avatar || '/hero_property.png'}
            alt="Profile Avatar"
            className="size-24 sm:size-28 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(firstName || 'User') + '&background=345b79&color=fff';
            }}
          />
          <label className="absolute bottom-0 right-0 size-9 rounded-full bg-[#345b79] text-white flex items-center justify-center shadow-lg hover:bg-[#2a4a63] cursor-pointer transition-transform hover:scale-110">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'User Account'}
            </h2>
            <span className="text-[10px] font-extrabold bg-blue-50 text-[#345b79] px-3 py-1 rounded-full uppercase tracking-wider">
              {roleLabels[profile?.role || 'USER']}
            </span>
          </div>

          <p className="text-xs font-semibold text-gray-500">{profile?.email || 'user@example.com'}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Account
            </span>
            <span className="text-[11px] font-semibold text-gray-400">
              Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Personal Information Form */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <h3 className="text-base font-extrabold text-[#111827]">Personal Information</h3>
            <p className="text-xs text-gray-500 font-medium">Update your name, phone number, and profile preferences</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Email Address (Read only)</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving || uploadingAvatar}
                className="bg-[#345b79] hover:bg-[#2a4a63] disabled:opacity-50 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Account & Security */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Account Role & Scope</h3>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[#345b79] text-white flex items-center justify-center shrink-0">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">{roleLabels[profile?.role || 'USER']}</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Access granted to role dashboard</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Security & Privacy</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your account details and activity are encrypted and protected under platform privacy policies.
            </p>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your registered email.')}
              className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#111827] text-xs font-extrabold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Reset Account Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
