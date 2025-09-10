const jwt = require('jsonwebtoken');
const { getSupabase } = require('../configs/db');

exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ok: false, message: 'No token provided' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      // If token verification fails, try to verify with Supabase
      const supabase = getSupabase();
      const { data, error: supabaseError } = await supabase.auth.getUser(token);
      
      if (supabaseError || !data.user) {
        return res.status(401).json({ ok: false, message: 'Invalid token' });
      }
      
      req.user = data.user;
      next();
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
};