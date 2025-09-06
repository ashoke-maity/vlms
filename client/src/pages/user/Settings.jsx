import { useState } from "react";
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
  const navigate = useNavigate();
  const { logout } = useAuth();
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
      language: "en",
      timezone: "UTC",
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
    
    setIsLoading(true);
    try {
      // TODO: Implement actual password update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Password updated");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed: Notifications, Privacy & Security, and Appearance tabs

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-neutral-800 rounded-lg">
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={settings.account.language}
              onChange={(e) => handleSettingChange("account", "language", e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="p-4 bg-neutral-800 rounded-lg">
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={settings.account.timezone}
              onChange={(e) => handleSettingChange("account", "timezone", e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="font-medium text-red-400 mb-2">Delete Account</h4>
            <p className="text-sm text-neutral-400 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Trash2 size={16} />
              Delete Account
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
            onClick={handlePasswordUpdate}
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
