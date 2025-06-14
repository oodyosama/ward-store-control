
-- Fix infinite recursion in tenant_profiles policies
-- First, drop any existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view their own tenant profile" ON public.tenant_profiles;
DROP POLICY IF EXISTS "Users can insert their own tenant profile" ON public.tenant_profiles;
DROP POLICY IF EXISTS "Users can update their own tenant profile" ON public.tenant_profiles;
DROP POLICY IF EXISTS "Tenant owners can manage profiles" ON public.tenant_profiles;

-- Create simple, non-recursive policies for tenant_profiles
CREATE POLICY "Enable read access for users based on user_id" 
ON public.tenant_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" 
ON public.tenant_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" 
ON public.tenant_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Also ensure tenant_users table has proper policies
DROP POLICY IF EXISTS "Users can view their tenant user data" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can insert their tenant user data" ON public.tenant_users;

CREATE POLICY "Enable read access for tenant users" 
ON public.tenant_users FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for tenant users" 
ON public.tenant_users FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Ensure tenants table has proper policies
DROP POLICY IF EXISTS "Tenant owners can view their tenants" ON public.tenants;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.tenants;

CREATE POLICY "Enable read for tenant owners" 
ON public.tenants FOR SELECT 
USING (id IN (
  SELECT tenant_id FROM public.tenant_profiles 
  WHERE user_id = auth.uid() AND is_tenant_owner = true
));

CREATE POLICY "Enable insert for authenticated users" 
ON public.tenants FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
