import { create } from 'zustand';
import { insforge } from '@/lib/insforge';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ requiresVerification: boolean }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  setOnboarded: () => Promise<void>;
}

/** Extract a display name from the Insforge user object */
function extractName(insforgeUser: { email: string; profile?: { name?: string } | null }): string | undefined {
  return insforgeUser.profile?.name ?? undefined;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isOnboarded: false,

  initialize: async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentSession();

      if (error || !data?.session) {
        set({ user: null, isLoading: false, isOnboarded: false });
        return;
      }

      const insforgeUser = data.session.user;
      const user: User = {
        id: insforgeUser.id,
        email: insforgeUser.email,
        name: extractName(insforgeUser),
      };

      // Check onboarding status from user_profiles
      let isOnboarded = false;
      const { data: profile } = await insforge.database
        .from('user_profiles')
        .select('onboarded')
        .eq('id', user.id)
        .single();

      if (profile) {
        isOnboarded = profile.onboarded === true;
      } else {
        // Profile doesn't exist (OAuth first login) - create it
        await insforge.database.from('user_profiles').insert([{
          id: user.id,
          display_name: user.name || user.email.split('@')[0],
          onboarded: false,
        }]);
        isOnboarded = false;
      }

      set({ user, isLoading: false, isOnboarded });
    } catch {
      set({ user: null, isLoading: false, isOnboarded: false });
    }
  },

  signUp: async (email, password, name) => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name: name || email.split('@')[0],
    });

    if (error) throw new Error(error.message);

    if (data?.requireEmailVerification) {
      return { requiresVerification: true };
    }

    // No verification required — user is signed in
    if (data?.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: extractName(data.user),
      };

      // Create user_profiles row
      await insforge.database.from('user_profiles').insert([{
        id: user.id,
        display_name: user.name || email.split('@')[0],
        onboarded: false,
      }]);

      set({ user, isOnboarded: false });
    }

    return { requiresVerification: false };
  },

  verifyOtp: async (email, otp) => {
    const { data, error } = await insforge.auth.verifyEmail({ email, otp });

    if (error) throw new Error(error.message);

    if (data?.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: extractName(data.user),
      };

      // Create user_profiles row
      await insforge.database.from('user_profiles').insert([{
        id: user.id,
        display_name: user.name || email.split('@')[0],
        onboarded: false,
      }]);

      set({ user, isOnboarded: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    if (data?.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: extractName(data.user),
      };

      // Fetch onboarding status
      let isOnboarded = false;
      const { data: profile } = await insforge.database
        .from('user_profiles')
        .select('onboarded')
        .eq('id', user.id)
        .single();

      if (profile) {
        isOnboarded = profile.onboarded === true;
      }

      set({ user, isOnboarded });
    }
  },

  signInWithOAuth: async (provider) => {
    await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: `${window.location.origin}/auth`,
    });
  },

  signOut: async () => {
    const { error } = await insforge.auth.signOut();
    if (error) throw new Error(error.message);
    set({ user: null, isOnboarded: false });
  },

  setOnboarded: async () => {
    const { user } = get();
    if (!user) return;

    await insforge.database
      .from('user_profiles')
      .update({ onboarded: true })
      .eq('id', user.id);

    set({ isOnboarded: true });
  },
}));
