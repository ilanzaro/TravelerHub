import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Viewer = {
  id: string;
  profile_id: string;
  viewer_id: string;
  viewed_at: string;
  expires_at: string;
};

type ViewersState = {
  viewers: Viewer[];
  isLoading: boolean;
  subscription: ReturnType<typeof supabase.channel> | null;

  fetchViewers: () => Promise<void>;
  addViewer: (profile_id: string) => Promise<void>;

  subscribeToViewers: () => Promise<void>;
  unsubscribeFromViewers: () => void;

  reset: () => void;
};

export const useViewersStore = create<ViewersState>()(
  persist(
    (set, get) => ({
      viewers: [],
      isLoading: false,
      subscription: null,

      fetchViewers: async (): Promise<void> => {
        set({ isLoading: true });
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        set({ isLoading: false });

        const { data, error } = await supabase
          .from("profile_viewers")
          .select("*")
          .eq("profile_id", user.id)
          .order("viewed_at", { ascending: false });
        if (error) console.error(error);

        set({ viewers: data ?? [], isLoading: false });
        return;
      },

      addViewer: async (profile_id: string): Promise<void> => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from("profile_viewers")
          .insert([{ profile_id, viewer_id: user.id }]);
        if (error) console.error(error);

        await get().fetchViewers();
        return;
      },

      subscribeToViewers: async (): Promise<void> => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const sub = supabase
          .channel("public:profile_viewers")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "profile_viewers",
              filter: `profile_id=eq.${user.id}`,
            },
            (payload) => {
              set({ viewers: [payload.new as Viewer, ...get().viewers] });
            }
          )
          .subscribe();

        set({ subscription: sub });
        return;
      },

      unsubscribeFromViewers: () => {
        const sub = get().subscription;
        if (sub) sub.unsubscribe();
        set({ subscription: null });
      },

      reset: () => set({ viewers: [], isLoading: false, subscription: null }),
    }),
    {
      name: "viewers-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        viewers: state.viewers,
      }),
    }
  )
);
