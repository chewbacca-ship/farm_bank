import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Fingerprint,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react";


const avatarFallback =
  "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=256&q=80";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
  } = useProfile();
  const userProfile = profileData?.user || {};
  const [editedProfile, setEditedProfile] = useState(userProfile);

  useEffect(() => {
    setEditedProfile(userProfile);
  }, [userProfile]);

  const kycDocuments = useMemo(
    () =>
      [
        { name: "Government ID", status: "verified", uploadDate: "2024-01-16" },
        { name: "Proof of Address", status: "verified", uploadDate: "2024-01-16" },
        { name: "Bank Statement", status: "verified", uploadDate: "2024-01-17" },
      ],
    [],
  );

  const getKycStatusMeta = (status) => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="h-4 w-4" />, // Verified icon
          badge: "bg-emerald-100 text-emerald-700",
          label: "Verified",
        };
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />, // Pending icon
          badge: "bg-amber-100 text-amber-700",
          label: "Pending",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-4 w-4" />, // Rejected icon
          badge: "bg-rose-100 text-rose-700",
          label: "Rejected",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />, // Default icon
          badge: "bg-slate-100 text-slate-600",
          label: status || "In review",
        };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/startpage");
  };

  const handleSaveProfile = () => {

    setIsEditingProfile(false);
  };

  const joinDateLabel = userProfile?.created_at
    // TODO: Wire up mutation endpoint once available
    ? new Date(userProfile.created_at).toLocaleDateString()
    : "Not specified";

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (profileIsLoading && !profileData) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </section>
    );
  }

  if (profileError && !profileData) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-rose-500">Unable to load profile. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-10 px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-6 rounded-3xl bg-white/70 px-8 py-6 shadow-lg ring-1 ring-slate-100 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-emerald-100">
              <img
                src={userProfile?.avatar || avatarFallback}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                {`${userProfile?.first_name || ""} ${userProfile?.last_name || ""}`.trim() || "Investor"}
              </h1>
              <p className="text-sm text-slate-500">Manage your personal information, KYC status, and account preferences.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>KYC Verified</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="space-y-6 rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Personal information</h2>
                <p className="text-sm text-slate-500">Keep your contact information up to date.</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit profile
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">First name</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>{userProfile?.first_name || "Not provided"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Last name</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>{userProfile?.last_name || "Not provided"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{userProfile?.email || "Not provided"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Phone</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{userProfile?.phone_number || "Not provided"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Address</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{userProfile?.address || "Not provided"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Joined</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{joinDateLabel}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form className="grid gap-5 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  First name
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={editedProfile?.first_name || ""}
                    onChange={handleFieldChange("first_name")}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Last name
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={editedProfile?.last_name || ""}
                    onChange={handleFieldChange("last_name")}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Email address
                  <input
                    type="email"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={editedProfile?.email || ""}
                    onChange={handleFieldChange("email")}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Phone number
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={editedProfile?.phone_number || ""}
                    onChange={handleFieldChange("phone_number")}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                  Address
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={editedProfile?.address || ""}
                    onChange={handleFieldChange("address")}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 md:col-span-2">
                  Date of birth
                  <input
                    type="date"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={editedProfile?.dateOfBirth || ""}
                    onChange={handleFieldChange("dateOfBirth")}
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditedProfile(profile || {});
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-900">Security & preferences</h3>
              <p className="text-sm text-slate-500">Stay protected and tailor your notifications.</p>

              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                  <span className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-slate-400" />
                    Two-factor authentication
                  </span>
                  <span className="text-xs font-medium text-emerald-500">Enabled</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-400" />
                    Notifications and alerts
                  </span>
                  <span className="text-xs font-medium text-slate-400">Custom</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    Linked payment methods
                  </span>
                  <span className="text-xs font-medium text-slate-400">3 cards</span>
                </li>
              </ul>
            </section>

            <section className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-900">KYC documents</h3>
              <p className="text-sm text-slate-500">All documents must be approved before withdrawals.</p>

              <ul className="mt-4 space-y-3">
                {kycDocuments.map((doc) => {
                  const meta = getKycStatusMeta(doc.status);
                  return (
                    <li
                      key={`${doc.name}-${doc.uploadDate}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.badge}`}>
                          {meta.icon}
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">{doc.name}</p>
                          <p className="text-xs text-slate-400">Uploaded {doc.uploadDate}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Profile;
