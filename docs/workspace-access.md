# Workspace access ("No workspace found")

## How access works

This app is multi-tenant. Each workspace is a row in **`tenants`** (e.g. slug
`rehan` → "Simmer Properties"). A login gets access to a workspace by having a
matching row in the **`members`** table, keyed by **email**:

```
members(id, tenant_id, name, email, role, created_at)
```

When a user signs in, the app resolves their workspace by matching their auth
email (`auth.users.email`) against `members.email`. **If there is no matching
`members` row, the user sees "No workspace found — your account isn't linked to
any workspace yet. Contact your administrator to be added as a member."**

So the message is not an error — it means the signed-in email was never added
to `members`. Creating the auth user (see `scripts/create-admin.cjs`) is *not*
enough on its own; it must also be granted membership here.

## Add a teammate

### Option A — script (preferred)

```bash
node --env-file=.env.local scripts/add-member.cjs <email> <name> [role] [tenantSlug]
# role defaults to "agent", tenantSlug defaults to "rehan"
node --env-file=.env.local scripts/add-member.cjs rehan@engworldwide.com "Rehan" owner
```

The script is idempotent (won't create a duplicate) and resolves the workspace
by slug. It needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (the **secret
key** in newer Supabase projects) in `.env.local`.

### Option B — SQL (Supabase dashboard → SQL Editor)

The SQL Editor runs as the database owner and bypasses RLS, so no API key is
needed:

```sql
insert into members (tenant_id, name, email, role)
select id, 'Rehan', 'rehan@engworldwide.com', 'owner'
from tenants
where slug = 'rehan';
```

After either option, the user must **log out and back in** to mint a fresh
session, then reload `/console`.

## Roles

`role` is free text on `members`. Use `owner` for full access (matches the
primary account). Other values (e.g. `agent`) are used elsewhere for lead
assignment and escalation routing.
