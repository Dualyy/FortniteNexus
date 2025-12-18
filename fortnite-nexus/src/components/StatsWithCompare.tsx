import { UserDataType, StatsDetail } from '../types/UserDataType';

interface StatsWithCompareProps {
  user: string;
  userData: StatsDetail;
  compare: UserDataType;
}

export default function StatsItemWithCompare({ user, userData, compare }: StatsWithCompareProps) {
  const statKeys = [
    { key: "wins", label: "Wins" },
    { key: "matches", label: "Matches played" },
    { key: "kd", label: "K/D" },
    { key: "winRate", label: "Win rate", format: (v: number) => v.toFixed(2) + "%" }
  ];

  const userStats = {
    wins: userData.wins ?? 0,
    matches: userData.matches ?? 0,
    kd: userData.kd ?? 0,
    winRate: userData.winRate ?? 0,
  };

  const compareStats = {
    wins: compare.stats.overall.wins ?? 0,
    matches: compare.stats.overall.matches ?? 0,
    kd: compare.stats.overall.kd ?? 0,
    winRate: compare.stats.overall.winRate ?? 0,
  };

  function getStatColor(userValue: number, compareValue: number) {
    if (userValue > compareValue) return "var(--success)";
    if (userValue < compareValue) return "var(--danger)";
    return "var(--text-secondary)";
  }

  function getStatIcon(userValue: number, compareValue: number) {
    if (userValue > compareValue) return "📈";
    if (userValue < compareValue) return "📉";
    return "⚪";
  }

  return (
    <div className="skeleton-card stats-item-with-compare">
      <div className="user1">
        <div className="header-user-stat">
          <h3>{user}</h3>
          <p className="lastUpdate">
            ({new Date(userData?.lastModified ?? "").toString()})
          </p>
        </div>
        <div className="user-stats-info">
          {statKeys.map(({ key, label, format }) => (
            <div
              key={key}
              className="stats-item"
              style={{
                color: getStatColor(userStats[key as keyof typeof userStats], compareStats[key as keyof typeof compareStats])
              }}
            >
              <h4>{label} {getStatIcon(userStats[key as keyof typeof userStats], compareStats[key as keyof typeof compareStats])}</h4>
              <h3>{format ? format(userStats[key as keyof typeof userStats]) : userStats[key as keyof typeof userStats]}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="user2">
        <div className="header-user-stat">
          <h3>{compare.username}</h3>
          <p className="lastUpdate">
            {new Date(compare.lastModified ?? "").toString()}
          </p>
        </div>
        <div className="user-stats-info">
          {statKeys.map(({ key, label, format }) => (
            <div
              key={key}
              className="stats-item"
              style={{
                color: getStatColor(compareStats[key as keyof typeof compareStats], userStats[key as keyof typeof userStats])
              }}
            >
              <h4>{label} {getStatIcon(compareStats[key as keyof typeof compareStats], userStats[key as keyof typeof userStats])}</h4>
              <h3>{format ? format(compareStats[key as keyof typeof compareStats]) : compareStats[key as keyof typeof compareStats]}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}