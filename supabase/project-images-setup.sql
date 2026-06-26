-- ───────────────────────────────────────────────────────────────────────────
-- Project gallery images — one-time Supabase setup
--
-- The ingest pipeline renders the pages of a developer availability PDF and
-- uploads them to a public Storage bucket; the property detail page reads the
-- recorded public URLs back (from documents.extracted.images) and shows them in
-- a gallery below the hero.
--
-- With a publishable key (no secret/service-role key) the app cannot create the
-- bucket or bypass RLS at runtime, so this must be applied once via the Supabase
-- SQL editor (which runs with owner privileges).
-- ───────────────────────────────────────────────────────────────────────────

-- 1. Public bucket. `public = true` makes the object URLs world-readable, which
--    is what lets <img src> load them without auth — no SELECT policy needed.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- 2. Upload (INSERT) policy. Uploads are NOT public — they require a policy.
--    Pick the model that matches how the ingest route authenticates:
--
--    (a) Privileged key (secret/service-role): no policy needed; it bypasses RLS.
--
--    (b) Authenticated server client (recommended for publishable-only): migrate
--        the ingest route to the cookie-based @supabase/ssr client so uploads run
--        as the signed-in user, then enable the policy below. Do NOT grant the
--        anon role write access — the publishable key is public, so anon-write
--        would let anyone upload to this bucket.
--
-- create policy "authenticated can upload project images"
--   on storage.objects for insert to authenticated
--   with check (bucket_id = 'project-images');
--
-- create policy "authenticated can update project images"
--   on storage.objects for update to authenticated
--   using (bucket_id = 'project-images')
--   with check (bucket_id = 'project-images');
