ALTER TABLE fundis ADD COLUMN IF NOT EXISTS verification_status VARCHAR(32) DEFAULT 'unverified'; 

UPDATE fundis SET verification_status = 'verified' WHERE id = '<FUNDI_ID>'; 