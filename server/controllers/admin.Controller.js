const { getSupabase } = require("../configs/db");

exports.adminLogin = async (req, res) => {
  const supabase = await getSupabase();
};