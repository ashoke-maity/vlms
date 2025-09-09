import { useState } from "react";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Lock,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Settings() {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleDeleteAccount = async () => {
    if (!user?.id) {
      alert("User not found.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_USER_URL}/delete-profile/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.session?.access_token || ""}`,
          },
        }
      );
      if (res.data.ok) {
        alert("Account deleted successfully.");
        logout();
        navigate("/login");
      } else {
        alert(res.data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account.");
    } finally {
      setIsLoading(false);
    }
  };
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      recommendations: true,
      newReleases: true,
      weeklyDigest: false
    },
    privacy: {
      profileVisibility: "public",
      showWatchHistory: true,
      showFavorites: true,
      allowRecommendations: true
    },
    appearance: {
      theme: "dark",
      autoPlay: true,
      subtitles: false,
      quality: "auto"
    },
    account: {
      dateFormat: "MM/DD/YYYY"
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "logout", label: "Logout", icon: LogOut }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (!user?.id) {
      alert("User not found.");
      return;
    }
    setIsLoading(true);
    try {
      // Check for Supabase auth session before password change
      let session;
      if (supabase.auth.getSession) {
        const { data } = await supabase.auth.getSession();
        session = data?.session;
      } else {
        session = supabase.auth.session;
      }
      console.log('Supabase session:', session);
      if (!session) {
        alert("You must be logged in to change your password.");
        setIsLoading(false);
        return;
      }
      // Supabase self-service password change
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (!error) {
        alert("Password updated successfully.");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        alert(error.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="font-medium text-red-400 mb-2">Delete Account</h4>
            <p className="text-sm text-neutral-400 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              <Trash2 size={16} />
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogoutTab = () => (
    <div className="space-y-6">
      <div className="p-6 bg-neutral-800 rounded-lg border border-neutral-700">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><LogOut size={18} /> Logout</h3>
        <p className="text-sm text-neutral-400 mb-6">Are you sure you want to sign out?</p>
        <div className="flex gap-3">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut size={16} />
            Confirm Logout
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={async () => {
              await handlePasswordUpdate();
              // Stay on settings after password change
              setActiveTab('account');
            }}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountTab();
      case "password":
        return renderPasswordTab();
      case "logout":
        return renderLogoutTab();
      default:
        return renderAccountTab();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="bg-neutral-900/50 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
