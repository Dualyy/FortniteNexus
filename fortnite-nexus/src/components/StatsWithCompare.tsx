export default function  StatsItemWithCompare({user, userData, compare}:
     {user: string,
         userData: {
            wins: number,
            matches: number,
            kd: number,
            lastModified?: string},
            compare?: {username: string,
                 stats?: {overall: {wins: number, matches: number, kd: number, winRate: number}},
                  lastModified?: string}}) {
                    const statKeys = [
  { key: "wins", label: "Wins" },
  { key: "matches", label: "Matches played" },
  { key: "kd", label: "K/D" },
  { key: "winRate", label: "Win rate", format: (v: number) => v.toFixed(2) + "%" }
];
  const userStats = {
    wins: userData.wins ?? 0,
    matches: userData.matches ?? 0,
    kd: userData.kd,
    winRate: (userData.wins / userData.matches) * 100 || 0,
  };
  const compareStats = {
    wins: compare?.stats?.overall?.wins ?? 0,
    matches: compare?.stats?.overall?.matches ?? 0,
    kd: compare?.stats?.overall?.kd ?? 0,
    winRate: compare?.stats?.overall?.winRate ?? 0,
  };

  function getStatBg(userValue: number, compareValue: number) {
  if (userValue > compareValue) return "green";
  if (userValue < compareValue) return "red";
  return "gray"; // or leave as default
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
                color: getStatBg(userStats[key], compareStats[key])
              }}
            >
              <h4>{label}</h4>
              <h3>{format ? format(userStats[key]) : userStats[key]}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="user2">
        <div className="header-user-stat">
          <h3>{compare?.username}</h3>
          <p className="lastUpdate">
            {new Date(compare?.lastModified ?? "").toString()}
          </p>
        </div>
        <div className="user-stats-info">
          {statKeys.map(({ key, label, format }) => (
            <div
              key={key}
              className="stats-item"
              style={{
                color: getStatBg(compareStats[key], userStats[key])
              }}
            >
              <h4>{label}</h4>
              <h3>{format ? format(compareStats[key]) : compareStats[key]}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

