import type { Conversation, Message } from "@/_types/types";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChatState = {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // keyed by conversation_id
  isLoading: boolean;
  messageSubscription: RealtimeChannel | null;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    receiverId: string,
    content: string
  ) => Promise<void>;

  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  addMessage: (msg: Message) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      isLoading: false,
      messageSubscription: null,

      fetchConversations: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
          .from("my_conversations")
          .select("*");
        if (error) console.error(error);
        set({ conversations: data ?? [], isLoading: false });
      },

      fetchMessages: async (conversationId) => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
        if (error) console.error(error);

        set((state) => ({
          messages: { ...state.messages, [conversationId]: data ?? [] },
        }));
      },

      sendMessage: async (conversationId, receiverId, content) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from("messages").insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            receiver_id: receiverId,
            content,
          },
        ]);
        if (error) console.error(error);
      },

      addMessage: (msg) => {
        set((state) => {
          const convId = msg.conversation_id;
          const convMsgs = state.messages[convId] ?? [];
          return {
            messages: { ...state.messages, [convId]: [...convMsgs, msg] },
          };
        });

        // Add conversation if missing
        const convExists = get().conversations.find(
          (c) => c.id === msg.conversation_id
        );
        if (!convExists) {
          get().fetchConversations();
        }
      },

      subscribeToMessages: () => {
        if (get().messageSubscription) return;

        const subscription = supabase
          .channel("public:messages")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "messages" },
            (payload) => {
              const newMsg = payload.new as Message;
              get().addMessage(newMsg);
            }
          )
          .subscribe();

        set({ messageSubscription: subscription });
      },

      unsubscribeFromMessages: () => {
        const sub = get().messageSubscription;
        if (!sub) return;

        supabase.removeChannel(sub);
        set({ messageSubscription: null });
      },

      reset: () =>
        set({
          conversations: [],
          messages: {},
          isLoading: false,
          messageSubscription: null,
        }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
      }),
    }
  )
);
