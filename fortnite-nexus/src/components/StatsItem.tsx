

export default function StatsItem({userData}: {userData: {wins: number, matches: number, kd: number}}) {

//functions
function getWins() {
  if (userData) {
    console.log(userData);
    return userData.wins;
  }
}

function getMatches() {
  if (userData) {
    return userData.matches;
  }
}

function getKd() {
  if (userData) {
    return userData.kd;
  }
}

function getWinRate() {
  if (userData) {
    const winRate = (userData.wins / userData.matches) * 100;
    return winRate.toFixed(2);
  }
}

  return (<>
 <div className="skeleton-card">
  <div className="header-user-stat">
  <h2>Performance overview</h2>
  </div>
  <div className='stats-item-container'>
   <div className='stats-item'>
          <h4>Wins</h4>
          <h3>{getWins()}</h3>
          </div>
        <div className='stats-item'>
          <h4>Matches played</h4>
          <h3>{getMatches()}</h3>
        </div>
        <div className='stats-item'>
          <h4>K/D</h4>
          <h3>{getKd()}</h3>
        </div>
        <div className='stats-item'>
          <h4>win rate</h4>
          <h3>{getWinRate()}</h3>
        </div>
        </div>
        </div>
        </>)
}
