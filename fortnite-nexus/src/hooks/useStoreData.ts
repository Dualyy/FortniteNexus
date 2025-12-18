import { useState, useEffect } from 'react';
import { fortniteApi, StoreItem } from '../services/fortniteApi';

export interface CategorizedStore {
  emotes: StoreItem[];
  outfits: StoreItem[];
  wraps: StoreItem[];
  backblings: StoreItem[];
  gliders: StoreItem[];
  pickaxe: StoreItem[];
}

const STORE_CATEGORIES = {
  "Emote": "emotes",
  "Outfit": "outfits",
  "Wrap": "wraps",
  "Back Bling": "backblings",
  "Glider": "gliders",
  "Pickaxe": "pickaxe"
} as const;

export function useStoreData() {
  const [storeData, setStoreData] = useState<{data?: {entries: unknown[]}} | null>(null);
  const [loading, setLoading] = useState(true);
  const [categorizedStore, setCategorizedStore] = useState<CategorizedStore>({
    emotes: [],
    outfits: [],
    wraps: [],
    backblings: [],
    gliders: [],
    pickaxe: []
  });

  const categorizeStoreItems = (items: StoreItem[]): CategorizedStore => {
    const categorized: CategorizedStore = {
      emotes: [],
      outfits: [],
      wraps: [],
      backblings: [],
      gliders: [],
      pickaxe: []
    };

    items.forEach(item => {
      const categoryKey = STORE_CATEGORIES[item.ItemType as keyof typeof STORE_CATEGORIES];
      if (categoryKey && categorized[categoryKey]) {
        categorized[categoryKey].push(item);
      }
    });

    return categorized;
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await fortniteApi.getStoreData();
        if (response) {
          setStoreData(response);
          const mappedItems = fortniteApi.mapStoreData(response);
          const categorized = categorizeStoreItems(mappedItems);
          setCategorizedStore(categorized);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  return {
    storeData,
    categorizedStore,
    loading
  };
}