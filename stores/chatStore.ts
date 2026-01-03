import type { Conversation, Message } from "@/_types/types";
import { supabase } from "@/lib/supabase";
import { create } from "zustand";

type ChatState = {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // keyed by conversation_id
  isLoading: boolean;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    receiverId: string,
    content: string
  ) => Promise<void>;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase.from("my_conversations").select("*");
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

    await get().fetchMessages(conversationId);
  },

  reset: () => set({ conversations: [], messages: {}, isLoading: false }),
}));
