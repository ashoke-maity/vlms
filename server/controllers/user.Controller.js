const { getSupabase } = require("../configs/db");

function sendError(res, status, message, details = null) {
  return res.status(status).json({ ok: false, message, details });
}

function sendSuccess(res, data, message = 'Success') {
  return res.status(200).json({ ok: true, message, data });
}

// user register api
exports.register = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { FirstName, LastName, Email, password } = req.body || {};

    if (!Email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // Register with Supabase Auth (email/password) and store names in metadata
    const { data, error } = await supabase.auth.signUp({
      email: Email,
      password,
      options: {
        data: {
          FirstName,
          LastName,
        },
      },
    });

    if (error) {
      return sendError(res, 400, "Registration failed", error.message || error);
    }

    const { user, session } = data || {};

    // Insert into custom users table if registration succeeded
    if (user && FirstName && LastName) {
      try {
        const { error: dbError } = await supabase.from("users").insert([
          {
            id: user.id,
            Email: user.email,
            FirstName: FirstName,
            LastName: LastName,
          },
        ]);
        if (dbError) {
          console.error("Error inserting into users table:", dbError);
        }
      } catch (dbInsertErr) {
        console.error("DB insert error:", dbInsertErr);
      }
    }

    return res.status(201).json({
      ok: true,
      message:
        "Registration successful. Check your email to confirm your account (if required).",
      user: user
        ? { id: user.id, Email: user.email, user_metadata: user.user_metadata }
        : null,
      session: session
        ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          }
        : null,
    });
  } catch (err) {
    console.error("register error:", err);
    return sendError(res, 500, "Server error during registration");
  }
};

// user login api
exports.login = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { Email, password } = req.body || {};

    if (!Email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // Defensive: check if supabase.auth and signInWithPassword exist
    if (
      !supabase.auth ||
      typeof supabase.auth.signInWithPassword !== "function"
    ) {
      console.error(
        "Supabase auth client is not initialized or signInWithPassword is missing"
      );
      return sendError(res, 500, "Supabase auth client misconfiguration");
    }

    let data, error;
    try {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email: Email,
        password,
      }));
    } catch (err) {
      console.error("Error during signInWithPassword:", err);
      return sendError(res, 500, "Error during login");
    }

    if (error) {
      return sendError(
        res,
        401,
        "Invalid credentials or user not confirmed",
        error.message || error
      );
    }

    const { user, session } = data || {};
    return res.status(200).json({
      ok: true,
      message: "Login successful",
      user: user
        ? { id: user.id, Email: user.email, user_metadata: user.user_metadata }
        : null,
      session: session
        ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          }
        : null,
    });
  } catch (err) {
    console.error("login error:", err);
    return sendError(res, 500, "Server error during login");
  }
};

// user delete account
exports.deleteAccount = async (req, res) => {
  try {
    const supabase = getSupabase();
    const userId = req.params.id;
    if (!userId) {
      return sendError(res, 400, "User ID is required");
    }

    // Delete from custom users table
    const { error: dbError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (dbError) {
      return sendError(res, 500, "Error deleting user from database", dbError.message || dbError);
    }

    // If you want to delete from Supabase Auth, uncomment below (requires admin access):
    // await supabase.auth.admin.deleteUser(userId);

    return res.json({ ok: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error while deleting account");
  }
};

// user change password
exports.changePassword = async (req, res) => {
  try {
    const supabase = getSupabase();
    const userId = req.params.id;
    const { OldPassword, NewPassword, ConfirmPassword } = req.body;

    if (!userId || !OldPassword || !NewPassword || !ConfirmPassword) {
      return sendError(res, 400, "User ID, current password, new password, and confirm password are required");
    }
    if (NewPassword !== ConfirmPassword) {
      return sendError(res, 400, "New password and confirm password do not match");
    }
    return res.json({ ok: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error while changing password");
  }
};

// user logout
exports.logout = async (req, res) => {
  try {
    const supabase = getSupabase();
    const userId = req.user.id;
    return res.json({ ok: true, message: "Logout successful" });
  }
  catch (err) {
    console.error(err);
    return sendError(res, 500, "Server error while logging out");
  }
};

// Add video to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
      return sendError(res, 400, "User ID and video ID are required");
    }

    // Check if already in favorites
    const { data: existingFav } = await supabase
      .from("Favourites")
      .select("*")
      .eq("user_id", userId)
      .eq("video_id", videoId)
      .single();

    if (existingFav) {
      return sendSuccess(res, existingFav, "Video is already in favorites");
    }

    // Add to favorites
    const { data, error } = await supabase
      .from("Favourites")
      .insert([{
        user_id: userId,
        video_id: videoId,
        added_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      return sendError(res, 500, "Failed to add to favorites", error.message);
    }

    return sendSuccess(res, data[0], "Added to favorites successfully");
  } catch (err) {
    console.error("Error adding to favorites:", err);
    return sendError(res, 500, "Server error while adding to favorites");
  }
};

// Remove video from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const supabase = getSupabase();
    const userId = req.params.userId;
    const videoId = req.params.videoId;

    if (!userId || !videoId) {
      return sendError(res, 400, "User ID and video ID are required");
    }

    const { error } = await supabase
      .from("Favourites")
      .delete()
      .eq("user_id", userId)
      .eq("video_id", videoId);

    if (error) {
      return sendError(res, 500, "Failed to remove from favorites", error.message);
    }

    return sendSuccess(res, null, "Removed from favorites successfully");
  } catch (err) {
    console.error("Error removing from favorites:", err);
    return sendError(res, 500, "Server error while removing from favorites");
  }
};

// Get user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const supabase = getSupabase();
    const userId = req.params.userId;

    if (!userId) {
      return sendError(res, 400, "User ID is required");
    }

    const { data, error } = await supabase
      .from("Favourites")
      .select("*, video_id")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (error) {
      return sendError(res, 500, "Failed to get favorites", error.message);
    }

    return sendSuccess(res, data, "Favorites retrieved successfully");
  } catch (err) {
    console.error("Error getting favorites:", err);
    return sendError(res, 500, "Server error while getting favorites");
  }
};