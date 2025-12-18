export const GAME_MODES = ["solo", "duo", "squad"] as const;
export type GameMode = typeof GAME_MODES[number];

export const STORE_CATEGORIES = [
  { key: "emotes", label: "Emotes" },
  { key: "outfits", label: "Outfits" },
  { key: "backblings", label: "Backblings" },
  { key: "gliders", label: "Gliders" },
  { key: "wraps", label: "Wraps" },
] as const;

export const VBUCKS_ICON_URL = "https://static.wikia.nocookie.net/fortnite/images/e/eb/V-Bucks_-_Icon_-_Fortnite.png";

export const SKELETON_ITEM_COUNT = 20;