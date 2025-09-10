import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Settings,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { VideoCard } from "../../components/layouts/user/VideoCard";
import favoritesService from "../../services/favorites.js";


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
  });
  const [editData, setEditData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      setIsLoading(true);
      favoritesService.getFavorites(user.id)
        .then((res) => {
          if (isMounted && res.ok) setFavorites(res.data || []);
        })
        .catch((err) => console.error("Error fetching favorites:", err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const normalized = {
        firstName: user.FirstName || user.firstName || "",
        lastName: user.LastName || user.lastName || "",
        email: user.Email || user.email || "",
        joinDate: user.created_at || user.joinDate || new Date().toISOString(),
        avatar: user.avatar || ""
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
                  {/* Avatar upload/edit disabled */}
                </div>
                <h2 className="text-xl font-semibold">
                  {userData.firstName || ""} {userData.lastName || ""}
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
                    {userData.email || ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-neutral-500" />
                  <span className="text-sm text-neutral-300">
                    Joined {userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content: Favorites */}
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Favorites</h3>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.slice(0, 6).map((favorite, index) => (
                    <div key={favorite.id || index} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <VideoCard
                        video={favorite}
                        isFavorite={true}
                        isRecentlyWatched={false}
                        onSelect={() => {}}
                        onToggleFavorite={() => {
                          favoritesService.removeFromFavorites(user.id, favorite.video_id)
                            .then(() => {
                              setFavorites(prev => prev.filter(fav => fav.id !== favorite.id));
                            })
                            .catch(err => console.error("Error removing favorite:", err));
                        }}
                        animationDelay={index * 0.1}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-400">Your favorites list is empty.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
