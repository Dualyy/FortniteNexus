import { useState, useEffect } from 'react';
import { fortniteApi } from '../services/fortniteApi';
import { UserDataType } from '../types/UserDataType';

const MODES = ["solo", "duo", "squad"] as const;

export function useFortniteStats() {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [user, setUser] = useState("");
  const [compare, setCompare] = useState<UserDataType | null>(null);
  const [compareUser, setCompareUser] = useState("");

  const [kdData, setKdData] = useState(
    MODES.map(name => ({ name, kd: 0, winrate: 0, wins: 0 }))
  );
  const [winrateData, setWinRateData] = useState(
    MODES.map(name => ({ name, kd: 0, winrate: 0, wins: 0 }))
  );
  const [winData, setWinData] = useState(
    MODES.map(name => ({ name, kd: 0, winrate: 0, wins: 0 }))
  );

  const fetchPlayerStats = async (searchParam: string | FormData): Promise<UserDataType | null> => {
    let username: string;

    if (typeof searchParam === 'string') {
      username = searchParam;
    } else if (searchParam instanceof FormData) {
      username = searchParam.get('search') as string;
    } else {
      return null;
    }

    return await fortniteApi.getPlayerStats(username);
  };

  const deleteUser = () => {
    if (compareUser) {
      setUserData(compare);
      setUser(compareUser);
      setCompare(null);
      setCompareUser("");
    } else {
      setUserData(null);
      setUser("");
    }
  };

  const deleteCompareUser = () => {
    setCompare(null);
    setCompareUser("");
  };

  const handleFormSubmit = async (formData: FormData) => {
    const searchValue = (formData.get('search') as string)?.trim();
    const isCompare = formData.get('compare') === 'on';

    if (!searchValue) return { success: false, error: 'Please enter a username' };

    if (isCompare && searchValue === user) {
      return { success: false, error: "Can't compare to self" };
    }

    const result = await fetchPlayerStats(formData);
    if (!result) {
      return { success: false, error: 'Error fetching data. Please try again later.' };
    }

    if (isCompare) {
      setCompareUser(result.username);
      setCompare(result);
    } else {
      setUser(result.username);
      setUserData(result);
    }

    return { success: true };
  };

  // Update chart data when userData changes
  useEffect(() => {
    if (!userData?.stats) return;

    const stats = userData.stats;

    setKdData(MODES.map(mode => ({
      name: mode,
      kd: stats[mode]?.kd ?? 0,
      winrate: 0,
      wins: 0
    })));

    setWinRateData(MODES.map(mode => ({
      name: mode,
      kd: 0,
      winrate: stats[mode]?.winRate ?? 0,
      wins: 0
    })));

    setWinData(MODES.map(mode => ({
      name: mode,
      kd: 0,
      winrate: 0,
      wins: stats[mode]?.wins ?? 0
    })));
  }, [userData]);

  return {
    userData,
    user,
    compare,
    compareUser,
    kdData,
    winrateData,
    winData,
    handleFormSubmit,
    deleteUser,
    deleteCompareUser,
    fetchPlayerStats
  };
}