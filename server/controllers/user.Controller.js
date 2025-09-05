const { getSupabase } = require("../configs/db");

function sendError(res, status, message, details = null) {
  return res.status(status).json({ ok: false, message, details });
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

// Extract user data from Google OAuth user object
function extractGoogleUserData(user) {
  const metadata = user.user_metadata || {};
  const identities = user.identities || [];
  const googleIdentity = identities.find(identity => identity.provider === 'google');
  const googleData = googleIdentity?.identity_data || {};
  
  // Try to get name from various sources
  let firstName = '';
  let lastName = '';
  
  // Priority order: identity_data > user_metadata > fallback parsing
  if (googleData.given_name && googleData.family_name) {
    firstName = googleData.given_name;
    lastName = googleData.family_name;
  } else if (googleData.name) {
    const nameParts = googleData.name.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  } else if (metadata.full_name) {
    const nameParts = metadata.full_name.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  } else if (metadata.name) {
    const nameParts = metadata.name.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }
  
  return {
    id: user.id,
    email: user.email,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    avatar_url: googleData.picture || metadata.picture || metadata.avatar_url || null,
    provider: 'google',
    verified: user.email_confirmed_at ? true : false
  };
}

// google login api
exports.googleLogin = async (req, res) => {
  try {
    console.log('🔍 Google login request received:', { hasToken: !!req.body.token });
    
    const supabase = getSupabase();
    const { token, userData } = req.body;

    if (!token) {
      console.log('❌ No token provided in request');
      return sendError(res, 400, "Token is required");
    }

    console.log('🔑 Attempting to get user from Supabase with token');
    // Get user from Supabase auth using the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.log('❌ Error getting user from Supabase:', error);
      return sendError(res, 401, "Invalid token", error.message || error);
    }

    if (!user) {
      console.log('❌ No user found for token');
      return sendError(res, 404, "User not found");
    }

    console.log('✅ User found from Supabase auth:', {
      id: user.id,
      email: user.email,
      hasMetadata: !!user.user_metadata,
      hasIdentities: !!(user.identities && user.identities.length > 0)
    });

    // Extract user data from Google OAuth
    const extractedData = extractGoogleUserData(user);
    console.log('📊 Extracted user data:', extractedData);
    
    // Check if user exists in our custom 'users' table
    console.log('📎 Checking if user exists in custom users table...');
    let { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('📎 Database query result:', {
      foundUser: !!existingUser,
      errorCode: selectError?.code,
      errorMessage: selectError?.message
    });

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = 'Not a single row was returned'
      console.log('❌ Database error checking for user:', selectError);
      return sendError(res, 500, "Error checking for user", selectError.message);
    }

    // If user doesn't exist, create them
    if (!existingUser) {
      console.log('✨ Creating new user in database...');
      const userDataToInsert = {
        id: extractedData.id,
        Email: extractedData.email,
        FirstName: extractedData.firstName || '',
        LastName: extractedData.lastName || '',
        avatar_url: extractedData.avatar_url,
        provider: extractedData.provider,
        email_verified: extractedData.verified,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 User data to insert:', userDataToInsert);

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([userDataToInsert])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating Google user:", insertError);
        return sendError(res, 500, "Error creating user", insertError.message);
      }
      existingUser = newUser;
      
      console.log(`New Google user created: ${extractedData.email}`);
    } else {
      // Update existing user's information if needed
      const updates = {
        updated_at: new Date().toISOString()
      };
      
      // Update avatar if it's new
      if (extractedData.avatar_url && extractedData.avatar_url !== existingUser.avatar_url) {
        updates.avatar_url = extractedData.avatar_url;
      }
      
      // Update name if it was empty before
      if (!existingUser.FirstName && extractedData.firstName) {
        updates.FirstName = extractedData.firstName;
      }
      if (!existingUser.LastName && extractedData.lastName) {
        updates.LastName = extractedData.lastName;
      }
      
      // Only update if there are changes
      if (Object.keys(updates).length > 1) { // more than just updated_at
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();
          
        if (updateError) {
          console.error("Error updating Google user:", updateError);
        } else {
          existingUser = updatedUser;
          console.log(`Google user updated: ${extractedData.email}`);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      message: "Google login successful",
      user: {
        id: existingUser.id,
        Email: existingUser.Email,
        FirstName: existingUser.FirstName,
        LastName: existingUser.LastName,
        avatar_url: existingUser.avatar_url,
        provider: existingUser.provider || 'google',
        email_verified: existingUser.email_verified,
        created_at: existingUser.created_at,
        updated_at: existingUser.updated_at
      },
      session: {
        access_token: token,
        user_id: user.id,
        expires_at: user.expires_at
      }
    });

  } catch (err) {
    console.error("google login error:", err);
    return sendError(res, 500, "Server error during Google login");
  }
};

// google signup api (for explicit signup flow)
exports.googleSignup = async (req, res) => {
  try {
    const supabase = getSupabase();
    const { token, additionalData } = req.body;

    if (!token) {
      return sendError(res, 400, "Token is required");
    }

    // Get user from Supabase auth using the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return sendError(res, 401, "Invalid token", error.message || error);
    }

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      return res.status(200).json({
        ok: true,
        message: "User already exists",
        user: existingUser,
        isNewUser: false
      });
    }

    if (selectError && selectError.code !== 'PGRST116') {
      return sendError(res, 500, "Error checking for user", selectError.message);
    }

    // Extract user data from Google OAuth
    const extractedData = extractGoogleUserData(user);
    
    // Merge with additional data if provided
    const finalData = {
      id: extractedData.id,
      Email: extractedData.email,
      FirstName: additionalData?.firstName || extractedData.firstName || '',
      LastName: additionalData?.lastName || extractedData.lastName || '',
      avatar_url: extractedData.avatar_url,
      provider: extractedData.provider,
      email_verified: extractedData.verified,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([finalData])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating Google user during signup:", insertError);
      return sendError(res, 500, "Error creating user", insertError.message);
    }

    console.log(`New Google user signed up: ${extractedData.email}`);

    return res.status(201).json({
      ok: true,
      message: "Google signup successful",
      user: newUser,
      isNewUser: true,
      session: {
        access_token: token,
        user_id: user.id,
        expires_at: user.expires_at
      }
    });

  } catch (err) {
    console.error("google signup error:", err);
    return sendError(res, 500, "Server error during Google signup");
  }
};
