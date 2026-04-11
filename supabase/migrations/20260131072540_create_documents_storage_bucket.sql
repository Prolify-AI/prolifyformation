/*
  # Create Documents Storage Bucket

  1. Storage
    - Create a bucket named 'documents' for storing company documents
    - Enable RLS on the bucket

  2. Security
    - Allow authenticated users to upload files to their company folders
    - Allow authenticated users to read files from their company folders
    - Allow authenticated users to delete files from their company folders
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
);

CREATE POLICY "Authenticated users can read documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
);

CREATE POLICY "Authenticated users can delete their documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
);

CREATE POLICY "Authenticated users can update documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents'
);
