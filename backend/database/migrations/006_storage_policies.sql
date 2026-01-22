-- Storage bucket policies for course materials
-- Ensure RLS is enabled on storage.objects (usually enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to course materials
CREATE POLICY "Public read course materials"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-materials');

-- Allow authenticated users to upload course materials
CREATE POLICY "Authenticated upload course materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-materials');

-- Allow authenticated users to update their uploads (used by upsert)
CREATE POLICY "Authenticated update course materials"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'course-materials')
WITH CHECK (bucket_id = 'course-materials');
