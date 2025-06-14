
-- Create tenants table for main users
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscription_plan TEXT DEFAULT 'basic',
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create tenant_users table for users affiliated with each tenant
CREATE TABLE public.tenant_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'warehouse_keeper', 'accountant', 'cashier')) NOT NULL DEFAULT 'warehouse_keeper',
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  UNIQUE(tenant_id, user_id)
);

-- Create tenant_profiles table to store additional user profile data
CREATE TABLE public.tenant_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_tenant_owner BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Update existing tables to include tenant_id for multi-tenancy
ALTER TABLE public.warehouses ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.items ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.categories ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.stocks ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.transactions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Tenant owners can manage their tenant" ON public.tenants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = tenants.id 
      AND is_tenant_owner = true
    )
  );

-- RLS Policies for tenant_users
CREATE POLICY "Tenant users can view users in their tenant" ON public.tenant_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = tenant_users.tenant_id
    )
  );

CREATE POLICY "Tenant admins can manage users in their tenant" ON public.tenant_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users tu
      JOIN public.tenant_profiles tp ON tp.user_id = auth.uid()
      WHERE tu.tenant_id = tenant_users.tenant_id
      AND tp.tenant_id = tenant_users.tenant_id
      AND (tu.role = 'admin' OR tp.is_tenant_owner = true)
    )
  );

-- RLS Policies for tenant_profiles
CREATE POLICY "Users can view their own profile" ON public.tenant_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.tenant_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Tenant admins can manage profiles in their tenant" ON public.tenant_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users tu
      JOIN public.tenant_profiles tp ON tp.user_id = auth.uid()
      WHERE tu.tenant_id = tenant_profiles.tenant_id
      AND tp.tenant_id = tenant_profiles.tenant_id
      AND (tu.role = 'admin' OR tp.is_tenant_owner = true)
    )
  );

-- Update RLS policies for existing tables to include tenant_id checks
DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;

-- Update warehouses policies
CREATE POLICY "Tenant users can access warehouses in their tenant" ON public.warehouses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = warehouses.tenant_id
    )
  );

-- Update items policies  
CREATE POLICY "Tenant users can access items in their tenant" ON public.items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = items.tenant_id
    )
  );

-- Update categories policies
CREATE POLICY "Tenant users can access categories in their tenant" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = categories.tenant_id
    )
  );

-- Update stocks policies
CREATE POLICY "Tenant users can access stocks in their tenant" ON public.stocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = stocks.tenant_id
    )
  );

-- Update transactions policies
CREATE POLICY "Tenant users can access transactions in their tenant" ON public.transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tenant_profiles 
      WHERE user_id = auth.uid() 
      AND tenant_id = transactions.tenant_id
    )
  );

-- Function to create a new tenant and tenant owner
CREATE OR REPLACE FUNCTION public.create_tenant_with_owner(
  tenant_name TEXT,
  owner_email TEXT,
  owner_password TEXT,
  owner_username TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_tenant_id UUID;
  new_user_id UUID;
BEGIN
  -- Create the tenant
  INSERT INTO public.tenants (name, email)
  VALUES (tenant_name, owner_email)
  RETURNING id INTO new_tenant_id;
  
  -- Create auth user
  INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES (owner_email, crypt(owner_password, gen_salt('bf')), now(), now(), now())
  RETURNING id INTO new_user_id;
  
  -- Create tenant profile
  INSERT INTO public.tenant_profiles (user_id, tenant_id, username, is_tenant_owner)
  VALUES (new_user_id, new_tenant_id, owner_username, true);
  
  -- Create tenant user record
  INSERT INTO public.tenant_users (tenant_id, user_id, role)
  VALUES (new_tenant_id, new_user_id, 'admin');
  
  RETURN new_tenant_id;
END;
$$;
