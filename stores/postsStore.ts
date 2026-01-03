import type { Post } from "@/_types/types";
import { supabase } from "@/lib/supabase";
import { create } from "zustand";

type PostsState = {
  posts: Post[];
  isLoading: boolean;

  fetchPosts: () => Promise<void>;
  createPost: (post: Partial<Post>) => Promise<void>;
  reset: () => void;
};

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .gt("expires_at", new Date().toISOString());
    if (error) console.error(error);
    set({ posts: data ?? [], isLoading: false });
  },

  createPost: async (post) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("posts")
      .insert([{ ...post, user_id: user.id }]);
    if (error) console.error(error);

    await get().fetchPosts();
  },

  reset: () => set({ posts: [], isLoading: false }),
}));
