import UserDataType from '../types/UserDataType';
import BarChartStats from './BarChartStats';

interface GraphsProps {
  user: string;
  kdData: { name: string; kd: number }[];
  winrateData: { name: string; winrate: number }[];
  winData: { name: string; wins: number }[];
  compare: UserDataType | null;
  compareUser: string;
  isDarkMode: boolean;
}

export default function Graphs({
  user,
  kdData,
  winrateData,
  winData,
  compare,
  compareUser,
  isDarkMode,
}: GraphsProps) {
  return (
    <>
      <div className='skeleton-card graphs-container'>
        <div className='graphs'>
          <div className={`skeleton-card ${isDarkMode ? 'dark-mode' : ''}`}>
          <div className='stats-item-graph'>
            <h2>K/D ratio</h2>
            <BarChartStats
              label="K/D"
              user={user}
              userData={{
                solo: kdData[0].kd,
                duo: kdData[1].kd,
                squad: kdData[2].kd,
              }}
              compareUser={compare ? compareUser : undefined}
              compareData={
                compare
                  ? {
                      solo: compare.stats.solo?.kd ?? 0,
                      duo: compare.stats.duo?.kd ?? 0,
                      squad: compare.stats.squad?.kd ?? 0,
                    }
                  : undefined
              }
            />
            </div>
          </div>
        </div>
      <div className={`skeleton-card ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className='stats-item-graph'>
          <h2>win rate %</h2>
          <BarChartStats
            label="Win Rate"
            user={user}
            userData={{
              solo: winrateData[0].winrate,
              duo: winrateData[1].winrate,
              squad: winrateData[2].winrate,
            }}
            compareUser={compare ? compareUser : undefined}
            compareData={
              compare
                ? {
                    solo: compare.stats.solo?.winRate ?? 0,
                    duo: compare.stats.duo?.winRate ?? 0,
                    squad: compare.stats.squad?.winRate ?? 0,
                  }
                : undefined
            }
          />
        </div>
      </div>
      <div className='skeleton-card'>
        <div className='stats-item-graph'>
          <h2>wins</h2>
          <BarChartStats
            label="Wins"
            user={user}
            userData={{
              solo: winData[0].wins,
              duo: winData[1].wins,
              squad: winData[2].wins,
            }}
            compareUser={compare ? compareUser : undefined}
            compareData={
              compare
                ? {
                    solo: compare.stats.solo?.wins ?? 0,
                    duo: compare.stats.duo?.wins ?? 0,
                    squad: compare.stats.squad?.wins ?? 0,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
    </>
  );
}