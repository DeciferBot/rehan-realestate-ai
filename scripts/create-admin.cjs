// One-off: create an auth user for the Acre command center.
// Usage: node --env-file=.env.local scripts/create-admin.cjs <email> <password>
const { createClient } = require("@supabase/supabase-js");

const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) {
  console.error("usage: create-admin.cjs <email> <password>");
  process.exit(1);
}

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

(async () => {
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
  console.log("CREATED:", data.user.id, data.user.email);
})();
