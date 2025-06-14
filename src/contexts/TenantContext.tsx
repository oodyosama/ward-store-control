
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  };
  tenant_users?: Array<{
    role: string;
    is_active: boolean;
  }>;
}

interface TenantContextType {
  user: User | null;
  session: Session | null;
  profile: TenantProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('tenant_profiles')
        .select(`
          *,
          tenants(*),
          tenant_users(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Handle the case where tenant_users might be an error or array
        const profileData: TenantProfile = {
          ...data,
          tenant_users: Array.isArray(data.tenant_users) ? data.tenant_users : []
        };
        
        setProfile(profileData);
        console.log('Profile loaded:', data.username);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "تم تسجيل خروجك من النظام",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <TenantContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      signOut
    }}>
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
