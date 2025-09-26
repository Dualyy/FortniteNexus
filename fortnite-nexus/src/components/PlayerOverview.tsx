import React from 'react';
import { nanoid } from 'nanoid';
import Profile from './Profile';
import Versus from './Versus';
import StatsItem from './StatsItem';
import StatsItemWithCompare from './StatsWithCompare';
import Graphs from './Graphs';
import { UserDataType } from '../types/UserDataType';

interface PlayerOverviewProps {
  user: string;
  userData: UserDataType;
  compare: UserDataType | null;
  compareUser: string;
  kdData: { name: string; kd: number }[];
  winrateData: { name: string; winrate: number }[];
  winData: { name: string; wins: number }[];
  isDarkMode: boolean;
  deleteUser: () => void;
  deleteCompareUser: () => void;
}

export default function PlayerOverview({
  user,
  userData,
  compare,
  compareUser,
  kdData,
  winrateData,
  winData,
  isDarkMode,
  deleteUser,
  deleteCompareUser,
}: PlayerOverviewProps) {
    console.log(userData.overall);
  if (!user) return null;
  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className='paragraph'>
        <div className='profile-container'>
          <Profile
            onDelete={deleteUser}
            whatUser={user}
            profileClass='profile-one'
            orientation='left'
            whatUserData={userData}
            id={nanoid()}
          />
          {compare ? <Versus /> : ""}
          {compare ? (
            <Profile
              onDelete={deleteCompareUser}
              whatUser={compareUser}
              profileClass='profile-two'
              orientation='right'
              whatUserData={compare}
              id={nanoid()}
            />
          ) : ""}
        </div>
        <div>
          <br />
          <div className='stats-container'>
            {/* Performance Overview Section */}
            <div className="skeleton-card">
                <div className="stats-item-container">
                    {compare ? (
                      <StatsItemWithCompare user={user} compare={compare} userData={userData.stats.overall} />
                    ) : (
                      <StatsItem userData={userData.stats.overall} />
                    )}
                </div>
            </div>

            {/* Graphs Section */}
            <div className="graphs-container">
                <Graphs
                  user={user}
                  kdData={kdData}
                  winrateData={winrateData}
                  winData={winData}
                  compare={compare}
                  compareUser={compareUser}
                  isDarkMode={isDarkMode}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}