-- Search Indexes
CREATE INDEX IF NOT EXISTS skills_search_idx ON skills USING gin(to_tsvector('english', title || ' ' || coalesce(description,'')));
CREATE INDEX IF NOT EXISTS skills_category_idx ON skills(category);
CREATE INDEX IF NOT EXISTS skills_status_idx ON skills(status);

-- Order attachments are stored in Supabase Storage, not the DB
-- Add attachment_urls column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS attachment_urls TEXT[] DEFAULT '{}';

ALTER TABLE orders ADD COLUMN IF NOT EXISTS brief TEXT;

-- Additional storage bucket needed:
-- Bucket name: order-attachments
-- Set to private (only order participants can access)
-- Max file size: 20MB
-- Allowed types: image/*, application/pdf,
--   application/msword,
--   application/vnd.openxmlformats-officedocument.wordprocessingml.document,
--   application/zip
