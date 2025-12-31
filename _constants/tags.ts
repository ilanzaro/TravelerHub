export type TagCategory = {
  title: string;
  tags: string[];
  multiSelect: boolean;
};

export type TagCategories = {
  "travel-style": TagCategory;
  activities: TagCategory;
  lifestyle: TagCategory;
  "urban-leisure": TagCategory;
};

export type SelectedTags = {
  "travel-style": string | null;
  activities: string[];
  lifestyle: string[];
  "urban-leisure": string[];
};

export const tagCategories: TagCategories = {
  "travel-style": {
    title: "Travel Style",
    tags: ["family", "couple", "solo", "group", "digital nomad"],
    multiSelect: false,
  },
  activities: {
    title: "Activities & Adventure",
    tags: [
      "hiking",
      "diving",
      "skiing",
      "climbing",
      "surfing",
      "biking",
      "running",
      "adventure",
      "nature",
    ],
    multiSelect: true,
  },
  lifestyle: {
    title: "Mind, Culture & Lifestyle",
    tags: [
      "yoga",
      "meditation",
      "spiritual",
      "wellness",
      "architecture",
      "history",
      "culture",
      "art",
      "music",
      "backpacking",
    ],
    multiSelect: true,
  },
  "urban-leisure": {
    title: "Urban, Social & Leisure",
    tags: ["food", "photography", "nightlife", "shopping", "relaxing"],
    multiSelect: true,
  },
};
