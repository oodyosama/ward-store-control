
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface TenantProfile {
  id: string;
  user_id: string;
  tenant_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  is_tenant_owner: boolean;
  created_at: string;
  tenants?: {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    subscription_plan?: string;
    settings?: any;
  };
  tenant_users?: Array<{
    id: string;
    role: string;
    permissions: string[];
    is_active: boolean;
    last_login?: string;
  }>;
}

interface TenantContextType {
  user: User | null;
  session: Session | null;
  profile: TenantProfile | null;
  isLoading: boolean;
  isTenantOwner: boolean;
  tenantId: string | null;
  userRole: string | null;
  userPermissions: string[];
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // First, fetch the tenant profile
      const { data: profileData, error: profileError } = await supabase
        .from('tenant_profiles')
        .select(`
          *,
          tenants(*)
        `)
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      console.log('Profile data:', profileData);

      // Then, fetch the tenant user data separately
      const { data: tenantUserData, error: tenantUserError } = await supabase
        .from('tenant_users')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_id', profileData.tenant_id);

      if (tenantUserError) {
        console.error('Error fetching tenant user data:', tenantUserError);
        // Continue without tenant user data if there's an error
      }

      console.log('Tenant user data:', tenantUserData);

      // Combine the data
      const completeProfile: TenantProfile = {
        ...profileData,
        tenant_users: tenantUserData || []
      };

      return completeProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Existing session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          setProfile(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isTenantOwner = profile?.is_tenant_owner ?? false;
  const tenantId = profile?.tenant_id ?? null;
  const userRole = profile?.tenant_users?.[0]?.role ?? null;
  const userPermissions = profile?.tenant_users?.[0]?.permissions ?? [];

  return (
    <TenantContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isTenantOwner,
        tenantId,
        userRole,
        userPermissions,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
