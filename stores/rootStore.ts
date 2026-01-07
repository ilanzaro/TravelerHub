import { useChatStore } from "./chatStore";
import { useInterestsStore } from "./interestsStore";
import { usePostsStore } from "./postsStore";
import { useProfileStore } from "./profilesStore";
import { useViewersStore } from "./viewersStore";

export const RootStore = {
  profile: useProfileStore,
  chat: useChatStore,
  interests: useInterestsStore,
  posts: usePostsStore,
  viewers: useViewersStore,

  resetAll: () => {
    useProfileStore.getState().reset();
    useChatStore.getState().reset();
    useInterestsStore.getState().reset();
    usePostsStore.getState().reset();
    useViewersStore.getState().reset();
  },
};
