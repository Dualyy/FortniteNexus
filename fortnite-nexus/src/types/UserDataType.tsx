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

export default UserDataType;