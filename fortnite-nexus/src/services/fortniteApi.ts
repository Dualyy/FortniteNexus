import axios from 'axios';

const API_CONFIG = {
  API_KEY: import.meta.env.VITE_API_KEY,
  BASE_URL: 'https://fortnite-api.com/v2/stats/br/v2',
  SHOP_URL: 'https://fortnite-api.com/v2/shop',
  COSMETICS_URL: 'https://fortnite-api.com/v2/cosmetics/br/'
};

export interface StatsDetail {
  wins: number;
  matches: number;
  kills: number;
  kd: number;
  winRate: number;
  lastModified: string;
}

export interface AllStats {
  overall: StatsDetail;
  solo: StatsDetail;
  duo: StatsDetail;
  squad: StatsDetail;
  ltm: StatsDetail;
}

export interface UserDataType {
  username: string;
  battlePass: { level: number; progress: number; };
  image: string | null;
  stats: AllStats;
  lastModified: string;
}

export interface StoreItem {
  itemName: string;
  ItemType: string;
  itemImage: string;
  itemPrice: number;
}


class FortniteApiService {
  private async makeRequest<T>(url: string, requiresAuth = true): Promise<T> {
    try {
      const headers = requiresAuth ? { Authorization: API_CONFIG.API_KEY } : {};
      const response = await axios.get(url, { headers });

      if (response.status !== 200 || !response.data || response.data.error) {
        throw new ApiError(`API request failed: ${response.data?.error || 'Unknown error'}`, response.status);
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred', 0);
    }
  }

  async getPlayerStats(username: string): Promise<UserDataType | null> {
    try {
      const sanitizedUsername = this.sanitizeUsername(username);
      const url = `${API_CONFIG.BASE_URL}?name=${sanitizedUsername}`;

      interface PlayerStatsResponse {
        data: {
          battlePass: { level: number; progress: number };
          image: string | null;
          stats: { all: AllStats };
        };
      }

      const response = await this.makeRequest<PlayerStatsResponse>(url);
      const { battlePass, image, stats } = response.data;

      return {
        username: sanitizedUsername,
        battlePass,
        image,
        stats: stats.all,
        lastModified: stats.all.overall.lastModified
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
  }

  async getStoreData(): Promise<{data?: {entries: unknown[]}} | null> {
    try {
      const response = await this.makeRequest<{data?: {entries: unknown[]}}>(API_CONFIG.SHOP_URL, false);
      return response;
    } catch (error) {
      console.error('Error fetching store data:', error);
      return null;
    }
  }

  async getCosmeticsData(): Promise<string[]> {
    try {
      interface CosmeticsResponse {
        data: Array<{
          type: { value: string };
          images: { icon: string };
        }>;
      }

      const response = await this.makeRequest<CosmeticsResponse>(API_CONFIG.COSMETICS_URL, false);
      const cosmetics = response.data.filter((skin) => skin.type.value === "outfit");
      return cosmetics.map((skin) => skin.images.icon);
    } catch (error) {
      console.error('Error fetching cosmetics data:', error);
      return [];
    }
  }

  private sanitizeUsername(username: string): string {
    return username.trim().replace(/[^\w].-'/g, '').slice(0, 32);
  }

  mapStoreData(storeData: {data?: {entries: Array<{brItems?: Array<{name: string, type: {displayValue: string}}>, newDisplayAsset?: {renderImages: Array<{image: string}>}, finalPrice: number}>}} | null): StoreItem[] {
    if (!storeData) {
      return [];
    }

    return storeData.data?.entries.map((item) => ({
      itemName: item.brItems && item.brItems.length > 0 ? item.brItems[0].name : "Unknown",
      ItemType: item.brItems && item.brItems.length > 0 ? item.brItems[0].type.displayValue : "Unknown",
      itemImage: item.newDisplayAsset?.renderImages[0]?.image || '',
      itemPrice: item.finalPrice
    })) || [];
  }
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fortniteApi = new FortniteApiService();
export default fortniteApi;