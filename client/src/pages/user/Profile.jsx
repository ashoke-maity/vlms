import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Eye, 
  Heart, 
  Settings,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { VideoCard } from "../../components/layouts/user/VideoCard";
import { fetchTMDBVideos } from "../../libs/tmdb";


export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    joinDate: new Date().toISOString(),
    avatar: "",
    bio: "",
  });
  const [editData, setEditData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchTMDBVideos({}).then((res) => {
      if (isMounted) setVideos(res || []);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const normalized = {
        firstName: user.FirstName || user.firstName || "",
        lastName: user.LastName || user.lastName || "",
        email: user.Email || user.email || "",
        joinDate: user.created_at || user.joinDate || new Date().toISOString(),
        avatar: user.avatar || "",
        bio: user.bio || "",
      };
      setUserData(normalized);
      setEditData(normalized);
    }
  }, [isAuthenticated, user]);

  const initials = useMemo(() => {
    const f = (userData.firstName || "").toString().trim().charAt(0).toUpperCase();
    const l = (userData.lastName || "").toString().trim().charAt(0).toUpperCase();
    const combined = `${f}${l}`.trim();
    if (combined) return combined;
    const emailInitial = (userData.email || "").toString().trim().charAt(0).toUpperCase();
    return emailInitial || "U";
  }, [userData.firstName, userData.lastName, userData.email]);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
        <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800 text-center max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">You're not signed in</h2>
          <p className="text-neutral-400 mb-6">Please log in to view your profile.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">Go Home</Link>
            <button onClick={() => navigate("/login")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="bg-neutral-900/50 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors">
                      <Camera size={16} />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    userData.firstName || ""
                  )}{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    userData.lastName || ""
                  )}
                </h2>
                <p className="text-neutral-400 text-sm">
                  Member since {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : ""}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-neutral-500" />
                  <span className="text-sm text-neutral-300">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      userData.email || ""
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-neutral-500" />
                  <span className="text-sm text-neutral-300">
                    Joined {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-300 mb-2">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <p className="text-sm text-neutral-400">{userData.bio || ""}</p>
                )}
              </div>



              {/* Action Buttons */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
                <Link
                  to="/settings"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  <Settings size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content: Watchlist */}
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Watchlist</h3>
                <Link to="/watchlist" className="text-sm text-blue-400 hover:text-blue-300">View all</Link>
              </div>
              {videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.slice(0, 6).map((video, index) => (
                    <div key={video.id || index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <VideoCard
                        video={video}
                        isFavorite={false}
                        isRecentlyWatched={false}
                        onSelect={() => {}}
                        onToggleFavorite={() => {}}
                        animationDelay={index * 0.1}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400">Your watchlist is empty.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
