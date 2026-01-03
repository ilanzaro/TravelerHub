import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useInterestsStore } from "@/stores/interestsStore";
import { usePostsStore } from "@/stores/postsStore";
import { useProfileStore } from "@/stores/profilesStore";
import { useViewersStore } from "@/stores/viewersStore";

export function initAuthListener() {
  //Initial session (app launch / reload)
  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({
      session: data.session,
      user: data.session?.user ?? null,
      initialized: true,
    });

    if (data.session?.user) {
      useProfileStore.getState().fetchMyProfile();
    }
  });

  //Auth changes (login / logout / refresh)
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      session,
      user: session?.user ?? null,
    });

    if (session?.user) {
      useProfileStore.getState().fetchMyProfile();
    } else {
      //full app reset on logout
      useProfileStore.getState().reset?.();
      useChatStore.getState().reset();
      usePostsStore.getState().reset();
      useViewersStore.getState().reset();
      useInterestsStore.getState().reset();
    }
  });
}
