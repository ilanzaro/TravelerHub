import type { Post } from "@/_types/types";
import { supabase } from "@/lib/supabase";
import { create } from "zustand";

type PostsState = {
  posts: Post[];
  isLoading: boolean;
  postSubscription: ReturnType<typeof supabase.channel> | null;
  fetchPosts: () => Promise<void>;
  createPost: (post: Partial<Post>) => Promise<void>;
  addPost: (post: Post) => void;
  subscribeToPosts: () => void;
  unsubscribeFromPosts: () => void;
  reset: () => void;
};

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,
  postSubscription: null,

  fetchPosts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .gt("expires_at", new Date().toISOString());
    if (error) console.error("fetchPosts error:", error);
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
    if (error) console.error("createPost error:", error);

    await get().fetchPosts();
  },

  addPost: (post) => {
    set((state) => {
      const exists = state.posts.find((p) => p.id === post.id);
      if (exists) return state; // avoid duplicates
      return { posts: [post, ...state.posts] };
    });
  },

  subscribeToPosts: () => {
    const currentSub = get().postSubscription;
    if (currentSub) return; // already subscribed

    const newSub = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => get().addPost(payload.new as Post)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          const updatedPost = payload.new as Post;
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === updatedPost.id ? updatedPost : p
            ),
          }));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload) => {
          const deletedPost = payload.old as Post;
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== deletedPost.id),
          }));
        }
      )
      .subscribe();

    set({ postSubscription: newSub });
  },

  unsubscribeFromPosts: () => {
    const currentSub = get().postSubscription;
    if (!currentSub) return;
    supabase.removeChannel(currentSub);
    set({ postSubscription: null });
  },

  reset: () => set({ posts: [], isLoading: false, postSubscription: null }),
}));
