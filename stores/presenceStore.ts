import { supabase } from "@/lib/supabase";
import { create } from "zustand";

type PresenceState = {
  onlineUserIds: string[];
  channel: ReturnType<typeof supabase.channel> | null;

  startPresence: (userId: string) => void;
  stopPresence: () => void;
};

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUserIds: [],
  channel: null,

  startPresence: (userId) => {
    if (get().channel) return; // already connected

    const channel = supabase.channel("presence:global", {
      config: { presence: { key: userId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const onlineIds = Object.keys(state);
        set({ onlineUserIds: onlineIds });
      })
      .on("presence", { event: "join" }, ({ key }) => {
        set((s) =>
          s.onlineUserIds.includes(key)
            ? s
            : { onlineUserIds: [...s.onlineUserIds, key] }
        );
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        set((s) => ({
          onlineUserIds: s.onlineUserIds.filter((id) => id !== key),
        }));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user_id: userId });
        }
      });

    set({ channel });
  },

  stopPresence: () => {
    const channel = get().channel;
    if (channel) {
      channel.unsubscribe();
    }
    set({ channel: null, onlineUserIds: [] });
  },
}));
