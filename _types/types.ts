export type Profile = {
  id: string;
  email: string;
  name?: string;
  avatar_urls: string[];
  last_location?: { latitude: number; longitude: number };
  last_online?: string;
  settings_show_age: boolean;
  settings_theme: "light" | "dark" | "auto";
  settings_show_distance: boolean;
  settings_units: "metric" | "imperial";
  provider: "email" | "google";
  email_verified: boolean;
  tags: Record<string, any>;
  country?: string;
  birth_date?: string;
  bio?: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
};

export type PublicProfile = Omit<Profile, "email" | "deleted_at">;

export type Conversation = {
  id: string;
  user_a: string;
  user_b: string;
  last_message_id?: string;
  last_message_at?: string;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at?: string;
  edited_at?: string;
  deleted_at?: string;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  type: "postcard" | "travelmate";
  description?: string;
  photo_url?: string;
  location?: { latitude: number; longitude: number };
  tags?: Record<string, any>;
  created_at: string;
  expires_at: string;
};

export type ProfileInterest = {
  profile_id: string;
  target_profile_id: string;
  created_at: string;
};

export type ProfileViewer = {
  id: string;
  profile_id: string;
  viewer_id: string;
  viewed_at: string;
  expires_at: string;
};
