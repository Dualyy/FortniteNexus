export type UserDataType = {
  image: string;
  username: string;
  lastModified?: string;
  raw?: object; // Raw data from the API, can be used for debugging or further
  data?: {
    stats: {
      all: {
        overall: {
          wins: number;
          matches: number;
          kd: number;
          winRate: number;
          lastModified?: string;
        };
        solo: {
          kd: number;
          winRate: number;
          wins: number;
        };
        duo: {
          kd: number;
          winRate: number;
          wins: number;
        };
        squad: {
          kd: number;
          winRate: number;
          wins: number;
        };
      };
    };
    battlePass: {
      level: number;
      progress: number;
    };
  };
  stats?: {
    overall: {
      wins: number;
      matches: number;
      kd: number;
      winRate: number;
    };
    solo: {
      kd: number;
      winRate: number;
      wins: number;
    };
    duo: {
      kd: number;
      winRate: number;
      wins: number;
    };
    squad: {
      kd: number;
      winRate: number;
      wins: number;
    };
  };
  battlePass?: {
    level: number;
    progress: number;
  };

};

export default UserDataType;