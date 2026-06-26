// One-off: grant a login access to a workspace by adding it to `members`.
//
// Workspace access in this app is membership-by-email: the app resolves a
// signed-in user's workspace by matching their auth email against a row in
// the `members` table. A login with no matching `members` row sees
// "No workspace found" — so adding the row here is what clears that screen.
//
// Usage:
//   node --env-file=.env.local scripts/add-member.cjs <email> <name> [role] [tenantSlug]
// Examples:
//   node --env-file=.env.local scripts/add-member.cjs rehan@engworldwide.com "Rehan" owner
//   node --env-file=.env.local scripts/add-member.cjs agent@firm.com "Sales Agent" agent rehan
//
// Note: the auth user must already exist (create it with create-admin.cjs).
const { createClient } = require("@supabase/supabase-js");

const email = process.argv[2];
const name = process.argv[3];
const role = process.argv[4] || "agent";
const tenantSlug = process.argv[5] || "rehan";

if (!email || !name) {
  console.error("usage: add-member.cjs <email> <name> [role] [tenantSlug]");
  process.exit(1);
}

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

(async () => {
  // Resolve the workspace (tenant) by slug.
  const { data: tenant, error: tErr } = await sb
    .from("tenants")
    .select("id,slug,name")
    .eq("slug", tenantSlug)
    .single();
  if (tErr || !tenant) {
    console.error(`ERROR: no tenant with slug "${tenantSlug}":`, tErr?.message ?? "not found");
    process.exit(1);
  }

  // Idempotent: don't create a duplicate membership for the same email.
  const { data: existing } = await sb
    .from("members")
    .select("id,role")
    .eq("tenant_id", tenant.id)
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    console.log(`ALREADY A MEMBER: ${email} in "${tenant.name}" (role: ${existing.role}); nothing to do.`);
    process.exit(0);
  }

  const { data, error } = await sb
    .from("members")
    .insert({ tenant_id: tenant.id, name, email, role })
    .select("id")
    .single();
  if (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
  console.log(`ADDED: ${email} as "${role}" in "${tenant.name}" (member id ${data.id}).`);
  console.log("The user should log out and back in to pick up workspace access.");
})();
