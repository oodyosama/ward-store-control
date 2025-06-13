
-- Create users table in Supabase
CREATE TABLE public.users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'warehouse_keeper', 'accountant')) NOT NULL DEFAULT 'warehouse_keeper',
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since this is a warehouse management system)
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);

-- Insert some sample users
INSERT INTO public.users (id, username, email, role, permissions, is_active, created_at, last_login) VALUES
  ('1', 'أحمد محمد', 'ahmed@warehouse.com', 'admin', ARRAY['read', 'write', 'delete', 'manage_users'], true, '2024-01-15', '2024-06-10'),
  ('2', 'فاطمة علي', 'fatima@warehouse.com', 'manager', ARRAY['read', 'write', 'manage_inventory'], true, '2024-02-20', '2024-06-09'),
  ('3', 'محمد حسن', 'mohammed@warehouse.com', 'warehouse_keeper', ARRAY['read', 'write'], true, '2024-03-10', '2024-06-08'),
  ('4', 'سارة أحمد', 'sara@warehouse.com', 'accountant', ARRAY['read'], false, '2024-04-05', '2024-05-15');
