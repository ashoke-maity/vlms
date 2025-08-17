const { getSupabase } = require("../configs/db");
const supabase = getSupabase();

function sendError(res, status, message, details = null) {
  return res.status(status).json({ ok: false, message, details });
}
exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body || {};

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { name: fullName } : undefined,
      },
    });

    if (error) {
      return sendError(res, 400, "Registration failed", error.message || error);
    }

    const { user, session } = data || {};

    // Insert into custom users table if registration succeeded
    if (user && fullName) {
      try {
        const { error: dbError } = await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            fullname: fullName
          }
        ]);
        if (dbError) {
          console.error('Error inserting into users table:', dbError);
        }
      } catch (dbInsertErr) {
        console.error('DB insert error:', dbInsertErr);
      }
    }

    return res.status(201).json({
      ok: true,
      message:
        "Registration successful. Check your email to confirm your account (if required).",
      user: user
        ? { id: user.id, email: user.email, user_metadata: user.user_metadata }
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    // Defensive: check if supabase.auth and signInWithPassword exist
    if (!supabase.auth || typeof supabase.auth.signInWithPassword !== 'function') {
      console.error('Supabase auth client is not initialized or signInWithPassword is missing');
      return sendError(res, 500, 'Supabase auth client misconfiguration');
    }

    let data, error;
    try {
      ({ data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
    } catch (err) {
      console.error('Error during signInWithPassword:', err);
      return sendError(res, 500, 'Error during login');
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
        ? { id: user.id, email: user.email, user_metadata: user.user_metadata }
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
