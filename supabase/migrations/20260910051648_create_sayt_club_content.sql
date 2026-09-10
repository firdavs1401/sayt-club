/*
# Create Sayt Club shared content storage

1. New Tables
- `club_files`
- `id` (uuid, primary key)
- `name` (text, uploaded file name)
- `storage_path` (text, private storage object path)
- `size_bytes` (bigint, original file size)
- `mime_type` (text, browser-provided file type)
- `created_at` (timestamptz, upload time)

2. Storage
- Create a public `club-files` bucket for downloadable club resources.
- Permit the public frontend to upload, list, and remove files in this intentionally shared club library.

3. Security
- Enable RLS on `club_files`.
- Add separate anon + authenticated policies for SELECT, INSERT, UPDATE, and DELETE because this is a no-sign-in shared club site.
- Add storage object policies limited to the `club-files` bucket.
*/

CREATE TABLE IF NOT EXISTS public.club_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  size_bytes bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT 'application/octet-stream',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.club_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view club files" ON public.club_files;
CREATE POLICY "Public can view club files"
ON public.club_files FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can add club files" ON public.club_files;
CREATE POLICY "Public can add club files"
ON public.club_files FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update club files" ON public.club_files;
CREATE POLICY "Public can update club files"
ON public.club_files FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete club files" ON public.club_files;
CREATE POLICY "Public can delete club files"
ON public.club_files FOR DELETE
TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('club-files', 'club-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read club file objects" ON storage.objects;
CREATE POLICY "Public can read club file objects"
ON storage.objects FOR SELECT
TO anon, authenticated USING (bucket_id = 'club-files');

DROP POLICY IF EXISTS "Public can upload club file objects" ON storage.objects;
CREATE POLICY "Public can upload club file objects"
ON storage.objects FOR INSERT
TO anon, authenticated WITH CHECK (bucket_id = 'club-files');

DROP POLICY IF EXISTS "Public can update club file objects" ON storage.objects;
CREATE POLICY "Public can update club file objects"
ON storage.objects FOR UPDATE
TO anon, authenticated USING (bucket_id = 'club-files') WITH CHECK (bucket_id = 'club-files');

DROP POLICY IF EXISTS "Public can delete club file objects" ON storage.objects;
CREATE POLICY "Public can delete club file objects"
ON storage.objects FOR DELETE
TO anon, authenticated USING (bucket_id = 'club-files');