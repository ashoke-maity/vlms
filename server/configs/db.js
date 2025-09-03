const dotenv = require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

let supabase;

exports.dbConnect = async () => {
  supabase = createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );
  console.log("Connected to DB successfully !");
  return supabase;
};

exports.getSupabase = () => supabase;
