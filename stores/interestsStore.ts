import { supabase } from "@/lib/supabase";
import { create } from "zustand";

export type Interest = {
  profile_id: string;
  target_profile_id: string;
  created_at: string;
};

type InterestsState = {
  favorites: Interest[];
  isLoading: boolean;
  subscription: ReturnType<typeof supabase.channel> | null;

  fetchFavorites: () => Promise<void>;
  addFavorite: (target_profile_id: string) => Promise<void>;

  subscribeToFavorites: () => void;
  unsubscribeFromFavorites: () => void;

  reset: () => void;
};

export const useInterestsStore = create<InterestsState>((set, get) => ({
  favorites: [],
  isLoading: false,
  subscription: null,

  fetchFavorites: async () => {
    set({ isLoading: true });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return set({ isLoading: false });

    const { data, error } = await supabase
      .from("profile_interests")
      .select("*")
      .eq("profile_id", user.id);
    if (error) console.error(error);

    set({ favorites: data ?? [], isLoading: false });
  },

  addFavorite: async (target_profile_id) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profile_interests")
      .insert([{ profile_id: user.id, target_profile_id }]);
    if (error) console.error(error);

    await get().fetchFavorites();
  },

  subscribeToFavorites: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const sub = supabase
      .channel("public:profile_interests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profile_interests",
          filter: `profile_id=eq.${user.id}`,
        },
        (payload) => {
          const current = get().favorites;
          if (payload.eventType === "INSERT") {
            set({ favorites: [...current, payload.new as Interest] });
          } else if (payload.eventType === "DELETE") {
            set({
              favorites: current.filter(
                (f) =>
                  f.target_profile_id !==
                  (payload.old as Interest).target_profile_id
              ),
            });
          }
        }
      )
      .subscribe();

    set({ subscription: sub });
  },

  unsubscribeFromFavorites: () => {
    const sub = get().subscription;
    if (sub) sub.unsubscribe();
    set({ subscription: null });
  },

  reset: () => set({ favorites: [], isLoading: false, subscription: null }),
}));
