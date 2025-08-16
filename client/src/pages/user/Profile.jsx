import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Eye, 
  Heart, 
  Clock,
  Star,
  Play,
  Settings,
  ArrowLeft
} from "lucide-react";
import { mockVideos } from "../../libs/mockVideos";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate movie enthusiast who loves discovering new films and sharing recommendations with the community.",
    joinDate: "2024-01-15",
    avatar: null,
    preferences: {
      favoriteGenres: ["sci-fi", "action", "drama"],
      notifications: {
        email: true,
        push: false,
        recommendations: true
      }
    }
  });

  const [editData, setEditData] = useState(userData);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user statistics
  const userStats = {
    totalWatched: 47,
    totalFavorites: 23,
    totalWatchTime: "156h 32m",
    averageRating: 4.2,
    reviewsWritten: 12
  };

  // Mock recent activity
  const recentActivity = [
    { type: "watched", video: mockVideos[0], date: "2024-03-15" },
    { type: "favorited", video: mockVideos[2], date: "2024-03-14" },
    { type: "rated", video: mockVideos[4], rating: 4, date: "2024-03-13" },
    { type: "watched", video: mockVideos[6], date: "2024-03-12" },
  ];

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
      // TODO: Implement actual API call to update user data
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

  const getActivityIcon = (type) => {
    switch (type) {
      case "watched": return <Play size={16} className="text-green-400" />;
      case "favorited": return <Heart size={16} className="text-red-400" />;
      case "rated": return <Star size={16} className="text-yellow-400" />;
      default: return <Eye size={16} className="text-blue-400" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "watched": return `Watched "${activity.video.title}"`;
      case "favorited": return `Added "${activity.video.title}" to favorites`;
      case "rated": return `Rated "${activity.video.title}" ${activity.rating}/5 stars`;
      default: return "Unknown activity";
    }
  };

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
                      `${userData.firstName[0]}${userData.lastName[0]}`
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
                    userData.firstName
                  )}{" "}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    userData.lastName
                  )}
                </h2>
                <p className="text-neutral-400 text-sm">
                  Member since {new Date(userData.joinDate).toLocaleDateString()}
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
                      userData.email
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-neutral-500" />
                  <span className="text-sm text-neutral-300">
                    Joined {new Date(userData.joinDate).toLocaleDateString()}
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
                  <p className="text-sm text-neutral-400">{userData.bio}</p>
                )}
              </div>

              {/* Favorite Genres */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-neutral-300 mb-2">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.preferences.favoriteGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-neutral-800 text-xs rounded-full text-neutral-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
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

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics */}
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{userStats.totalWatched}</div>
                  <div className="text-sm text-neutral-400">Videos Watched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{userStats.totalFavorites}</div>
                  <div className="text-sm text-neutral-400">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{userStats.totalWatchTime}</div>
                  <div className="text-sm text-neutral-400">Watch Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.averageRating}</div>
                  <div className="text-sm text-neutral-400">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userStats.reviewsWritten}</div>
                  <div className="text-sm text-neutral-400">Reviews</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-neutral-800 rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {getActivityText(activity)}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/my-list"
                  className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={20} className="text-red-400" />
                    <div>
                      <h4 className="font-medium">My Favorites</h4>
                      <p className="text-sm text-neutral-400">View your saved videos</p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/browse"
                  className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <Eye size={20} className="text-blue-400" />
                    <div>
                      <h4 className="font-medium">Browse Videos</h4>
                      <p className="text-sm text-neutral-400">Discover new content</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
