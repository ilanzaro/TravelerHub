import type {
  Profile,
  ProfileInterest,
  ProfileViewer,
  PublicProfile,
} from "@/_types/types";
import { supabase } from "@/lib/supabase";
import { create } from "zustand";

type CreateProfileInput = {
  nickname: string;
  birth_date: string;
  bio?: string;
  last_location?: string;
  tags?: any;
  provider: "email" | "google";
};

type ProfileState = {
  myProfile?: Profile;
  nearbyProfiles: PublicProfile[];
  favorites: ProfileInterest[];
  profileViewers: ProfileViewer[];
  isLoading: boolean;

  fetchMyProfile: () => Promise<void>;
  fetchNearbyProfiles: (
    lng?: number,
    lat?: number,
    radius?: number
  ) => Promise<void>;
  fetchFavorites: (lng?: number, lat?: number) => Promise<void>;
  fetchProfileViewers: () => Promise<void>;
  createProfile: (data: CreateProfileInput) => Promise<void>;
  reset: () => void;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  myProfile: undefined,
  nearbyProfiles: [],
  favorites: [],
  profileViewers: [],
  isLoading: false,

  fetchMyProfile: async () => {
    set({ isLoading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) console.error(error);
    set({ myProfile: data ?? undefined, isLoading: false });
  },

  fetchNearbyProfiles: async (lng, lat, radius = 5000) => {
    set({ isLoading: true });
    const { data, error } = await supabase.rpc("nearby_profiles", {
      user_lng: lng,
      user_lat: lat,
      radius_meters: radius,
    });
    if (error) console.error(error);
    set({ nearbyProfiles: data ?? [], isLoading: false });
  },

  fetchFavorites: async (lng, lat) => {
    const profileId = get().myProfile?.id;
    if (!profileId) return;

    const { data, error } = await supabase.rpc("get_favorites_nearby", {
      p_profile_id: profileId,
      p_lng: lng,
      p_lat: lat,
      p_limit: 50,
    });
    if (error) console.error(error);
    set({ favorites: data ?? [] });
  },

  fetchProfileViewers: async () => {
    const profileId = get().myProfile?.id;
    if (!profileId) return;

    const { data, error } = await supabase
      .from("profile_viewers")
      .select("*")
      .eq("profile_id", profileId);

    if (error) console.error(error);
    set({ profileViewers: data ?? [] });
  },
  createProfile: async (input) => {
    set({ isLoading: true });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ isLoading: false });
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      provider: input.provider,
      email_verified: !!user.email_confirmed_at,
      nickname: input.nickname,
      birth_date: input.birth_date,
      bio: input.bio,
      last_location: input.last_location,
      tags: input.tags,
    });

    if (error) {
      set({ isLoading: false });
      throw error;
    }

    await get().fetchMyProfile();
    set({ isLoading: false });
  },

  reset: () =>
    set({
      myProfile: undefined,
      nearbyProfiles: [],
      favorites: [],
      profileViewers: [],
      isLoading: false,
    }),
}));
